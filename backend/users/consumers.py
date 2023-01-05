import json, jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import CustomUser
from django.conf import settings
from asgiref.sync import sync_to_async
from django.db.models import Q


class FriendsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.token = self.scope['url_route']['kwargs']['token']

        # Decode JWT token, and get user id
        self.jwt_token = jwt.decode(self.token, settings.SECRET_KEY, algorithms="HS256")
        self.user_id = self.jwt_token['user_id']

        # Get user
        self.user = await sync_to_async(CustomUser.objects.get)(id=self.user_id)

        if not self.user.is_authenticated:
            self.close()
        else:
            # Create room group name
            self.room_group_name = f"friendlist_{self.user_id}"

            user = await sync_to_async(CustomUser.objects.filter)(id=self.user_id)

            # Update user's online status
            await sync_to_async(user.update)(is_online=True)

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            # Accept connection
            await self.accept()

            # Send friend's status codes to the user's friendlist group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': 'Hello there'
                }
            )

    async def send_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


class SearchFriendConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        self.typed = json.loads(text_data)['typed']
        
        # Finding the users that matches the typed text
        results = await sync_to_async(CustomUser.objects.filter)(
            Q(username__icontains=self.typed) | Q(email__icontains=self.typed)
        )
        results = await sync_to_async(list)(results.values('id', 'username'))

        await self.send(json.dumps({'results': results}))

    async def disconnect(self, close_code):
        await self.close(close_code)


{
    'type': 'websocket',
    'path': '/ws/search-friend/',
    'raw_path': b'/ws/search-friend/',
    'headers': [
        (b'host',
        b'localhost:8000'),
        (b'connection',
        b'Upgrade'),
        (b'pragma',
        b'no-cache'),
        (b'cache-control',
        b'no-cache'),
        (b'user-agent',
        b'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/108.0.0.0 Safari/537.36'),
        (b'upgrade',
        b'websocket'),
        (b'origin',
        b'http://localhost:3000'),
        (b'sec-websocket-version',
        b'13'),
        (b'accept-encoding',
        b'gzip,deflate,br'),
        (b'accept-language',b'en-US,n;q=0.9'),
        (b'cookie',
        b'csrftoken=CGL08VFD22Zo71fhbrQDcLCFDk1iRAKW; sessionid=hkbqr37t28bejrar37dzoafqspt1z1my'),
        (b'sec-websocket-key',
        b'RNXjshR4b52ooHayAB3TpQ=='),
        (b'sec-websocket-extensions',
        b'permessage-deflate; client_max_window_bits')
    ],
    'query_string': b'',
    'client': ['127.0.0.1', 52572],
    'server': ['127.0.0.1', 8000],
    'subprotocols': [],
    'asgi': {'version': '3.0'},
    'cookies': {'csrftoken': 'CGL08VFD22Zo71fhbrQDcLCFDk1iRAKW',
    'sessionid': 'hkbqr37t28bejrar37dzoafqspt1z1my'},
    'session': '<django.utils.functional.LazyObject object at 0x7f71cb231e20>',
    'user': '<channels.auth.UserLazyObject object at 0x7f71cb221ee0>',
    'path_remaining': '',
    'url_route': {'args': (),
    'kwargs': {}}
}