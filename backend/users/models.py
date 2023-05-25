import uuid, io
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.files.base import ContentFile
from randimage import get_random_image
from matplotlib.image import imsave
import numpy as np

from game.models import Game

PROVIDERS = [
    ("credentials", "credentials"),
    ("discord", "discord")
]

'''
    The abstract custom user
'''
class CustomUser(AbstractUser):
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
    Function used to generate a picture given an image array
'''
def update_profile_picture(user: CustomUser, image_array: np.array):
    buf = io.BytesIO()
    imsave(buf, image_array, format="PNG")
    image_file = ContentFile(buf.getvalue())
    user.image.save(f'{user.username}.jpg', image_file, save=True)


'''
    Signal to create a profile picture (A random one if user didn't upload one)
    as soon as a user is signed up.
'''
@receiver(post_save, sender=CustomUser)
def create_profile_picture(sender, instance: CustomUser, created: bool, **kwargs):
    if instance.image == None or instance.image == "":
        image_array = get_random_image((128,128))
        update_profile_picture(instance, image_array)


'''
    A chat model, used for chats between users.
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
    Model for a single chat message.
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