import json, jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import CustomUser
from django.conf import settings
from asgiref.sync import sync_to_async


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