from datetime import datetime
from channels.db import database_sync_to_async
from django.utils import timezone

from .models import CustomUser, Chat


# Takes a chat object in, and return a list filled with the messages
@database_sync_to_async
def get_messages_context(chat: Chat) -> list:
    messages = chat.messages.all()
    context = []

    for msg in messages:
        timestamp = round(msg.timestamp.replace(tzinfo=timezone.utc).timestamp())
        
        context.append({
            'message': msg.text,
            'sender': msg.sender.id,
            'timestamp': timestamp
        })
    return context


# Gets all friends and number of friend requests of a user
@database_sync_to_async
def get_friends(user: CustomUser) -> dict:
    dict_to_return = {}

    dict_to_return['num_requests'] = user.friend_requests.count()
    dict_to_return['friends'] = []

    friends = user.friends.all().order_by("-is_online")

    for friend in friends:
        try:
            last_login = round(datetime.timestamp(friend.last_login))
        except TypeError:
            last_login = None
        dict_to_return['friends'].append({'id': friend.id, 'username': friend.username, 'is_online': friend.is_online, 'last_login': last_login})
    return dict_to_return


# Updating user's fields
@database_sync_to_async
def update_user(user: CustomUser, **kwargs):
    for key, value in kwargs.items():
        user.update(**{key: value})