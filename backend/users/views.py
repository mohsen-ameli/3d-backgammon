from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import UserSerializer, UserFullSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


# ----------------- CUSTOM TOKEN CLAIMS JWT ----------------- #

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def handle_friends(request):
    if request.method == "GET":
        user = CustomUser.objects.filter(id=request.user.id)
        if user.first().friends.all():
            serializer = UserSerializer(user.first().friends, many=True)
            return Response(serializer.data)
        
        return Response([])


# Creating a new user
@api_view(['POST'])
def register_user(request):
    serializer = UserFullSerializer(data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)