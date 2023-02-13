from django.db import models
import uuid

class Game(models.Model):
    choices = [
        ("white", "white"),
        ("black", "black"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_time = models.DateTimeField(auto_now_add=True)
    turn = models.CharField(max_length=5, choices=choices, blank=True, null=True)
    finished = models.BooleanField(default=False)
    board = models.JSONField(blank=True, null=True)
    winner = models.ForeignKey("users.CustomUser", on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.id}"