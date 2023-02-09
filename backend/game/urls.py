from django.urls import path
from .views import *

urlpatterns = [
    path("handle-match-request/", handle_match_request),
    path("valid-match/<int:game_id>/", valid_match),
]