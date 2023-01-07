import json, jwt
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from .models import CustomUser
from django.conf import settings
from asgiref.sync import sync_to_async, async_to_sync
from django.db.models import Q
from time import sleep
import asyncio
from base64 import b64decode


# For searching for friends
class SearchFriendConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        self.typed = json.loads(text_data)['typed']
        
        # Finding the users that matches the typed text
        results = await sync_to_async(CustomUser.objects.filter)(
            Q(username__iexact=self.typed) | Q(email__iexact=self.typed)
        )
        results = await sync_to_async(list)(results.values('id', 'username'))

        await self.send(json.dumps({'results': results}))

    async def disconnect(self, close_code):
        await self.close(close_code)


# For chatting between users
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = self.chat_id

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'message': message
        }))

    def disconnect(self, close_code):
        # Get a list of all the members in the group
        # members = self.channel_layer.group_channels(self.room_group_name)
        # Disconnect each member
        # for member in members:
        #     self.channel_layer.group_discard(
        #         self.room_group_name,
        #         member
        #     )
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )


# See live updates on:
# 1: The status
# 2: Friend requests
# 3: Friends in general
# Query all friends, and number of friend requests, and send to the client

# For live updates of the friends of the user
class FriendsListConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Group name
        self.room_group_name = "friends_list"

        self.token = self.scope['url_route']['kwargs']['token']
        self.live = True

        # Decode JWT token, and get user id
        self.jwt_token = jwt.decode(self.token, settings.SECRET_KEY, algorithms="HS256")
        self.user_id = self.jwt_token['user_id']
        self.user = await sync_to_async(CustomUser.objects.get)(id=self.user_id)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        if self.user is not None:
            await self.accept()

        # Send an update to the client with the current list of friends and friend requests
        await self.channel_layer.group_send(
            self.room_group_name,
        {
            'type': 'send_friends_update',
            'live': self.live
        })

    async def disconnect(self, close_code):
        # Disconnect the client when the websocket closes
        sync_to_async(print)('Disconnecteddddddddddddddddddddddddd', close_code)
        self.live = False
        await self.close(close_code)

    async def send_friends_update(self, event):
        print("HEREEEEEEEEEEEEEE", event['live'])

        while self.live:
            if self.live == False:
                break
            
            # Send an update to the client with the current list of friends and friend requests
            response = await sync_to_async(get_friends)(self.user)
            
            await sync_to_async(print)(self.live)
            
            await self.send(text_data=json.dumps(response))
            # Sleeping
            await asyncio.sleep(5)
        


def get_friends(user) -> dict:
    dict_to_return = {}

    dict_to_return['num_requests'] = user.friend_requests.count()
    dict_to_return['friends'] = []

    for friend in user.friends.all():
        dict_to_return['friends'].append({'id': friend.id, 'username': friend.username, 'is_online': friend.is_online})

    return dict_to_return



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