import random, time, subprocess
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from django.core.exceptions import ValidationError
from django.conf import settings

from .models import Game, InGameMessages
from users.models import CustomUser
from .serializers import InGameMessagesSerializer
from .game_utils import convert_to_simple_format


'''
    This method will handle all the requests for a match
'''
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def handle_match_request(request: Request):
    action = request.data["action"]
    friend_id = int(request.data["friend_id"])
    friend = CustomUser.objects.filter(id=friend_id)

    if not friend.exists():
        return Response("User not found!", 404)
    
    friend = friend.first()

    # User is sending a match request
    if action == "send":
        if not friend.is_online:
            return Response({"success": False})
        friend.game_requests.add(request.user)

    # User has accepted a match request
    elif action == "accept":
        request.user.game_requests.remove(friend)
        newGame = Game()

        if random.random() > 0.5:
            newGame.black = request.user
            newGame.white = friend
        else:
            newGame.white = request.user
            newGame.black = friend

        newGame.turn = "black" if random.random() > 0.5 else "white"

        # Setting the allowed time for user to make move. In frontend, we will subtract the current time from this time
        # and if it's less than 70 seconds, then user can still move, otherwise, we will resign the user with this id
        if newGame.turn == "black":
            newGame.player_timer = { "id": newGame.black.id, "time": round(time.time() * 1000) + settings.USER_TURN_DURATION * 1000 }
        else:
            newGame.player_timer = { "id": newGame.white.id, "time": round(time.time() * 1000) + settings.USER_TURN_DURATION * 1000 }

        newGame.save()

        request.user.games.add(newGame)
        friend.games.add(newGame)

        friend.live_game = newGame
        request.user.live_game = newGame

        friend.save()
        request.user.save()

        return Response({"game_id": newGame.id})
        
    # User has rejected a match request
    elif action == "reject":
        request.user.game_requests.remove(friend)
        friend.save()

    return Response({"success": True})


'''
    This method will check if the user is joining a valid game
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def valid_match(request: Request, game_id):
    # Making sure that user has not tampered with the game id
    try:
        game = Game.objects.filter(id=game_id)
    except ValidationError:
        return Response({"valid": False})

    # If game doesn't exist or user doesn't have any games
    if not game.exists() or not request.user.live_game:
        return Response({"valid": False})

    # If the game is user's game then return the good stuff
    if request.user.live_game.id == game.first().id:
        return Response({"valid": True, "finished": game.first().finished})

    # Game is not user's
    return Response({"valid": False})


'''
    This method will get all of the available in-game messages
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_in_game_messages(request: Request):
    serializer = InGameMessagesSerializer(InGameMessages.objects.all().order_by("id"), many=True)
    return Response(serializer.data)


'''
    This will get the computer prediction of the best checker move, based
    on the current checkers and dice numbers.
    This method also translates gnubg's hints to the system that I have designed
    in the frontend.
'''
@api_view(['POST'])
@permission_classes([])
def computer_prediction(request: Request):
    user_checker = request.data["user_checker"]
    dice1 = request.data["dice1"]
    dice2 = request.data["dice2"]
    board = request.data["board"]

    if board == "" or dice1 == 0 or dice2 == 0:
        raise ValueError()

    simple = convert_to_simple_format(board)
    process = subprocess.Popen(["gnubg" , "-q", "-t"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, stdin=subprocess.PIPE, universal_newlines=True)
    process.stdin.write("new game\n")
    process.stdin.flush()
    process.stdin.write(f"set board simple {simple}\n")
    process.stdin.flush()
    if user_checker == "black":
        process.stdin.write("set turn gnubg\n")
        process.stdin.flush()
    process.stdin.write(f"set dice {dice1} {dice2}\n")
    process.stdin.flush()
    process.stdin.write("hint 1\n")
    process.stdin.flush()

    res = process.communicate()[0]

    process.stdin.close()
    process.wait()

    if "There are no legal moves." in res:
        return Response({ "moves": None })
    
    # Some examples of what hints look like
    # hints = ["bar/24*/22", "bar/24"]
    # hints = ["bar/24*(2)", "8/7(2)"]
    # hints = ["bar/24*/23", "bar/24", "8/7"]
    # hints = ["bar/24*/23(2)"]
    # hints = ["12/8*/6"]
    # hints = ["12/8*/6(2)"]
    # hints = ["18/14(2)"]
    # hints = ["6/1(4)"]
    # hints = ["6/2(2)", "4/off(2)"]
    # hints = ["bar/21"]
    # hints = ["3/off", "1/off"]
    # hints = ["6/3", "6/off"]
    # hints = ["18/-3", "5/-3"]

    dice1 = int(dice1)
    dice2 = int(dice2)

    hints = process.communicate()[0].split("-ply")[1].split("Eq.")[0].strip().split(" ")
    
    moves: list[str] = []
    
    for hint in hints:
        # We don't need * in frontend
        hint = hint.replace("*", "")

        from_pos = hint.split("/")[0]
        to_pos = hint.split("/")[1]

        if "off" in to_pos:
            to_pos = "-3" if user_checker == "white" else "-4"
            hint = hint.replace("off", to_pos)

        # Computer's moving a removed checker back into the board
        if from_pos == "bar":
            # Logic needed in frontend
            from_pos = "-1" if user_checker == "white" else "-2"
            hint = hint.replace("bar", from_pos)

            # If gnubg is making multiple moves in one hint, e.g -1/24/22
            if hint.count("/") > 1:
                double = "(2)" in hint
                if double:
                    hint = hint.split("(2)")[0]

                move_a = f"{from_pos}/{hint.split('/')[1]}"
                move_b = f"{hint.split('/')[1]}/{hint.split('/')[2]}"
                moves += [move_a]
                moves += [move_b]

                if double:
                    moves += [move_a]
                    moves += [move_b]

                continue

        if hint.count("/") > 1:
            double = "(2)" in hint
            if double:
                hint = hint.split("(2)")[0]

            move_a = f"{from_pos}/{hint.split('/')[1]}"
            move_b = f"{hint.split('/')[1]}/{hint.split('/')[2]}"
            moves += [move_a]
            moves += [move_b]

            if double:
                moves += [move_a]
                moves += [move_b]

            continue
        
        if "(2)" in hint:
            move = hint.split("(2)")[0]
            moves += [move, move]
        elif "(3)" in hint:
            move = hint.split("(3)")[0]
            moves += [move, move, move]
        elif "(4)" in hint:
            move = hint.split("(4)")[0]
            moves += [move, move, move, move]
        else:
            moves += [hint]
    
    # Fixing the issue of having multiple moves within one hint. e.g:
    # hint = 18/14
    # dice1 = 1
    # dice2 = 2
    # split into -> 18/17 17/16

    if (dice1 == dice2 and len(moves) == 4) or (dice1 != dice2 and len(moves) == 2):
        return Response({"moves": moves})

    again = True
    i = 0
    while again:
        for move in moves.copy():
            move_a = int(move.split("/")[0])
            move_b = int(move.split("/")[1])

            # Computer is making two moves with a single checker, starting from the bar.
            if (move_b == -3 or move_b == -4) and ((dice1 == dice2 and len(hints) < 4) or (dice1 != dice2 and len(hints) < 2)):
                moves.remove(move)

                # Logic to correctly minus the dice number from move_a.
                problem_with_dice1 = False

                # There can be a problem when the two dice aren't the same and gnubg
                # is adding the two dice numbers together for a total hints value of, ex: "14/4", if we rolled a 6 and a 4
                if dice1 != dice2:
                    filtered_list = list(filter(lambda c: int(c['col']) == move_a - dice1 - 1 and c['color'] != user_checker, board))
                    problem_with_dice1 = len(filtered_list) > 1

                if problem_with_dice1:
                    middle = move_a - dice2
                    if middle <= 0:
                        moves.append(move)
                        continue
                    again = middle - dice1 != 0
                else:
                    middle = move_a - dice1
                    if middle <= 0:
                        moves.append(move)
                        continue
                    again = middle - dice2 != 0

                new_move_a = f"{move_a}/{middle}"
                new_move_b = f"{middle}/{move_b}"
                moves += [new_move_a, new_move_b]

            elif (move_a == -1 or move_a == -2) and 25 - move_b not in [dice1, dice2] and 24 - move_b != 0:
                moves.remove(move)

                dice_to_compare = dice1 - 1 if user_checker == "white" else 24 - dice1

                # Checking for checkers on the black "enemy" house, for columns with two or more checkers
                filtered_list = list(filter(lambda c: int(c['col']) == dice_to_compare and c['color'] != user_checker, board))
                problem_with_dice1 = len(filtered_list) > 1
                
                if problem_with_dice1:
                    middle = 25 - dice2
                else:
                    middle = 25 - dice1

                new_move_a = f"{move_a}/{middle}"
                new_move_b = f"{middle}/{move_b}"
                moves.insert(0, new_move_b)
                moves.insert(0, new_move_a)

            elif move_a != -1 and move_a != -2 and move_b != -3 and move_b != -4 and move_a - move_b not in [dice1, dice2]:
                moves.remove(move)

                # Logic to correctly minus the dice number from move_a.
                problem_with_dice1 = False

                # There can be a problem when the two dice aren't the same and gnubg
                # is adding the two dice numbers together for a total hints value of, ex: "14/4", if we rolled a 6 and a 4
                if dice1 != dice2:
                    filtered_list = list(filter(lambda c: int(c['col']) == move_a - dice1 - 1 and c['color'] != user_checker, board))
                    problem_with_dice1 = len(filtered_list) > 1

                if problem_with_dice1:
                    middle = move_a - dice2
                    again = middle - dice1 != move_b
                else:
                    middle = move_a - dice1
                    again = middle - dice2 != move_b

                new_move_a = f"{move_a}/{middle}"
                new_move_b = f"{middle}/{move_b}"
                moves += [new_move_a, new_move_b]

            else:
                if (dice1 == dice2 and len(moves) == 4) or (dice1 != dice2 and len(moves) == 2) or ((move_a == -1 or move_a == -2) and len(moves) == 1):
                    again = False
                moves.remove(move)
                moves.append(move)
                continue

        # If there's a bug and the program gets stuck in an infinite loop, we will break it after 3 iterations
        if i > 3:
            break
        i += 1

    return Response({"moves": moves})
