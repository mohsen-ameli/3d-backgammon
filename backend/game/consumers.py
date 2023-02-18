import json, jwt, asyncio, time
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.conf import settings
from django.utils import timezone

from .models import Game
from users.models import CustomUser

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
            await self.initialFetch()
        elif "winner" in data:
            winner = await database_sync_to_async(CustomUser.objects.get)(id=data["winner"])
            self.game.winner = winner.username
            self.game.finished = True

            white = await database_sync_to_async(CustomUser.objects.get)(id=self.game.white.id)
            black = await database_sync_to_async(CustomUser.objects.get)(id=self.game.black.id)

            white.live_game = None
            black.live_game = None

            await database_sync_to_async(self.game.save)()
            await database_sync_to_async(white.save)()
            await database_sync_to_async(black.save)()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_is_over",
                    "winner": winner.username,
                    "finished": True,
                }
            )
            await self.disconnect("")
        elif "update" in data:
            await update_game_state(self.game, data["board"], data["dice"], data["turn"])
            if not data["update"]:
                return

            await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send_updates",
                "initial": False,
                "turn": data["turn"],
                "board": data["board"],
                "dice": data["dice"],
                "finished": self.game.finished,
                "white": self.game.white.id,
                "black": self.game.black.id
            }
        )
            
        return

    async def game_is_over(self, event):
        winner = event["winner"]
        finished = event["finished"]

        context = {
            "winner": winner,
            "finished": finished
        }

        await self.send(text_data=json.dumps(context))

    async def send_updates(self, event):
        initial = event["initial"]
        turn = event["turn"]
        board = event["board"]
        dice = event["dice"]
        finished = event["finished"]
        white = event["white"]
        black = event["black"]

        context = {
            "initial": initial,
            "turn": turn,
            "board": board,
            "dice": dice,
            "finished": finished,
            "white": white,
            "black": black
        }

        await self.send(text_data=json.dumps(context))

    async def initialFetch(self):
        context = await get_game_state(self.game)
        await self.send(text_data=json.dumps(context))

    async def disconnect(self, code):
        GameConsumer.users -= 1

        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

@database_sync_to_async
def update_game_state(game: Game, board, dice, turn):
    game.board = board
    game.dice = dice
    game.turn = turn
    game.save()

@database_sync_to_async
def get_game_state(game: Game) -> dict:
    context = {}

    context["initial"] = True
    context["turn"] = game.turn
    context["board"] = game.board
    context["dice"] = game.dice
    context["finished"] = game.finished
    context["white"] = game.white.id
    context["black"] = game.black.id

    return context
