from rest_framework.response import Response


def remove_friend(user, friend):
    '''
        Removing a friend
    '''
    user.friends.remove(friend)
    return Response({"message": "Friend removed"})


def new_friend_request(user, friend):
    '''
        Sending a new friend request
    '''
    if friend.friend_requests.filter(id=user.id).exists():
        message = "Friend request already sent"
        error = True
    elif friend == user:
        message = "You can't add yourself"
        error = True
    elif friend.friends.filter(id=user.id).exists():
        message = "You are already friends"
        error = True
    else:
        message = "Friend added"
        error = False
        friend.friend_requests.add(user)
    return Response({"message": message, "error": error})


def accept_friend_request(user, friend):
    '''
        Accepting a friend request
    '''
    user.friend_requests.remove(friend)
    user.friends.add(friend)
    return Response({"message": "Friend accepted"})


def reject_friend_request(user, friend):
    '''
        Rejecting a friend request
    '''
    user.friend_requests.remove(friend)
    return Response({"message": "Friend rejected"})