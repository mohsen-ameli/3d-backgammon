'''
    Default starting board, when starting a game
'''
DEFAULT_BOARD = [
    {"id": 0, "color": "white", "col": 0, "row": 0, "removed": False},
    {"id": 1, "color": "white", "col": 0, "row": 1, "removed": False},
    {"id": 2, "color": "white", "col": 11, "row": 0, "removed": False},
    {"id": 3, "color": "white", "col": 11, "row": 1, "removed": False},
    {"id": 4, "color": "white", "col": 11, "row": 2, "removed": False},
    {"id": 5, "color": "white", "col": 11, "row": 3, "removed": False},
    {"id": 6, "color": "white", "col": 11, "row": 4, "removed": False},
    {"id": 7, "color": "white", "col": 16, "row": 0, "removed": False},
    {"id": 8, "color": "white", "col": 16, "row": 1, "removed": False},
    {"id": 9, "color": "white", "col": 16, "row": 2, "removed": False},
    {"id": 10, "color": "white", "col": 18, "row": 0, "removed": False},
    {"id": 11, "color": "white", "col": 18, "row": 1, "removed": False},
    {"id": 12, "color": "white", "col": 18, "row": 2, "removed": False},
    {"id": 13, "color": "white", "col": 18, "row": 3, "removed": False},
    {"id": 14, "color": "white", "col": 18, "row": 4, "removed": False},
    {"id": 15, "color": "black", "col": 23, "row": 0, "removed": False},
    {"id": 16, "color": "black", "col": 23, "row": 1, "removed": False},
    {"id": 17, "color": "black", "col": 12, "row": 0, "removed": False},
    {"id": 18, "color": "black", "col": 12, "row": 1, "removed": False},
    {"id": 19, "color": "black", "col": 12, "row": 2, "removed": False},
    {"id": 20, "color": "black", "col": 12, "row": 3, "removed": False},
    {"id": 21, "color": "black", "col": 12, "row": 4, "removed": False},
    {"id": 22, "color": "black", "col": 7, "row": 0, "removed": False},
    {"id": 23, "color": "black", "col": 7, "row": 1, "removed": False},
    {"id": 24, "color": "black", "col": 7, "row": 2, "removed": False},
    {"id": 25, "color": "black", "col": 5, "row": 0, "removed": False},
    {"id": 26, "color": "black", "col": 5, "row": 1, "removed": False},
    {"id": 27, "color": "black", "col": 5, "row": 2, "removed": False},
    {"id": 28, "color": "black", "col": 5, "row": 3, "removed": False},
    {"id": 29, "color": "black", "col": 5, "row": 4, "removed": False}
]

'''
    Default dice, when starting a game
'''
DEFAULT_DICE = {
    "dice1": 0,
    "dice2": 0,
    "moves": 0,
}


'''
    User checker choices
'''
USER_CHECKER_CHOICES = [
    ("white", "white"),
    ("black", "black"),
]