import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from .torch_utils import get_prediction

'''
    This function will allow the frontend to retrieve and change the 
    training data for the dice rotation model. 
'''
@api_view(['GET', 'POST'])
@permission_classes([])
def handle_dice_ai(request: Request):
    if request.method == "GET":
        f = open("/mnt/d/Dev/3d-backgammon/backend/ai/DiceTrainingData.json")
        data = json.load(f)
        f.close()
        return Response(data)
    elif request.method == "POST":
        with open("/mnt/d/Dev/3d-backgammon/backend/ai/DiceTrainingData.json", "r+") as f:
            try:
                data = json.load(f)
            except (FileNotFoundError, json.decoder.JSONDecodeError):
                data = []
            data.append(request.data)
            f.seek(0)
            json.dump(data, f, indent=2)
            f.truncate()
        return Response()


'''
    This function will use the NN to predict the number on the dice.
'''
@api_view(['POST'])
@permission_classes([])
def get_dice_prediction(request: Request):
    x, y, z = request.data.values()
    prediction = get_prediction(x, y, z)
    return Response({ "prediction": prediction })
