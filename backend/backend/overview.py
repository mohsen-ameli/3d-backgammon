from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([])
def api_overview(request):
    api_urls = {
        'GET JWT Toekn': '/api/token/',
        'POST JWT Access Token': '/api/token/refresh/',
        "---------------": "--------------",
        'GET All Friends': '/api/handle-friends/',
        'PUT Manage Friend Requests': '/api/handle-friends/',
        "----------------": "--------------",
        'POST New User': '/api/signup/',
    }
    return Response(api_urls)