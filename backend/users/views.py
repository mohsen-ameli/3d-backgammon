import uuid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Chat
from .serializers import FriendSerializer, PrimaryUserSerializer, ProfileUserSerializer
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from typing import Literal
from .utils import (
    remove_friend,
    new_friend_request,
    accept_friend_request,
    reject_friend_request
)


# ----------------- CUSTOM TOKEN CLAIMS JWT ----------------- #

'''
    Custom JWT token class based view
'''
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: CustomUser):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.username
        token['is_online'] = user.is_online
        token['image'] = user.image.url
        token['email'] = user.email
        return token


'''
    JWT token serializer
'''
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ----------------- USER VIEWS ----------------- #
'''
    Registering a user
'''
@api_view(['POST'])
@permission_classes([])
def register_user(request):
    serializer = PrimaryUserSerializer(data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


'''
    Search for a friend.
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_friend(request, typed: str):
    if request.method == "GET":
        results = CustomUser.objects.filter(
            Q(username__iexact=typed) | Q(email__iexact=typed)
        )
        
        return Response(list(results.values('id', 'username')))


'''
    Check to see if user exists, if not, create a new user.
'''
@api_view(['GET', 'POST'])
@permission_classes([])
def validate_provider_user(request: Request, email: str, provider: Literal["credentials", "discord"]):
    user = CustomUser.objects.filter(email=email)

    if request.method == "GET":
        if user.exists() and user.first().provider == provider:
            return Response(True, 200)
        else:
            return Response(False, 401)
    elif request.method == "POST":
        user = user.first()
        serializer = MyTokenObtainPairSerializer(data={'username': user.username})
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        return Response(data)


'''
    Handling friends and friend requests
'''
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


'''
    This will get the chat uuid between the user and the friend
'''
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
        
'''
    This will validate the chat uuid between the user and the friend
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_chat(request, chat_uuid: str):
    if request.method == "GET":
        try:
            uuid.UUID(chat_uuid)
            
            user = CustomUser.objects.get(id=request.user.id)
            chat = Chat.objects.filter(uuid=chat_uuid)

            if chat.exists() and user in chat.first().users.all():
                return Response({"valid": True})
            else:
                return Response({"valid": False})
        except:
            return Response({"valid": False})

'''
    Getting information about the user (aka their profile)
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    if request.method == "GET":
        user = CustomUser.objects.get(id=request.user.id)
        serializer = ProfileUserSerializer(user)
        return Response(serializer.data)
