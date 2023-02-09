from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request

from .models import Game
from users.models import CustomUser


# This method will handle all the requests for a match
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def handle_match_request(request: Request):
    def remove_request(user: CustomUser, friend: CustomUser):
        user.game_requests.remove(friend)

    if request.method == "PUT":
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
            friend.game_requests.add(request.user)

        # User has accepted a match request
        elif action == "accept":
            remove_request(request.user, friend)
            newGame = Game()
            newGame.save()
            newGame.players.add(request.user, friend)
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
def valid_match(request: Request, game_id: int):
    if request.method == "GET":
        game = Game.objects.filter(id=game_id).filter(players=request.user)
        
        if game.exists():
            return Response({"valid": True, "finished": game.first().finished})
        return Response({"valid": False})

