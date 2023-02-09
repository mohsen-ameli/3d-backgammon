from django.db import models
from users.models import CustomUser

class Game(models.Model):
    choices = [
        ("white", "white"),
        ("black", "black"),
    ]

    start_time = models.DateTimeField(auto_now_add=True)
    turn = models.CharField(max_length=5, choices=choices, blank=True, null=True)
    players = models.ManyToManyField(CustomUser, related_name='games', blank=True)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.players.first().username} vs {self.players.last().username} - {self.start_time}"