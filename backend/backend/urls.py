from django.contrib import admin
from django.urls import path, include
from .overview import api_overview

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/game/', include('game.urls')),
    path('', api_overview),
    # path("/api-auth/", include("rest_framework.urls")),
]
