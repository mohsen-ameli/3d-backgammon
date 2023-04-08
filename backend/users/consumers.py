import asyncio
import json
import jwt

from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.utils import timezone
from jwt.exceptions import ExpiredSignatureError

from .consumer_utils import *
from .models import Chat, CustomUser, Message

'''
    Searching for friends (/search-friend)
'''

class SearchFriendConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        # Getting the user's input
        self.typed = json.loads(text_data)["typed"]

        results = await search(self.typed)

        await self.send(json.dumps({"results": results}))

    async def disconnect(self, close_code):
        await self.close(close_code)


'''
    Chatting between users (/chat)
'''

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        chat_id = self.scope["url_route"]["kwargs"]["chat_id"]

        # Getting the chat object
        self.chat = await database_sync_to_async(Chat.objects.get)(uuid=chat_id)
        self.room_group_name = chat_id

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def receive(self, text_data):
        '''
            One of the users has sent a message over
            Or frontend wants initial data
        '''

        data = json.loads(text_data)

        # If the client is initially requesting the messages
        if "command" in data:
            await self.fetch_messages()
            return

        message = data["message"]
        sender = data["sender"]
        timestamp = data["timestamp"]

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send_message",
                "message": message,
                "sender": sender,
                "timestamp": timestamp,
            },
        )

        # Getting the sender user
        sender = await database_sync_to_async(CustomUser.objects.get)(id=sender)

        # Saving the message to the database
        msg = await database_sync_to_async(Message.objects.create)(
            text=message,
            sender=sender
        )
        await database_sync_to_async(self.chat.messages.add)(msg)

    async def fetch_messages(self):
        '''
            Fetching the messages of the chat from the database
            and sending them to the client
        '''

        context = await get_all_chat_msg(self.chat)
        await self.send(text_data=json.dumps(context))

    async def send_message(self, event):
        '''
            Used to send a message to the chat, when one of the users sends a message
        '''

        message = event["message"]
        sender = event["sender"]
        timestamp = event["timestamp"]

        context = {"message": message, "sender": sender, "timestamp": timestamp}

        await self.send(text_data=json.dumps([context]))

    async def disconnect(self, close_code):
        '''
            Disconnecting a user from the chat consumer
        '''

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


'''
    Updating the user's online status, as well their last login time.
    This consumer is persistent throughout the users session, even when
    they're in a game.
'''

class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope["url_route"]["kwargs"]["token"]

        # Getting the user
        await self.set_user(token)
        # Updating the user's online status, and last login time
        await update_user(self.user, is_online=True, last_login=timezone.now())

        # Starting live updates
        self.updates_on = "status"
        # Should the websocket send updates or not
        self.paused = False
        # Async function to send updates every x amount of seconds
        self.thread = asyncio.create_task(self.send_updates())

        await self.accept()

    async def receive(self, text_data):
        '''
            User has done something in the frontend
        '''

        data = json.loads(text_data)

        # Frontend is pausing/resuming the updates (Aka a live game has started)
        if "paused" in data:
            await reset_match_requests(self.user)

            self.paused = data["paused"]
            if not self.paused:
                self.thread = asyncio.create_task(self.send_updates())

        # Frontend wants updates on new fields of the user
        if "updates_on" in data:
            self.updates_on = data["updates_on"]

        # User has logged out and logged in with a different account
        if "new_refresh" in data:
            # Updating the user's last login time, and getting the new user if there is one
            await self.set_user(data["new_refresh"])
            await update_user(self.user, last_login=timezone.now())

        # Updating the user's online status
        if "is_online" in data:
            await update_user(
                self.user, is_online=data["is_online"], last_login=timezone.now()
            )

    async def set_user(self, token):
        '''
            This function sets/saves the user to memory based on the JWT access token given
        '''

        try:
            jwt_token = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            self.user_id = jwt_token["user_id"]
            self.user = await database_sync_to_async(CustomUser.objects.filter)(id=self.user_id)
        except ExpiredSignatureError:
            await self.close()
            return

    async def send_updates(self):
        '''
            Asynchronous updates. For example, if one of the users friends send them
            a game request, and user is in their profile, this becomes essential.
        '''

        while not self.paused:
            # Send an update to the client with the current list of friends and friend requests
            response = await get_updates(self.user_id, self.updates_on)
            await self.send(text_data=json.dumps(response))
            await asyncio.sleep(settings.UPDATE_INTERVAL)

    async def disconnect(self, close_code):
        '''
            User has disconnected from the website.
        '''

        # User has left the lobby, so deleting all match requests
        await reset_match_requests(self.user)
        # Updating user's online status
        await update_user(self.user, is_online=False, last_login=timezone.now())
        # Canceling the asyncio thread
        try:
            self.thread.cancel()
        except AttributeError:
            pass

        await self.close(close_code)
