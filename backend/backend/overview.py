from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([])
def api_overview(request):
    api_urls = {
        '----------------- Sign In & Sign Up': '-----------------',
        '/api/token/': 'GET JWT login tokens',
        '/api/get-jwt-provider/': 'GET JWT login tokens (providers)',
        '/api/token/refresh/': 'POST JWT refresh token',
        '/api/signup/': 'POST registration',
        '/api/sign-in-up-provider/': 'POST registration (providers)',
        '----------------- Users': '-----------------',
        '/api/handle-friends/': 'GET/PUT handling friend',
        '/api/get-user-profile/<int:id>/': 'GET user specific profile',
        '/api/get-user-ids/': 'GET all user ids',
        '/api/search-friend/<str:typed>/': 'GET search for a friend',
        '/api/get-chat-uuid/<str:friend_id>/': 'GET chat UUID between friends',
        '/api/validate-chat/<str:chat_uuid>/': 'GET validate chat UUID',
        '----------------- Game': '-----------------',
        '/api/game/handle-match-request/': 'PUT all match related requests',
        '/api/game/valid-match/<str:game_id>/': 'GET validate match',
        '/api/game/get-in-game-messages/': 'GET all in-game messages',
    }
    return Response(api_urls)