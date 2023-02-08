from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request

from users.models import CustomUser

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
            # TODO: Make a new game instance and add the two users to it.
        # User has rejected a match request
        elif action == "reject":
            remove_request(request.user, friend)
            friend.rejected_request = request.user
            friend.save()
        # User has left the lobby, so deleting all match requests
        elif action == "delete-all":
            request.user.game_requests.clear()

        return Response({"success": True})
        