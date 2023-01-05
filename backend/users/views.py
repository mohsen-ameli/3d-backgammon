from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import UserSerializer, FriendSerializer, UserFullSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError


# ----------------- CUSTOM TOKEN CLAIMS JWT ----------------- #

# Custome JWT token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['is_online'] = user.is_online
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ----------------- USER VIEWS ----------------- #

# Getting user's friend requests and number of friend requests
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friend_requests(request):
    if request.method == "GET":
        user = CustomUser.objects.filter(id=request.user.id)
        dict_to_return = {}

        # Appending the number of friend requests
        dict_to_return['num_requests'] = user.first().friend_requests.count()

        dict_to_return['friend_requests'] = []

        for requeset in user.first().friend_requests.all():
            dict_to_return['friend_requests'].append({'id': requeset.id, 'username': requeset.username})
        return Response(dict_to_return)


# Getting a list of the user's friends
@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def handle_friends(request):
    # Current user
    user = CustomUser.objects.filter(id=request.user.id)
    
    # (GET) getting all friends of the user
    if request.method == "GET":
        if user.first().friends.all():
            serializer = FriendSerializer(user.first().friends, many=True)
            return Response(serializer.data)
        
        return Response([])

    # (PUT) managing friend requests
    elif request.method == "PUT":
        friend = CustomUser.objects.filter(id=request.data['id'])

        # removing a friend
        if request.data['action'] == "remove":
            user.first().friends.remove(friend.first())
            return Response({"message": "Friend removed"})

        # sending a new freind request
        elif request.data['action'] == "add":
            if friend.first().friend_requests.filter(id=user.first().id).exists():
                raise ValidationError("Friend request already sent")
            elif friend.first() == user.first():
                raise ValidationError("You can't add yourself")
            friend.first().friend_requests.add(user.first())
            return Response({"message": "Friend added"})
        
        # accepting a friend request
        elif request.data['action'] == "accept":
            user.first().friend_requests.remove(friend.first())
            user.first().friends.add(friend.first())
            return Response({"message": "Friend accepted"})
        
        # rejecting a friend request
        elif request.data['action'] == "reject":
            user.first().friend_requests.remove(friend.first())
            return Response({"message": "Friend rejected"})


# Creating a new user
@api_view(['POST'])
def register_user(request):
    serializer = UserFullSerializer(data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)