from typing import List, Dict

# X -> white
# O -> black

def convert_to_simple_format(board: List[Dict[str, object]]) -> str:
    checkers = [0] * 26

    # Iterate over each checker in the board data
    for checker in board:
        color = checker["color"]
        col = checker["col"]

        # Calculate the point index based on the column
        if col == -1:
            index = 0
            checkers[index] += 1
        elif col == -2:
            index = 25
            checkers[index] += 1
        elif col == -3 or col == -4:
            pass
        elif color == "white":
            index = 23 - col + 1
            checkers[index] += 1
        else:
            index = 24 - col
            # Increment the point count for the corresponding index
            checkers[index] -= 1

    # Convert the point counts to a string in the "simple" format
    return " ".join(str(count) for count in checkers)

'''
{
  "user_checker": "black",
  "dice1": 1,
  "dice2": 6,
  "board": [
  {"id": 0, "color": "white", "col": 19, "row": 0, "removed": false },
  {"id": 1, "color": "white", "col": 20, "row": 2, "removed": false },
  {"id": 2, "color": "white", "col": 21, "row": 0, "removed": false },
  {"id": 3, "color": "white", "col": 20, "row": 0, "removed": false },
  {"id": 4, "color": "white", "col": 23, "row": 2, "removed": false },
  {"id": 5, "color": "white", "col": 20, "row": 1, "removed": false },
  {"id": 6, "color": "white", "col": 21, "row": 1, "removed": false },
  {"id": 7, "color": "white", "col": 19, "row": 1, "removed": false },
  {"id": 8, "color": "white", "col": 19, "row": 2, "removed": false },
  {"id": 9, "color": "white", "col": 22, "row": 0, "removed": false },
  {"id": 10, "color": "white", "col": -3, "row": 1, "removed": false },
  {"id": 11, "color": "white", "col": -3, "row": 0, "removed": false },
  {"id": 12, "color": "white", "col": 23, "row": 1, "removed": false },
  {"id": 13, "color": "white", "col": 23, "row": 0, "removed": false },
  {"id": 14, "color": "white", "col": 22, "row": 1, "removed": false },
  
  {"id": 15, "color": "black", "col": -2, "row": 0, "removed": true },
  {"id": 16, "color": "black", "col": 2, "row": 0, "removed": false },
  {"id": 17, "color": "black", "col": 4, "row": 0, "removed": false },
  {"id": 18, "color": "black", "col": 2, "row": 1, "removed": false },
  {"id": 19, "color": "black", "col": 3, "row": 0, "removed": false },
  {"id": 20, "color": "black", "col": 2, "row": 2, "removed": false },
  {"id": 21, "color": "black", "col": -2, "row": 1, "removed": true },
  {"id": 22, "color": "black", "col": 2, "row": 3, "removed": false },
  {"id": 23, "color": "black", "col": 5, "row": 0, "removed": false },
  {"id": 24, "color": "black", "col": 2, "row": 4, "removed": false },
  {"id": 25, "color": "black", "col": 3, "row": 1, "removed": false },
  {"id": 26, "color": "black", "col": 3, "row": 2, "removed": false },
  {"id": 27, "color": "black", "col": 4, "row": 1, "removed": false },
  {"id": 28, "color": "black", "col": 5, "row": 1, "removed": false },
  {"id": 29, "color": "black", "col": 5, "row": 2, "removed": false}
]
}
'''