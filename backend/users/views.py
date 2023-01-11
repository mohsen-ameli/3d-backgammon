from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Chat
from .serializers import FriendSerializer, PrimaryUserSerializer, ProfileUserSerializer
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import (
    remove_friend,
    new_friend_request,
    accept_friend_request,
    reject_friend_request
)


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

# Registering a user
@api_view(['POST'])
@permission_classes([])
def register_user(request):
    serializer = PrimaryUserSerializer(data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


# Hnadling friends and friend requests
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def handle_friends(request):
    # Current user
    user = CustomUser.objects.get(id=request.user.id)
    
    # (GET) getting all friend requests of the user
    if request.method == "GET":
        serializer = FriendSerializer(user.friend_requests, many=True)
        return Response(serializer.data)

    # (PUT) managing friend requests and removing friends
    elif request.method == "PUT":
        action = request.data['action']
        friend = CustomUser.objects.get(id=request.data['id'])
        
        if action == "remove":
            # TODO: Could potentially move this to the consumer, 
            # and change the name of this view to handle_friend_requests
            return remove_friend(user, friend)
        elif action == "add":
            return new_friend_request(user, friend)
        elif action == "accept":
            return accept_friend_request(user, friend)
        elif action == "reject":
            return reject_friend_request(user, friend)


# This will get the chat uuid between the user and the friend
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_uuid(request, friend_id):
    if request.method == "GET":
        user = CustomUser.objects.get(id=request.user.id)
        friend = CustomUser.objects.get(id=friend_id)

        try:
            chat_room = Chat.objects.filter(Q(users__pk=user.pk)).get(Q(users__pk=friend.pk))
            return Response({'chat_uuid': chat_room.uuid})
        except Chat.DoesNotExist:
            chat_room = Chat.objects.create()
            chat_room.users.add(user)
            chat_room.users.add(friend)
            chat_room.save()
            return Response({'chat_uuid': chat_room.uuid})


# Getting information about the user (aka their profile)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    if request.method == "GET":
        user = CustomUser.objects.get(id=request.user.id)
        serializer = ProfileUserSerializer(user)
        return Response(serializer.data)
