from django.urls import path
from . import views

urlpatterns = [
    path("dice/", views.handle_dice_ai),
    path("dice/predict/", views.get_dice_prediction),
]
