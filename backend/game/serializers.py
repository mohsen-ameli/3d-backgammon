from rest_framework import serializers
from .models import InGameMessages, Game

class InGameMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = InGameMessages
        fields = ("id", "message", "show")
