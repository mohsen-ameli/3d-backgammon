from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


def remove_friend(user, friend):
    """
    Removing a friend
    """
    user.first().friends.remove(friend.first())
    return Response({"message": "Friend removed"})


def new_friend_request(user, friend):
    """
    Sending a new freind request
    """
    if friend.first().friend_requests.filter(id=user.first().id).exists():
        raise ValidationError("Friend request already sent")
    elif friend.first() == user.first():
        raise ValidationError("You can't add yourself")
    elif friend.first().friends.filter(id=user.first().id).exists():
        raise ValidationError("You are already friends")
    friend.first().friend_requests.add(user.first())
    return Response({"message": "Friend added"})


def accept_friend_request(user, friend):
    """
    Accepting a friend request
    """
    user.first().friend_requests.remove(friend.first())
    user.first().friends.add(friend.first())
    return Response({"message": "Friend accepted"})


def reject_friend_request(user, friend):
    """
    Rejecting a friend request
    """
    user.first().friend_requests.remove(friend.first())
    return Response({"message": "Friend rejected"})

def get_friends(user) -> dict:
    """
    Get all friends and number of friend requests
    """
    dict_to_return = {}

    dict_to_return['num_requests'] = user.friend_requests.count()
    dict_to_return['friends'] = []

    for friend in user.friends.all().order_by("-is_online"):
        dict_to_return['friends'].append({'id': friend.id, 'username': friend.username, 'is_online': friend.is_online})

    return dict_to_return