import channels.layers

from asgiref.sync import async_to_sync
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.db.models.signals import post_save
from fieldsignals import post_save_changed

from .models import CustomUser

'''
    Sends updates to user, when their friend_requests
    or friends list changes.
'''
@receiver(m2m_changed, sender=CustomUser.friend_requests.through)
@receiver(m2m_changed, sender=CustomUser.friends.through)
def update_friend_list_listener(sender, instance: CustomUser, **kwargs):
    group_name = f'user-{instance.id}'

    channel_layer = channels.layers.get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        group_name,
        { 'type': 'send_updates' }
    )

'''
    Sends updates to user's friends, when the current
    user's online status, username, or image changes.
'''
@receiver(post_save_changed, sender=CustomUser, fields=['is_online', 'username', 'image'])
def update_friend_list_listener(sender, instance: CustomUser, **kwargs):
    for friend in instance.friends.all():
        group_name = f'user-{friend.id}'

        channel_layer = channels.layers.get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            group_name,
            { 'type': 'send_updates' }
        )


'''
    Sends update to user, when their game requests change
'''
@receiver(m2m_changed, sender=CustomUser.game_requests.through)
def update_user_game_requests(sender, instance: CustomUser, **kwargs):
    group_name = f'user-status-{instance.id}'

    channel_layer = channels.layers.get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        group_name,
        { 'type': 'send_updates' }
    )

'''
    Sends out an update to the user, when they enter a live game
'''
@receiver(post_save_changed, sender=CustomUser, fields=['live_game'])
def update_friend_list_listener(sender, instance: CustomUser, **kwargs):
    group_name = f'user-status-{instance.id}'

    channel_layer = channels.layers.get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        group_name,
        { 'type': 'send_updates' }
    )
