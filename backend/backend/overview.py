from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([])
def api_overview(request):
    api_urls = {
        'GET JWT Tokens': '/api/token/',
        'POST JWT Token': '/api/token/refresh/',
        'POST New User': '/api/signup/',
        '---------------': '--------------',
        'GET All Friend Requests': '/api/handle-friends/',
        'PUT Manage Friend Requests': '/api/handle-friends/',
        'GET User Profile': '/api/get-user-profile/',
        'GET Chat UUID': '/api/get-chat-uuid/<int:friend_id>/',
        '-----------------': '------------',
        'PUT All match related requests': '/api/game/handle-match-request/',
        'GET Valid match or not': '/api/game/valid-match/<str:game_id>/',
        'GET All in-game messages': '/api/game/get-in-game-messages/'
    }
    return Response(api_urls)