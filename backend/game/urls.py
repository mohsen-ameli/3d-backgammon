from django.urls import path
from .views import *

urlpatterns = [
    path("handle-match-request/", handle_match_request),
    path("valid-match/<str:game_id>/", valid_match),
    path("get-in-game-messages/", get_in_game_messages),
    path("get-random-name/", get_random_name),
]