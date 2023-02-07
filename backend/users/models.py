import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

class CustomUser(AbstractUser):
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    total_games = models.IntegerField(default=0)

    is_online = models.BooleanField(default=False, blank=True)

    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    friend_requests = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='+')
    game_requests = models.ManyToManyField('self', symmetrical=False, blank=True)

    @property
    def get_date_joined(self):
        return round(datetime.timestamp(self.date_joined))

    def save(self, *args, **kwargs):
        # If the user has friends, and is trying to add himself as a friend, raise an exception
        try:
            if self.friends.contains(self):
                self.friends.remove(self)
                raise Exception("You can't add yourself as a friend")
        except ValueError:
            pass
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"user: {self.username}, pk: {self.pk}"


class Chat(models.Model):
    uuid = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4(), editable=False)
    users = models.ManyToManyField('CustomUser', related_name='chats')
    messages = models.ManyToManyField('Message', related_name='chats', blank=True)

    def __str__(self):
        return f"chat: {self.pk}"

    def save(self, *args, **kwargs):
        if self.users.all().count() > 2:
            raise Exception("Chat must have at most, 2 users.")
        else:
            super().save(*args, **kwargs)


class Message(models.Model):
    text = models.CharField(max_length=250)
    sender = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='sent_messages')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} - {self.timestamp}"

    def save(self, *args, **kwargs):
        if self.text == '':
            raise Exception("Message can't be empty")
        else:
            super().save(*args, **kwargs)

    class Meta:
        ordering = ['timestamp']