from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/friends/(?P<id>[\d*]+)', consumers.FriendsConsumer.as_asgi()),
    re_path(r'ws/status/(?P<id>[\d*]+)', consumers.StatusConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<chat_id>[A-Za-z0-9_-]+)', consumers.ChatConsumer.as_asgi()),
]