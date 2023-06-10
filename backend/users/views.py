import uuid, random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Chat
from .serializers import PrimaryUserSerializer, ProfileUserSerializer
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import (
    remove_friend,
    new_friend_request,
    accept_friend_request,
    reject_friend_request
)

from rest_framework_simplejwt.tokens import RefreshToken


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


'''
    Getting JWT tokens for users that have signed up using a provider. (e.g. Discord)
'''
@api_view(['POST'])
@permission_classes([])
def get_jwt_provider(request: Request):
    user = CustomUser.objects.filter(id=request.data["id"])
    if not user.exists():
        return Response({ "error": "User does not exist" }, 404)

    tokens = MyTokenObtainPairView.serializer_class.get_token(user=user.first())
    return Response({ "refresh": str(tokens), "access": str(tokens.access_token) }, 200)

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
    Check to see if user exists, if not, create a new user.
'''
@api_view(['POST'])
@permission_classes([])
def sign_in_up_provider(request: Request):
    username = request.data.get("name")
    email = request.data.get("email")
    image = request.data.get("image")
    provider = request.data.get("provider")

    user = CustomUser.objects.filter(email=email)

    if user.exists():
        if user.first().provider == provider:
            return Response({ "valid": True, "id": user.first().id, "username": user.first().username }, 200)
        else:
            return Response({ "valid": False }, 200)
    else:
        password = CustomUser.objects.make_random_password()
        not_unique_username = CustomUser.objects.filter(username=username).exists()

        if not_unique_username:
            username = f"{username}_{random.randint(0, 1000)}"

        user = CustomUser.objects.create(username=username, email=email, image=image, provider=provider)
        user.set_password(password)
        user.save()

        return Response({ "valid": True, "id": user.id, "username": user.username }, 200)


'''
    Search for a friend.
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_friend(request, typed: str):
    results = CustomUser.objects.filter(
        Q(username__iexact=typed) | Q(email__iexact=typed)
    )

    to_return = []
    for _user in results.values('id', 'username'):
        to_return.append({"id": _user["id"], "username": _user["username"]})

    return Response(to_return)


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
        to_return = []
        for _user in user.friend_requests.values('id', 'username', 'is_online'):
            to_return.append({"id": _user["id"], "username": _user["username"], "is_online": _user["is_online"]})

        return Response(to_return)

    # (PUT) managing friend requests and removing friends
    elif request.method == "PUT":
        action = request.data['action']
        friend = CustomUser.objects.filter(id=int(request.data['id']))

        if not friend.exists():
            return Response("No user found!", 404)
        
        friend = friend.first()
        
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
def get_chat_uuid(request, friend_id: str):
    user = CustomUser.objects.get(id=request.user.id)
    friend = CustomUser.objects.get(id=int(friend_id))

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
def get_user_profile(request, id: int):
    user = CustomUser.objects.get(id=id)
    serializer = ProfileUserSerializer(user)
    return Response(serializer.data)
    
'''
    Getting all user ids
'''
@api_view(['GET'])
@permission_classes([])
def get_user_ids(request):
    users = CustomUser.objects.all()
    ids = []

    for user in users:
        ids.append(user.id)
    return Response(ids)
