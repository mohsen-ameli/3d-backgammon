import uuid, random
from django.db import models

DEFAULT_BOARD = [
    {"id": 0, "color": "white", "col": 0, "row": 0, "removed": False},
    {"id": 1, "color": "white", "col": 0, "row": 1, "removed": False},
    {"id": 2, "color": "white", "col": 11, "row": 0, "removed": False},
    {"id": 3, "color": "white", "col": 11, "row": 1, "removed": False},
    {"id": 4, "color": "white", "col": 11, "row": 2, "removed": False},
    {"id": 5, "color": "white", "col": 11, "row": 3, "removed": False},
    {"id": 6, "color": "white", "col": 11, "row": 4, "removed": False},
    {"id": 7, "color": "white", "col": 16, "row": 0, "removed": False},
    {"id": 8, "color": "white", "col": 16, "row": 1, "removed": False},
    {"id": 9, "color": "white", "col": 16, "row": 2, "removed": False},
    {"id": 10, "color": "white", "col": 18, "row": 0, "removed": False},
    {"id": 11, "color": "white", "col": 18, "row": 1, "removed": False},
    {"id": 12, "color": "white", "col": 18, "row": 2, "removed": False},
    {"id": 13, "color": "white", "col": 18, "row": 3, "removed": False},
    {"id": 14, "color": "white", "col": 18, "row": 4, "removed": False},
    {"id": 15, "color": "black", "col": 23, "row": 0, "removed": False},
    {"id": 16, "color": "black", "col": 23, "row": 1, "removed": False},
    {"id": 17, "color": "black", "col": 12, "row": 0, "removed": False},
    {"id": 18, "color": "black", "col": 12, "row": 1, "removed": False},
    {"id": 19, "color": "black", "col": 12, "row": 2, "removed": False},
    {"id": 20, "color": "black", "col": 12, "row": 3, "removed": False},
    {"id": 21, "color": "black", "col": 12, "row": 4, "removed": False},
    {"id": 22, "color": "black", "col": 7, "row": 0, "removed": False},
    {"id": 23, "color": "black", "col": 7, "row": 1, "removed": False},
    {"id": 24, "color": "black", "col": 7, "row": 2, "removed": False},
    {"id": 25, "color": "black", "col": 5, "row": 0, "removed": False},
    {"id": 26, "color": "black", "col": 5, "row": 1, "removed": False},
    {"id": 27, "color": "black", "col": 5, "row": 2, "removed": False},
    {"id": 28, "color": "black", "col": 5, "row": 3, "removed": False},
    {"id": 29, "color": "black", "col": 5, "row": 4, "removed": False}
]

DEFAULT_DICE = {
    "dice1": 0,
    "dice2": 0,
    "moves": 0,
}

class SingletonJSONFieldDefault(object):
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = DEFAULT_BOARD
        return cls._instance

class DiceDefault(object):
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = DEFAULT_DICE
        return cls._instance

class Game(models.Model):
    choices = [
        ("white", "white"),
        ("black", "black"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_time = models.DateTimeField(auto_now_add=True)
    turn = models.CharField(max_length=5, choices=choices, blank=True, null=True, default="white" if random.random() > 0.5 else "black")
    finished = models.BooleanField(default=False)
    board = models.JSONField(default=SingletonJSONFieldDefault, blank=True, null=True)
    dice = models.JSONField(default=DiceDefault, blank=True, null=True)
    dicePhysics = models.JSONField(default=dict, blank=True, null=True)
    # I chose the winner to be a string, so that if the user deletes their account, 
    # in their friend's games their name doesn't appear as null
    winner = models.CharField(max_length=50, blank=True, null=True)
    white = models.ForeignKey("users.CustomUser", on_delete=models.SET_NULL, blank=True, null=True, related_name="white")
    black = models.ForeignKey("users.CustomUser", on_delete=models.SET_NULL, blank=True, null=True, related_name="black")

    def __str__(self):
        return f"{self.id}"


class InGameMessages(models.Model):
    id = models.IntegerField(primary_key=True)
    message = models.CharField(max_length=200)
    show = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.id} - {self.message}"
