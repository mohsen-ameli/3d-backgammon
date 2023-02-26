from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


'''
    Serializer for getting user's friends
'''
class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "is_online")


'''
    Serializer used for getting user's profile
'''
class ProfileUserSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "total_games", "games_won", "games_lost", "date_joined")

    def get_date_joined(self, obj):
        return obj.get_date_joined


'''
    Primary serializer used for registering
'''
class PrimaryUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("username", "email", "password", "password2")

    def is_valid(self, *, raise_exception=False):
        # Stripping whitespaces from username and email
        self.initial_data['username'] = self.initial_data['username'].strip()
        self.initial_data['email'] = self.initial_data['email'].strip()

        # Username validations
        for char in self.initial_data['username']:
            if char.isspace():
                raise serializers.ValidationError({"message": "Username cannot contain whitespace", "code": "username"})
        if len(self.initial_data['username']) < 5:
            raise serializers.ValidationError({"message": "Username must be at least 5 characters long", "code": "username"})
        elif len(self.initial_data['username']) > 15:
            raise serializers.ValidationError({"message": "Username must be at most 15 characters long", "code": "username"})
        elif CustomUser.objects.filter(username=self.initial_data['username']).exists():
            raise serializers.ValidationError({"message": "Username already exists", "code": "username"})
        
        # Email validations
        if CustomUser.objects.filter(email=self.initial_data['email']).exists():
            raise serializers.ValidationError({"message": "Email already exists", "code": "email"})
        try:
            validate_email(self.initial_data['email'])
        except ValidationError:
            raise serializers.ValidationError({"message": "Email is invalid", "code": "email"})
        
        # Password validations
        try:
            validate_password(self.initial_data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"message": e.messages[0], "code": "password"})
        
        if self.initial_data['password'] != self.initial_data['password2']:
            raise serializers.ValidationError({"message": "Passwords don't match", "code":"password2"})

        return super().is_valid(raise_exception=raise_exception)

    def save(self, **kwargs):
        password = self.validated_data.pop('password')
        self.validated_data['password'] = make_password(password)

        # Deleting password2, since we don't need it to be saved in the database
        del self.validated_data['password2']

        super(PrimaryUserSerializer, self).save(**kwargs)