from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/friends/(?P<token>[\w-]+\.[\w-]+\.[\w-]+)', consumers.FriendsConsumer.as_asgi()),
    re_path(r'ws/search-friend/', consumers.SearchFriendConsumer.as_asgi()),
]