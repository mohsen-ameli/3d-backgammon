import json, jwt, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.conf import settings
from django.db.models import Q
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
        
        results = await self.search()

        await self.send(json.dumps({'results': results}))

    # Querying the database for matching username or email, based on user's input
    @database_sync_to_async
    def search(self):
        results = CustomUser.objects.filter(
            Q(username__iexact=self.typed) | Q(email__iexact=self.typed)
        )
        return list(results.values('id', 'username'))

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

    # Fetching the messages of the chat from the database
    # and sending them to the client
    async def fetch_messages(self):
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

    # Used to send a message to the chat, when one of the users sends a message
    async def send_message(self, event):
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


######### TODO: Combine FriendsListConsumer and StatusConsumer into one consumer #########

# Live updates for the friends of a user (/friends)
class FriendsListConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Getting the JWT access token from the url
        access_token = self.scope['url_route']['kwargs']['token']

        await self.set_user(access_token)
        
        # Creating an async task to send updates of the user's friend
        # List and friend requests to the client
        self.thread = asyncio.create_task(self.send_friends_update())

        await self.accept()

    async def disconnect(self, close_code):
        # Stopping the async thread, and disconnecting the client
        try:
            self.thread.cancel()
        except AttributeError:
            pass
        await self.close(close_code)

    # Function to set the user based on the JWT access token
    async def set_user(self, token):
        try:
            jwt_token = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            self.user_id = jwt_token['user_id']
        except ExpiredSignatureError:
            await self.close()
            return

    # Worker, that sends updates to the client every UPDATE_INTERVAL seconds
    async def send_friends_update(self):
        while True:
            # Send an update to the client with the current list of friends and friend requests
            response = await get_friends(self.user_id)
            await self.send(text_data=json.dumps(response))
            await asyncio.sleep(settings.UPDATE_INTERVAL)


# Updating the user's online status, as well their last login time
class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope['url_route']['kwargs']['token']

        # Getting the user
        await self.set_user(token)
        # Updating the user's online status, and last login time
        await update_user(self.user, is_online=True, last_login=timezone.now())
        
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)

        # User has logged out, and logged in with a different account
        try:
            # Updating the user's last login time, and getting the new user if there is one
            await self.set_user(data['new_refresh'])
            await update_user(self.user, last_login=timezone.now())
        except KeyError:
            pass

        # Updating the user's online status
        await update_user(self.user, is_online=data['is_online'], last_login=timezone.now())

    # Function to set the user based on the JWT access token
    async def set_user(self, token):
        try:
            jwt_token = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            self.user = await database_sync_to_async(CustomUser.objects.filter)(id=jwt_token['user_id'])
        except ExpiredSignatureError:
            await self.close()
            return
    
    async def disconnect(self, close_code):
        await update_user(self.user, is_online=False, last_login=timezone.now())
        await self.close(close_code)




# Sample output for self.scope
# {
#     'type': 'websocket',
#     'path': '/ws/search-friend/',
#     'raw_path': b'/ws/search-friend/',
#     'headers': [
#         (b'host',
#         b'localhost:8000'),
#         (b'connection',
#         b'Upgrade'),
#         (b'pragma',
#         b'no-cache'),
#         (b'cache-control',
#         b'no-cache'),
#         (b'user-agent',
#         b'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/108.0.0.0 Safari/537.36'),
#         (b'upgrade',
#         b'websocket'),
#         (b'origin',
#         b'http://localhost:3000'),
#         (b'sec-websocket-version',
#         b'13'),
#         (b'accept-encoding',
#         b'gzip,deflate,br'),
#         (b'accept-language',b'en-US,n;q=0.9'),
#         (b'cookie',
#         b'csrftoken=CGL08VFD22Zo71fhbrQDcLCFDk1iRAKW; sessionid=hkbqr37t28bejrar37dzoafqspt1z1my'),
#         (b'sec-websocket-key',
#         b'RNXjshR4b52ooHayAB3TpQ=='),
#         (b'sec-websocket-extensions',
#         b'permessage-deflate; client_max_window_bits')
#     ],
#     'query_string': b'',
#     'client': ['127.0.0.1', 52572],
#     'server': ['127.0.0.1', 8000],
#     'subprotocols': [],
#     'asgi': {'version': '3.0'},
#     'cookies': {'csrftoken': 'CGL08VFD22Zo71fhbrQDcLCFDk1iRAKW',
#     'sessionid': 'hkbqr37t28bejrar37dzoafqspt1z1my'},
#     'session': '<django.utils.functional.LazyObject object at 0x7f71cb231e20>',
#     'user': '<channels.auth.UserLazyObject object at 0x7f71cb221ee0>',
#     'path_remaining': '',
#     'url_route': {'args': (),
#     'kwargs': {}}
# }