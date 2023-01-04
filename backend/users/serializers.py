from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "is_online")


class UserFullSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "password2"]

    def is_valid(self, *, raise_exception=False):
        if self.initial_data['password'] != self.initial_data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return super().is_valid(raise_exception=raise_exception)

    def save(self, **kwargs):
        password = self.validated_data.pop('password')
        self.validated_data['password'] = make_password(password)

        # Deleting password2, since we don't need it to be saved in the database
        del self.validated_data['password2']

        super(UserFullSerializer, self).save(**kwargs)