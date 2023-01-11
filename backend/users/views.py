from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from .models import CustomUser, Chat, Message
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

# Getting user's friend requests and number of friend requests
# TODO: Make this into a consumer
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


# Handling user's friends, listing, adding, removing, accepting, rejecting
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

        if request.data['action'] == "remove":
            return remove_friend(user, friend)
        elif request.data['action'] == "add":
            return new_friend_request(user, friend)
        elif request.data['action'] == "accept":
            return accept_friend_request(user, friend)
        elif request.data['action'] == "reject":
            return reject_friend_request(user, friend)


# Change status of the user
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_status(request):
    if request.method == "PUT":
        user = CustomUser.objects.filter(id=request.user.id)
        user.update(is_online=request.data['status'])
        return Response({'message': "Status changed!"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_uuid(request, friend_id):
    if request.method == "GET":
        user = CustomUser.objects.get(id=request.user.id)
        friend = CustomUser.objects.get(id=friend_id)

        try:
            chat_room = Chat.objects.filter(Q(users__pk=request.user.id)).get(Q(users__pk=friend_id))
            return Response({'chat_uuid': chat_room.uuid})
        except Chat.DoesNotExist:
            chat_room = Chat.objects.create()
            chat_room.users.add(user)
            chat_room.users.add(friend)
            chat_room.save()
            return Response({'chat_uuid': chat_room.uuid})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    if request.method == "GET":
        user = CustomUser.objects.get(id=request.user.id)
        serializer = ProfileUserSerializer(user)
        # date_joined = round(datetime.timestamp(user.date_joined))
        # serializer.data['date_joined'] = date_joined
        print(serializer.data)

        return Response(serializer.data)


# Creating a new user aka signup
@api_view(['POST'])
@permission_classes([])
def register_user(request):
    serializer = PrimaryUserSerializer(data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)