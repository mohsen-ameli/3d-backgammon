import uuid
from django.db import models
from .model_params import *


'''
    The grand game model.

    Fields:
    - id: Primary key field that generates a unique identifier for each game instance.
    - start_time: Represents the date and time when a game instance is created.
    - turn: Represents the current turn in the game.
    - finished: Indicates whether the game has finished or not.
    - board: Stores the game board data in JSON format.
    - dice: Stores the dice data in JSON format.
    - dice_physics: Stores the dice physics data in JSON format.
    - player_timer: Stores the player timer data in JSON format.
    - winner: Represents the winner of the game.
        + I chose the winner to be a string, so that if the user deletes their account
        in their friend's games their name doesn't appear as null
    - white: Represents the "white" player in the game.
    - black: Represents the "black" player in the game.
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
    winner = models.CharField(max_length=50, blank=True, null=True)
    white = models.ForeignKey("users.CustomUser", on_delete=models.SET_NULL, blank=True, null=True, related_name="white")
    black = models.ForeignKey("users.CustomUser", on_delete=models.SET_NULL, blank=True, null=True, related_name="black")

    def __str__(self):
        return f"{self.id}"


'''
    Model that contains in-game messages.

    Fields:
    - id: Primary key field representing the identifier of the message.
    - message: The actual content of the message.
    - audio: Optional field to upload an audio file associated with the message.
    - show: Indicates whether the message should be displayed in the game.
'''
class InGameMessages(models.Model):
    id = models.IntegerField(primary_key=True)
    message = models.CharField(max_length=200)
    audio = models.FileField(upload_to="audio/messages", null=True, blank=True)
    show = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.id} - {self.message}"
