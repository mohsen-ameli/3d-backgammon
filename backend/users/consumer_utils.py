from datetime import datetime
from channels.db import database_sync_to_async
from django.utils import timezone
from django.db.models import Q

from .models import CustomUser, Chat


# TODO: Probably convert this to a serializer
@database_sync_to_async
def get_all_chat_msg(chat: Chat) -> list:
    '''
        Takes a chat object in, and return a list filled with the chat messages
    '''

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


@database_sync_to_async
def get_updates(id: int, updates_on: str) -> dict:
    '''
        Gets all friends and number of friend requests of a user,
        and returns it as a dictionary.
    '''

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
    dict_to_return['live_game'] = str(user.live_game.id) if user.live_game else None

    # If user's friend rejected the current user's game request
    rejected = user.rejected_request
    if rejected:
        dict_to_return['rejected_request'] = {"id": rejected.id, "username": rejected.username}

    # All of user's game requests
    for req in user.game_requests.all():
        dict_to_return['game_requests'].append({"id": req.id, "username": req.username})

    return dict_to_return


@database_sync_to_async
def update_user(user: CustomUser, **kwargs):
    '''
        Method for updating CustomUser's fields
    '''

    for key, value in kwargs.items():
        user.update(**{key: value})


@database_sync_to_async
def reset_match_requests(user: CustomUser):
    '''
        Reseting all of user's game requests (When they leave the applicaiton)
    '''

    user.first().game_requests.clear()


@database_sync_to_async
def search(typed: str):
    '''
        Querying the database for matching username or email, based on user's input
    '''

    results = CustomUser.objects.filter(
        Q(username__iexact=typed) | Q(email__iexact=typed)
    )
    return list(results.values('id', 'username'))
