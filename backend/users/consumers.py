import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from .consumer_utils import *
from .signals import *
from .models import Chat, CustomUser, Message

'''
    Chatting between users
'''
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        chat_id = self.scope["url_route"]["kwargs"]["chat_id"]

        # Getting the chat object
        self.chat = await database_sync_to_async(Chat.objects.get)(uuid=chat_id)
        self.room_group_name = chat_id

        # Adding user to the group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accepting connection
        await self.accept()

        # Sending initial data
        await self.fetch_messages()

    async def receive(self, text_data):
        '''
            One of the users has sent a message over
            Or frontend wants initial data
        '''
        data = json.loads(text_data)

        message = data["message"]
        sender = data["sender"]
        timestamp = data["timestamp"]

        context = {
            "type": "send_message",
            "message": message,
            "sender": sender,
            "timestamp": timestamp,
        }

        # Sending the message to both users
        await self.channel_layer.group_send(self.room_group_name, context)

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
        context = {
            "message": event["message"],
            "sender": event["sender"],
            "timestamp": event["timestamp"]
        }
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
        # Get id from url
        self.id = self.scope["url_route"]["kwargs"]["id"]

        # Adding user to a group
        await self.channel_layer.group_add(
            f'user-status-{self.id}', self.channel_name
        )

        # Updating user's online status and last login time
        await update_user(self.id, is_online=True, last_login=timezone.now())

        # Accepting the connection
        await self.accept()

        await self.send_updates()

    async def send_updates(self, event = {}):
        '''
            Whenever the user's game requests or live game changes, we
            send out an update to the user(s).
        '''
        response = await get_user_game_requests(self.id)
        await self.send(text_data=json.dumps(response))

    async def disconnect(self, close_code):
        '''
            User has disconnected from the website.
        '''
        # User has left the lobby, so deleting all match requests
        await reset_match_requests(self.id)

        # Updating user's online status
        await update_user(self.id, is_online=False, last_login=timezone.now())
        
        # Closing connection
        await self.close(close_code)


'''
    Gets information about user's friends.
'''
class FriendsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get id from url
        self.id = self.scope["url_route"]["kwargs"]["id"]

        # Adding user to a group
        await self.channel_layer.group_add(
            f'user-{self.id}', self.channel_name
        )

        # Accepting connection
        await self.accept()
        
        # Sending initial data
        await self.send_updates()

    async def send_updates(self, event = {}):
        '''
            Updates for user's friend list, e.g. friends, friend's online status,
            number of requests, etc.
        '''
        response = await get_updates(self.id)
        await self.send(text_data=json.dumps(response))

    async def disconnect(self, close_code):
        '''
            User has left the friends page.
        '''
        await self.close(close_code)
