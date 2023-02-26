import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.db.models import F

from .models import Game
from users.models import CustomUser

class GameConsumer(AsyncWebsocketConsumer):
    users = 0
    
    async def connect(self):
        '''
            Connecting a user to the game.
        '''

        # Game uuid
        game_id = self.scope['url_route']['kwargs']['game_id']

        # Getting the game object
        self.game = await database_sync_to_async(Game.objects.get)(id=game_id)
        self.room_group_name = game_id

        # Adding one to the users connected to this game
        GameConsumer.users += 1

        await self.accept()

        # Making sure there's only two connected users to one game. 
        # We deal with the case of there being more than 2 users, in the frontend.
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
        '''
            Used to communicate with the frontend. When it initially connects,
            there will be an "initial" in data, when there's a winner, there
            will be a "winner" key in data, and so on.
        '''

        # Data recieved
        data = json.loads(text_data)

        # User has connected to the game
        if "initial" in data:
            await self.initialFetch()
        elif "winner" in data:
            winner = await database_sync_to_async(CustomUser.objects.get)(id=data["winner"])
            
            self.game.winner = winner.username
            self.game.finished = True

            # White and black users
            white = await database_sync_to_async(CustomUser.objects.get)(id=self.game.white.id)
            black = await database_sync_to_async(CustomUser.objects.get)(id=self.game.black.id)

            # Updating live game and the total game counter
            white.live_game = None
            black.live_game = None
            white.total_games = F('total_games') + 1
            black.total_games = F('total_games') + 1

            # Setting winner and loser stats
            if white.id == winner.id:
                white.games_won = F('games_won') + 1
                black.games_lost = F('games_lost') + 1
            else:
                black.games_won = F('games_won') + 1
                white.games_lost = F('games_lost') + 1

            # Saving everything
            await database_sync_to_async(self.game.save)()
            await database_sync_to_async(white.save)()
            await database_sync_to_async(black.save)()

            # Sending back updates
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

            context = {
                "type": "send_updates",
                "initial": False,
                "turn": data["turn"],
                "board": data["board"],
                "dice": data["dice"],
                "finished": self.game.finished,
                "white": self.game.white.id,
                "black": self.game.black.id
            }

            await self.channel_layer.group_send(self.room_group_name, context)
        elif "message" in data:
            await self.channel_layer.group_send(self.room_group_name, {
                "type": "send_message",
                "message": data["message"],
                "user": data["user"]
            })

        return

    async def send_message(self, event):
        '''
            Used to send in game messages between users.
        '''

        messsage = event["message"]
        user = event["user"]
        
        await self.send(text_data=json.dumps({
            "message": messsage,
            "user": user
        }))

    async def game_is_over(self, event):
        '''
            Used to send both users stats about the game winners,
            when the game is done
        '''

        winner = event["winner"]
        finished = event["finished"]

        context = {
            "winner": winner,
            "finished": finished
        }

        await self.send(text_data=json.dumps(context))

    async def send_updates(self, event):
        '''
            Main update function, to update users on the new board,
            dice, turn, and finished status.
        '''

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
        '''
            This will fetch the initial stage of the game.
        '''

        context = await get_game_state(self.game)
        await self.send(text_data=json.dumps(context))

    async def disconnect(self, code):
        '''
            When a user is disconnected.
        '''

        GameConsumer.users -= 1

        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )


@database_sync_to_async
def update_game_state(game: Game, board, dice, turn):
    '''
        Updating the game instance
    '''

    game.board = board
    game.dice = dice
    game.turn = turn
    game.save()


@database_sync_to_async
def get_game_state(game: Game) -> dict:
    '''
        Getting the current game state.
    '''

    context = {}

    context["initial"] = True
    context["turn"] = game.turn
    context["board"] = game.board
    context["dice"] = game.dice
    context["finished"] = game.finished
    context["white"] = game.white.id
    context["black"] = game.black.id
    context["white_name"] = game.white.username
    context["black_name"] = game.black.username

    return context
