import json, jwt, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.conf import settings
from django.utils import timezone

from .models import Game

class GameConsumer(AsyncWebsocketConsumer):
    users = 0
    
    async def connect(self):
        game_id = self.scope['url_route']['kwargs']['game_id']

        # Getting the game object
        self.game = await database_sync_to_async(Game.objects.get)(id=game_id)
        self.room_group_name = game_id

        GameConsumer.users += 1

        await self.accept()

        if GameConsumer.users > 2:
            await self.send(text_data=json.dumps({
                "too_many_users": True
            }))
            GameConsumer.users -= 1
        else:
            await self.channel_layer.group_add(
                self.room_group_name, self.channel_name
            )
    
    async def receive(self, text_data):
        # Data recieved
        data = json.loads(text_data)

        # User has connected to the game
        if "initial" in data:
            self.game.turn = data["turn"]
            self.game.board = data["board"]
            await sync_to_async(self.game.save)()
        else:
            print(data)

    async def disconnect(self, code):
        GameConsumer.users -= 1

        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )
