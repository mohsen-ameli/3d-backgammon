from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/status/(?P<token>[\w-]+\.[\w-]+\.[\w-]+)', consumers.StatusConsumer.as_asgi()),
    re_path(r'ws/friends/(?P<token>[\w-]+\.[\w-]+\.[\w-]+)', consumers.FriendsListConsumer.as_asgi()),
    re_path(r'ws/search-friend/', consumers.SearchFriendConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<chat_id>[A-Za-z0-9_-]+)', consumers.ChatConsumer.as_asgi()),
]