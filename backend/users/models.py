import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

from game.models import Game

PROVIDERS = [
    ("credentials", "credentials"),
    ("discord", "discord")
]

'''
    The abstract custom user

    Fields:
    - id: Auto-incrementing primary key field.
    - email: Email field that must be unique.
    - image: Field to upload a user's profile picture.
    - games_won: Integer field to track the number of games won by the user.
    - games_lost: Integer field to track the number of games lost by the user.
    - total_games: Integer field to track the total number of games played by the user.
    - is_online: Boolean field indicating whether the user is currently online.
    - friends: Many-to-many relationship field representing the user's friends.
    - friend_requests: Many-to-many relationship field representing friend requests sent by the user.
    - game_requests: Many-to-many relationship field representing game requests sent by the user.
    - live_game: ForeignKey field representing the user's currently active game.
    - games: Many-to-many relationship field representing the user's played games.
    - provider: Field to specify the user's provider with a maximum length of 11 characters.

    Methods:
    - get_date_joined: Property method returning the timestamp of the user's date joined.
    - save: Overridden save method to handle preventing the user from adding themselves as a friend.
'''
class CustomUser(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, blank=True)
    image = models.ImageField(upload_to="profile_pics/", null=True, blank=True)
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    total_games = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False, blank=True)
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    friend_requests = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='+')
    game_requests = models.ManyToManyField('self', symmetrical=False, blank=True)
    live_game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    games = models.ManyToManyField(Game, symmetrical=False, blank=True)
    provider = models.CharField(max_length=11, choices=PROVIDERS, default="credentials", blank=True)

    @property
    def get_date_joined(self):
        return round(datetime.timestamp(self.date_joined))

    def save(self, *args, **kwargs):
        # If the user has friends, and is trying to add himself as a friend, raise an exception
        if self.pk != None and self.friends.filter(pk=self.pk).exists():
            self.friends.remove(self)
            raise Exception("You can't add yourself as a friend")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"user: {self.username}, pk: {self.pk}"


'''
    Chat model, used for chats between users.

    Fields:
    - uuid: Primary key field representing the universally unique identifier (UUID) of the chat.
    - users: Many-to-many relationship field representing the users participating in the chat.
    - messages: Many-to-many relationship field representing the messages exchanged in the chat.

    Methods:
    - save: Overridden save method to ensure a chat has at most two users.
'''
class Chat(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True, editable=False)
    users = models.ManyToManyField('CustomUser', related_name='chats')
    messages = models.ManyToManyField('Message', related_name='chats', blank=True)

    def __str__(self):
        return f"chat: {self.pk}"

    def save(self, *args, **kwargs):
        if self.uuid != None and self.users.all().count() > 2:
            raise Exception("Chat must have at most, 2 users.")
        else:
            super().save(*args, **kwargs)


'''
    A single chat message.

    Fields:
    - text: The content of the message.
    - sender: ForeignKey field representing the user who sent the message.
    - timestamp: DateTimeField representing the timestamp when the message was created.

    Methods:
    - save: Overridden save method to ensure the message is not empty.
'''
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