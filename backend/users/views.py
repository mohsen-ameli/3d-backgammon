from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import UserSerializer, FriendSerializer, UserFullSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


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

# Getting a list of the user's friends
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    if request.method == "GET":
        user = CustomUser.objects.filter(id=request.user.id)
        serializer = UserSerializer(user.first())
        return Response(serializer.data)


# Getting a list of the user's friends
@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def handle_friends(request):
    # Current user
    user = CustomUser.objects.filter(id=request.user.id)
    
    # (GET) getting the list of all friends of the user
    if request.method == "GET":
        if user.first().friends.all():
            serializer = FriendSerializer(user.first().friends, many=True)
            return Response(serializer.data)
        
        return Response([])

    # (PUT) managing friend requests, and removals
    elif request.method == "PUT":
        friend = CustomUser.objects.filter(id=request.data['id'])

        # removing a friend
        if request.data['action'] == "remove":
            user.first().friends.remove(friend.first())
            return Response({"message": f" removed"})

        # sending a new freind request
        elif request.data['action'] == "add":
            friend.first().friend_requests.add(user.first())
            return Response({"message": f" added"})

# 1 : sending new friend requests
# 2 : accept/reject friend request
# 3 DONE : remove friend


# Creating a new user
@api_view(['POST'])
def register_user(request):
    serializer = UserFullSerializer(data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)