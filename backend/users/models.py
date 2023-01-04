from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    total_games = models.IntegerField(default=0)

    is_online = models.BooleanField(default=False, blank=True)

    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    friend_requests = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='+')

    # def save(self, *args, **kwargs):
    #     if self in self.friends.all():
    #         self.friends.remove(self)
            # self.friends.delete(self)
        # super().save(*args, **kwargs)

    def __str__(self):
        return f"user: {self.username}, pk: {self.pk}"