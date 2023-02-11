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
def get_updates(id: int, updates_on: str) -> dict:
    if updates_on not in ["status", "friends-list"]:
        return ValueError("updates_on has is a strict string passed down from the frontend!")
    
    user = CustomUser.objects.get(id=id)

    dict_to_return = {"updates_on": updates_on}

    # Front end wants updates on the user's friend list, so we shall provide
    if updates_on == "friends-list":
        dict_to_return['num_requests'] = user.friend_requests.count()
        dict_to_return['friends'] = []

        friends = user.friends.all().order_by("-is_online")

        for friend in friends:
            try:
                last_login = round(datetime.timestamp(friend.last_login))
            except TypeError:
                last_login = None
            dict_to_return['friends'].append({'id': friend.id, 'username': friend.username, 'is_online': friend.is_online, 'last_login': last_login})

    # Default status for all pages in the front end
    dict_to_return['game_requests'] = []
    dict_to_return['rejected_request'] = None
    # dict_to_return['accepted_request'] = None

    # If user's friend rejected this user's game request
    rejected = user.rejected_request
    if rejected:
        dict_to_return['rejected_request'] = {"id": rejected.id, "username": rejected.username}

    # All of user's game requests
    for req in user.game_requests.all():
        dict_to_return['game_requests'].append({"id": req.id, "username": req.username})

    return dict_to_return


# Updating user's fields
@database_sync_to_async
def update_user(user: CustomUser, **kwargs):
    for key, value in kwargs.items():
        user.update(**{key: value})