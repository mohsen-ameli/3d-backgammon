import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.db.models import F

from .models import Game
from users.models import CustomUser

@database_sync_to_async
def setWinner(game: Game, id: int) -> dict:
    winner = CustomUser.objects.get(id=id)
    white = CustomUser.objects.get(id=game.white.id)
    black = CustomUser.objects.get(id=game.black.id)

    game.winner = winner.username
    game.finished = True

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
    game.save()
    white.save()
    black.save()

    color = "white" if winner.id == white.id else "black"

    return {"id": winner.id, "name": winner.username, "color": color}


class GameConsumer(AsyncWebsocketConsumer):
    users_count = 0
    users = {}
    
    async def connect(self):
        '''
            Connecting a user to the game.
        '''

        # Game uuid
        game_id = self.scope['url_route']['kwargs']['game_id']

        # Getting the game object
        self.game_obj = await database_sync_to_async(Game.objects.filter)(id=game_id)
        self.game = await database_sync_to_async(self.game_obj.first)()
        self.room_group_name = game_id

        # Adding one to the users connected to this game
        GameConsumer.users[GameConsumer.users_count] = {"user": GameConsumer.users_count}
        GameConsumer.users_count += 1
        
        await self.accept()

        # Making sure there's only two connected users to one game. 
        # We deal with the case of there being more than 2 users, in the frontend.
        if GameConsumer.users_count > 2:
            await self.send(text_data=json.dumps({
                "too_many_users": True
            }))
            GameConsumer.users_count -= 1
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

        # Data received
        data = json.loads(text_data)

        # User has connected to the game
        if "physics" in data:
            await database_sync_to_async(self.game_obj.update)(dice_physics=data["user"])

            context = {"type": "send_dice_physics", "physics": data["user"]}
            await self.channel_layer.group_send(self.room_group_name, context)
        elif "initial" in data:
            context = await get_initial_game_state(self.game)
            if context is not None:
                await self.send(text_data=json.dumps(context))
            else:
                await self.send(text_data=json.dumps({"error": "Something went wrong!"}))
        elif "update" in data:
            # Frontend wants to update the game state
            await update_game_state(self.game_obj, data)

            # If frontend wants not to update the other user
            if not data["update"]:
                return

            context = {
                "type": "send_updates",
                "initial": False,
                "player_timer": data["player_timer"] if data["player_timer"] else self.game.player_timer,
                "turn": data["turn"],
                "board": data["board"],
                "dice": data["dice"],
                "finished": self.game.finished,
                "white": self.game.white.id,
                "black": self.game.black.id
            }

            await self.channel_layer.group_send(self.room_group_name, context)
        elif "message" in data:
            # A user is sending a message
            context = {
                "type": "send_message",
                "message": data["message"],
                "id": data["id"]
            }
            await self.channel_layer.group_send(self.room_group_name, context)
        elif "resign" in data:
            # Sending back updates
            winner = await setWinner(self.game, data["winner"])
            resigner = await database_sync_to_async(CustomUser.objects.get)(id=data["resigner"])
            resigner_color = "white" if winner["color"] == "black" else "black"
            resigner_ = {"id": resigner.id, "name": resigner.username, "color": resigner_color}

            context = {
                "type": "resigned_game",
                "winner": winner,
                "resigner": resigner_
            }
            await self.channel_layer.group_send(self.room_group_name, context)
            await self.disconnect("")
        elif "winner" in data:
            # Sending back updates
            winner = await setWinner(self.game, data["winner"])
            context = { "type": "game_is_over", "winner": winner}
            
            await self.channel_layer.group_send(self.room_group_name, context)
            await self.disconnect("")

        return
    
    async def send_dice_physics(self, event):
        physics = event["physics"]
        await self.send(text_data=json.dumps({"physics": physics}))

    async def send_message(self, event):
        '''
            Used to send in game messages between users.
        '''

        message = event["message"]
        id = event["id"]
        
        await self.send(text_data=json.dumps({
            "message": message,
            "id": id
        }))

    async def resigned_game(self, event):
        '''
            When someone resigns, we finish the game, set winners and resigner,
            and update both users about this.
        '''
        winner = event["winner"]
        resigner = event["resigner"]
        context = {
            "winner": winner,
            "resigner": resigner,
            "finished": True
        }
        await self.send(text_data=json.dumps(context))

    async def game_is_over(self, event):
        '''
            Used to send both users stats about the game winners,
            when the game is done
        '''
        context = { "winner": event["winner"], "finished": True }
        await self.send(text_data=json.dumps(context))

    async def send_updates(self, event):
        '''
            Main update function, to update users on the new board,
            dice, turn, and finished status.
        '''

        initial = event["initial"]
        player_timer = event["player_timer"]
        turn = event["turn"]
        board = event["board"]
        dice = event["dice"]
        finished = event["finished"]
        white = event["white"]
        black = event["black"]

        context = {
            "initial": initial,
            "player_timer": player_timer,
            "turn": turn,
            "board": board,
            "dice": dice,
            "finished": finished,
            "white": white,
            "black": black
        }

        await self.send(text_data=json.dumps(context))

    async def disconnect(self, code):
        '''
            When a user is disconnected.
        '''

        GameConsumer.users_count -= 1

        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )


@database_sync_to_async
def update_game_state(game: Game, data):
    '''
        Updating the game instance
    '''

    game.update(board=data["board"])
    game.update(dice=data["dice"])
    game.update(turn=data["turn"])
    if data["player_timer"]:
        game.update(player_timer=data["player_timer"])


@database_sync_to_async
def get_initial_game_state(game: Game) -> dict:
    '''
        Used for initial loading. Getting the current game state.
    '''

    try:
        context = {}

        context["initial"] = True
        context["player_timer"] = game.player_timer
        context["turn"] = game.turn
        context["board"] = game.board
        context["dice"] = game.dice
        context["finished"] = game.finished
        context["initial_physics"] = game.dice_physics
        context["white"] = game.white.id
        context["black"] = game.black.id
        context["white_name"] = game.white.username
        context["black_name"] = game.black.username
        context["white_image"] = game.white.image.url
        context["black_image"] = game.black.image.url

        return context
    except:
        return None
