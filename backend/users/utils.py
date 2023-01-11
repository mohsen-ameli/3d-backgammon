from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


def remove_friend(user, friend):
    """
    Removing a friend
    """
    user.friends.remove(friend)
    return Response({"message": "Friend removed"})


def new_friend_request(user, friend):
    """
    Sending a new freind request
    """
    if friend.friend_requests.filter(id=user.id).exists():
        raise ValidationError("Friend request already sent")
    elif friend == user:
        raise ValidationError("You can't add yourself")
    elif friend.friends.filter(id=user.id).exists():
        raise ValidationError("You are already friends")
    friend.friend_requests.add(user)
    return Response({"message": "Friend added"})


def accept_friend_request(user, friend):
    """
    Accepting a friend request
    """
    user.friend_requests.remove(friend)
    user.friends.add(friend)
    return Response({"message": "Friend accepted"})


def reject_friend_request(user, friend):
    """
    Rejecting a friend request
    """
    user.friend_requests.remove(friend)
    return Response({"message": "Friend rejected"})