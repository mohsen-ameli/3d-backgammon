import random, time
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from django.core.exceptions import ValidationError
from django.conf import settings

from .models import Game, InGameMessages
from users.models import CustomUser
from .serializers import InGameMessagesSerializer


'''
    This method will handle all the requests for a match
'''
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def handle_match_request(request: Request):
    action = request.data["action"]
    friend_id = int(request.data["friend_id"])
    friend = CustomUser.objects.filter(id=friend_id)

    if not friend.exists():
        return Response("User not found!", 404)
    
    friend = friend.first()

    # User is sending a match request
    if action == "send":
        if not friend.is_online:
            return Response({"success": False})
        friend.game_requests.add(request.user)

    # User has accepted a match request
    elif action == "accept":
        request.user.game_requests.remove(friend)
        newGame = Game()

        if random.random() > 0.5:
            newGame.black = request.user
            newGame.white = friend
        else:
            newGame.white = request.user
            newGame.black = friend

        newGame.turn = "black" if random.random() > 0.5 else "white"

        # Setting the allowed time for user to make move. In frontend, we will subtract the current time from this time
        # and if it's less than 70 seconds, then user can still move, otherwise, we will resign the user with this id
        if newGame.turn == "black":
            newGame.player_timer = { "id": newGame.black.id, "time": round(time.time() * 1000) + settings.USER_TURN_DURATION * 1000 }
        else:
            newGame.player_timer = { "id": newGame.white.id, "time": round(time.time() * 1000) + settings.USER_TURN_DURATION * 1000 }

        newGame.save()

        request.user.games.add(newGame)
        friend.games.add(newGame)

        friend.live_game = newGame
        request.user.live_game = newGame

        friend.save()
        request.user.save()

        return Response({"game_id": newGame.id})
        
    # User has rejected a match request
    elif action == "reject":
        request.user.game_requests.remove(friend)
        friend.save()

    return Response({"success": True})


'''
    This method will check if the user is joining a valid game
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def valid_match(request: Request, game_id):
    # Making sure that user has not tampered with the game id
    try:
        game = Game.objects.filter(id=game_id)
    except ValidationError:
        return Response({"valid": False})

    # If game doesn't exist or user doesn't have any games
    if not game.exists() or not request.user.live_game:
        return Response({"valid": False})

    # If the game is user's game then return the good stuff
    if request.user.live_game.id == game.first().id:
        return Response({"valid": True, "finished": game.first().finished})

    # Game is not user's
    return Response({"valid": False})


'''
    This method will get all of the available in-game messages
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_in_game_messages(request: Request):
    serializer = InGameMessagesSerializer(InGameMessages.objects.all().order_by("id"), many=True)
    return Response(serializer.data)
