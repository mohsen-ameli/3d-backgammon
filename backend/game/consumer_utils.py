from typing import cast

from channels.db import database_sync_to_async
from django.db.models import F
from django.db.models.query import QuerySet

from .models import Game
from users.models import CustomUser

'''
    Sets the winner of the game, and updates both users information
    such as, #games won, #games lost/won, etc
'''
@database_sync_to_async
def set_winner(game: Game, id: int) -> dict:
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


'''
    Updating the game instance
'''
@database_sync_to_async
def update_game_state(game: QuerySet[Game], data: dict) -> None:
    game.update(board=data["board"])
    game.update(dice=data["dice"])
    game.update(turn=data["turn"])
    if data["player_timer"]:
        game.update(player_timer=data["player_timer"])


'''
    Used for initial loading. Getting the current game state.
'''
@database_sync_to_async
def get_initial_game_state(game: Game) -> dict:
    try:
        white = cast(CustomUser, game.white)
        black = cast(CustomUser, game.black)

        white_img = str(white.image)
        black_img = str(black.image)

        if "profile_pics" in str(white.image):
            white_img = str(white.image.url)
        if "profile_pics" in str(black.image):
            black_img = str(black.image.url)

        return {
            "initial": True,
            "player_timer": game.player_timer,
            "turn": game.turn,
            "board": game.board,
            "dice": game.dice,
            "finished": game.finished,
            "initial_physics": game.dice_physics,
            "white": white.id,
            "black": black.id,
            "white_name": white.username,
            "black_name": black.username,
            "white_image": white_img,
            "black_image": black_img,
        }
    except:
        return None
