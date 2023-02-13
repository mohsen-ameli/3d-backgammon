from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<game_id>[A-Za-z0-9_-]+)', consumers.GameConsumer.as_asgi()),
]