import channels.layers, io
import numpy as np
from matplotlib.image import imsave
from asgiref.sync import async_to_sync
from typing import Literal
from randimage import get_random_image
from fieldsignals import post_save_changed

from django.core.files.base import ContentFile
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import CustomUser

def update(consumer: Literal["user", "user-status"], id: int):
    group_name = f'{consumer}-{id}'

    channel_layer = channels.layers.get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        group_name,
        { 'type': 'send_updates' }
    )

'''
    Signal to create a profile picture (A random one if user didn't upload one)
    as soon as a user is signed up.
'''
@receiver(post_save, sender=CustomUser)
def create_profile_picture(sender, instance: CustomUser, created: bool, **kwargs):
    '''
        Function used to generate a picture given an image array
    '''
    def update_profile_picture(user: CustomUser, image_array: np.array):
        buf = io.BytesIO()
        imsave(buf, image_array, format="PNG")
        image_file = ContentFile(buf.getvalue())
        user.image.save(f'{user.username}.jpg', image_file, save=True)

    if instance.image == None or instance.image == "":
        image_array = get_random_image((128,128))
        update_profile_picture(instance, image_array)


'''
    Sends updates to user, when their friend_requests
    or friends list changes.
'''
@receiver(m2m_changed, sender=CustomUser.friend_requests.through)
@receiver(m2m_changed, sender=CustomUser.friends.through)
def update_friends(sender, instance: CustomUser, **kwargs):
    update("user", instance.id)

    if instance.friends.exists():
        for friend in instance.friends.all():
            update("user", friend.id)

'''
    Sends updates to user's friends, when the current
    user's online status, username, or image changes.
'''
@receiver(post_save_changed, sender=CustomUser, fields=['is_online', 'username', 'image'])
def update_friends_status(sender, instance: CustomUser, **kwargs):
    for friend in instance.friends.all():
        update("user", friend.id)


'''
    Sends update to user, when their game requests change
'''
@receiver(m2m_changed, sender=CustomUser.game_requests.through)
def update_user_game_requests(sender, instance: CustomUser, **kwargs):
    update("user-status", instance.id)

'''
    Sends out an update to the user, when they enter a live game
'''
@receiver(post_save_changed, sender=CustomUser, fields=['live_game'])
def update_live_game(sender, instance: CustomUser, **kwargs):
    update("user-status", instance.id)
