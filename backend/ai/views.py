import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from django.conf import settings

'''
    This function will allow the frontend to retriece and change the 
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

