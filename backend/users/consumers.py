import json, jwt, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.conf import settings
from django.utils import timezone
from jwt.exceptions import ExpiredSignatureError

from .models import CustomUser, Chat, Message
from .consumer_utils import *


# Searching for friends (/search-friend)
class SearchFriendConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        # Getting the user's input
        self.typed = json.loads(text_data)['typed']
        
        results = await search(self.typed)

        await self.send(json.dumps({'results': results}))

    async def disconnect(self, close_code):
        await self.close(close_code)


# Chatting between users (/chat)
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        chat_id = self.scope['url_route']['kwargs']['chat_id']

        # Getting the chat object
        self.chat = await database_sync_to_async(Chat.objects.get)(uuid=chat_id)
        self.room_group_name = chat_id

        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

    async def fetch_messages(self):
        # Fetching the messages of the chat from the database
        # and sending them to the client
        context = await get_messages_context(self.chat)
        await self.send(text_data=json.dumps(context))

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        # If the client is initially requesting the messages
        try:
            command = text_data_json['command']
            if command == 'fetch_messages':
                await self.fetch_messages()
                return
        except KeyError:
            pass

        message = text_data_json['message']
        sender = text_data_json['sender']
        timestamp = text_data_json['timestamp']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': message,
                'sender': sender,
                'timestamp': timestamp
            }
        )

        # Getting the sender user
        sender = await database_sync_to_async(CustomUser.objects.get)(id=sender)

        # Saving the message to the database
        msg = await database_sync_to_async(Message.objects.create)(
            text=message,
            sender=sender
        )
        await database_sync_to_async(self.chat.messages.add)(msg)

    async def send_message(self, event):
        # Used to send a message to the chat, when one of the users sends a message
        message = event['message']
        sender = event['sender']
        timestamp = event['timestamp']

        context = {
            'message': message,
            'sender': sender,
            'timestamp' : timestamp
        }

        await self.send(text_data=json.dumps([context]))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )


# Updating the user's online status, as well their last login time
class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope['url_route']['kwargs']['token']

        # Should the websocket send updates or not
        self.paused = False
        # Getting the user
        await self.set_user(token)
        # Updating the user's online status, and last login time
        await update_user(self.user, is_online=True, last_login=timezone.now())
        # Starting live updates
        self.updates_on = "status"
        self.thread = asyncio.create_task(self.send_updates())
        # Accepting the conection
        await self.accept()

    async def receive(self, text_data):
        # Data recieved
        data = json.loads(text_data)

        # Front end is pausing/resuming the updates
        if "paused" in data:
            self.paused = data["paused"]
            if not self.paused:
                self.thread = asyncio.create_task(self.send_updates())

        # Front end wants updates on new fields of the user
        if "updates_on" in data:
            self.updates_on = data["updates_on"]

        # User has logged out and logged in with a different account
        if "new_refresh" in data:
            # Updating the user's last login time, and getting the new user if there is one
            await self.set_user(data["new_refresh"])
            await update_user(self.user, last_login=timezone.now())

        # Updating the user's online status
        if "is_online" in data:
            await update_user(self.user, is_online=data["is_online"], last_login=timezone.now())

    async def set_user(self, token):
        # This function sets the user based on the JWT access token given
        try:
            jwt_token = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            self.user_id = jwt_token['user_id']
            self.user = await database_sync_to_async(CustomUser.objects.filter)(id=self.user_id)
        except ExpiredSignatureError:
            await self.close()
            return
    
    async def send_updates(self):
        while not self.paused:
            # Send an update to the client with the current list of friends and friend requests
            response = await get_updates(self.user_id, self.updates_on)
            await self.send(text_data=json.dumps(response))
            await asyncio.sleep(settings.UPDATE_INTERVAL)

    async def disconnect(self, close_code):
        # User has left the lobby, so deleting all match requests
        await reset_match_requests(self.user)
        # Updating user's online status
        await update_user(self.user, is_online=False, last_login=timezone.now())
        # Canceling the asyncio thread
        try:
            self.thread.cancel()
        except AttributeError:
            pass
        # Closing connection
        await self.close(close_code)

