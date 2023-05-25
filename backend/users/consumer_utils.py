from datetime import datetime
from channels.db import database_sync_to_async
from django.utils import timezone
from django.db.models import Q

from .models import CustomUser, Chat


# TODO: Probably convert this to a serializer
'''
    Takes a chat object in, and return a list filled with the chat messages
'''
@database_sync_to_async
def get_all_chat_msg(chat: Chat) -> list:
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


'''
    Gets all friends and number of friend requests of a user,
    and returns it as a dictionary.
'''
@database_sync_to_async
def get_updates(id: int) -> dict:
    user = CustomUser.objects.get(id=id)
    dict_to_return = {}

    # Front end wants updates on the user's friend list, so we shall provide
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


'''
    Gets all game requests and any live games of a user.
'''
@database_sync_to_async
def get_user_game_requests(id: int) -> dict:
    user = CustomUser.objects.get(id=id)
    dict_to_return = {}

    # Default status for all pages in the front end
    dict_to_return['game_requests'] = []
    dict_to_return['live_game'] = str(user.live_game.id) if user.live_game else None

    # All of user's game requests
    for req in user.game_requests.all():
        dict_to_return['game_requests'].append({"id": req.id, "username": req.username})

    return dict_to_return


'''
    Method for updating CustomUser's fields
'''
@database_sync_to_async
def update_user(id: int, is_online: bool, last_login: datetime):
    user = CustomUser.objects.get(id=id)
    user.is_online = is_online
    user.last_login = last_login
    user.save()

    # for key, value in kwargs.items():
    #     user.update(**{key: value})
    


'''
    Resting all of user's game requests (When they leave the application)
'''
@database_sync_to_async
def reset_match_requests(id: int):
    user = CustomUser.objects.get(id=id)
    user.game_requests.clear()
