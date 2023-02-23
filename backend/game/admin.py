from django.contrib import admin

from .models import Game, InGameMessages

admin.site.register(Game)
admin.site.register(InGameMessages)