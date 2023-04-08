import uuid
from django.db import models
from .model_params import *


'''
    A singleton used for the default board.
'''
class SingletonJSONFieldDefault(object):
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = DEFAULT_BOARD
        return cls._instance


'''
    A singleton used for the default dice.
'''
class DiceDefault(object):
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = DEFAULT_DICE
        return cls._instance


'''
    The grand game model.
'''
class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_time = models.DateTimeField(auto_now_add=True)
    turn = models.CharField(max_length=5, choices=USER_CHECKER_CHOICES, blank=True, null=True)
    finished = models.BooleanField(default=False)
    board = models.JSONField(default=SingletonJSONFieldDefault, blank=True, null=True)
    dice = models.JSONField(default=DiceDefault, blank=True, null=True)
    dice_physics = models.JSONField(default=dict, blank=True, null=True)
    player_timer = models.JSONField(default=dict, blank=True, null=True)
    # I chose the winner to be a string, so that if the user deletes their account, 
    # in their friend's games their name doesn't appear as null
    winner = models.CharField(max_length=50, blank=True, null=True)
    white = models.ForeignKey("users.CustomUser", on_delete=models.SET_NULL, blank=True, null=True, related_name="white")
    black = models.ForeignKey("users.CustomUser", on_delete=models.SET_NULL, blank=True, null=True, related_name="black")

    def __str__(self):
        return f"{self.id}"


'''
    Model that contains in-game messages.
    TODO: Add an audio file for each message.
'''
class InGameMessages(models.Model):
    id = models.IntegerField(primary_key=True)
    message = models.CharField(max_length=200)
    show = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.id} - {self.message}"
