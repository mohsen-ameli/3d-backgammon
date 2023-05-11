from rest_framework import serializers
from .models import InGameMessages

class InGameMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = InGameMessages
        fields = ("id", "message", "audio", "show")
