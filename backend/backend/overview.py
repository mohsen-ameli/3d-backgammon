from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([])
def api_overview(request):
    api_urls = {
        '-----------------': 'Sign In & Sign Up',
        'GET JWT login tokens': '/api/token/',
        'GET JWT login tokens (providers)': '/api/get-jwt-provider/',
        'POST JWT refresh token': '/api/token/refresh/',
        'POST registration': '/api/signup/',
        'POST registration (providers)': '/api/sign-in-up-provider/',
        '----------------': 'Users',
        'GET/PUT handling friend': '/api/handle-friends/',
        'GET user specific profile': '/api/get-user-profile/<int:id>/',
        'GET all user ids': '/api/get-user-ids/',
        'GET search for a friend': '/api/search-friend/<str:typed>/',
        'GET chat UUID between friends': '/api/get-chat-uuid/<str:friend_id>/',
        'GET validate chat UUID': '/api/validate-chat/<str:chat_uuid>/',
        '---------------': 'Game',
        'PUT all match related requests': '/api/game/handle-match-request/',
        'GET validate match': '/api/game/valid-match/<str:game_id>/',
        'GET all in-game messages': '/api/game/get-in-game-messages/'
    }
    return Response(api_urls)