import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from django.core.exceptions import ValidationError

from .models import Game
from users.models import CustomUser


# This method will handle all the requests for a match
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def handle_match_request(request: Request):
    def remove_request(user: CustomUser, friend: CustomUser):
        user.game_requests.remove(friend)

    action = request.data["action"]

    # User is deleting a rejected request
    if action == "delete-rejected":
        request.user.rejected_request = None
        request.user.save()
        return Response({"success": True})

    friend_id = request.data["friend_id"]
    friend = CustomUser.objects.get(id=friend_id)

    # User is sending a match request
    if action == "send":
        if not friend.is_online:
            return Response({"success": False})
        friend.game_requests.add(request.user)

    # User has accepted a match request
    elif action == "accept":
        remove_request(request.user, friend)
        newGame = Game()

        if random.random() > 0.5:
            newGame.black = request.user
            newGame.white = friend
        else:
            newGame.white = request.user
            newGame.black = friend 
        newGame.save()

        request.user.games.add(newGame)
        friend.games.add(newGame)

        friend.live_game = newGame
        request.user.live_game = newGame

        friend.save()
        request.user.save()

        # What needs to happen is we need to send an update
        # in the consumer to both users, so we can have them both join the same room.
        
        # Maybe having a foreign key from users going to game is better. Then querying each
        # user won't be as labour intensive as to querying the whole game tables. There could be
        # millions of games on the Game table, but a user might only play a few hundred.
        
        # We could probably listen for any changes on the user's games, and if there is a new one
        # that has a finished value set to false, then we can send them the uuid of the game through
        # the users status consumer, and have them enter the game automatically.
        
        # Then after that, connect both users to a single websocket, that will be defined under game's consumer.
        
        # From there, we will need to store the user's game board information,
        # and keep track of who's turn it is, and if the game is finished or not.

        # Also, users should only have one active game at a time.

        return Response({"game_id": newGame.id})
        
    # User has rejected a match request
    elif action == "reject":
        remove_request(request.user, friend)
        friend.rejected_request = request.user
        friend.save()

    return Response({"success": True})

# This method will check if the user is joining a valid game
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def valid_match(request: Request, game_id):
    # Making sure that user has not tampered with the game id
    try:
        game = Game.objects.filter(id=game_id)
    except ValidationError:
        return Response({"valid": False})

    # If game doesn't exist or usre doesn't have any games:
    if not game.exists() or not request.user.live_game:
        return Response({"valid": False})

    # If the game is user's game then return the good stuff
    if request.user.live_game.id == game.first().id:
        return Response({"valid": True, "finished": game.first().finished})

    # Game is not user's
    return Response({"valid": False})
