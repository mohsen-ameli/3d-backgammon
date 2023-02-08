from django.urls import path
from .views import *

urlpatterns = [
    path("handle-match-request/", handle_match_request)
]