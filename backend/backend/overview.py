from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([])
def api_overview(request):
    api_urls = {
        'GET JWT Tokens': '/api/token/',
        'POST JWT Token': '/api/token/refresh/',
        '---------------': '--------------',
        'GET All Friend Requests': '/api/handle-friends/',
        'PUT Manage Friend Requests': '/api/handle-friends/',
        'GET User Profile': '/api/get-user-profile/',
        'GET Chat UUID': '/api/get-chat-uuid/<int:friend_id>/',
        '----------------': '--------------',
        'POST New User': '/api/signup/',
    }
    return Response(api_urls)