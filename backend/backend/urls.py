from django.contrib import admin
from django.urls import path, include
from .overview import api_overview
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', api_overview),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/game/', include('game.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)