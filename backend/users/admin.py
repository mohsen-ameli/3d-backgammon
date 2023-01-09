from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Chat, Message

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = (
        *UserAdmin.fieldsets,
        (
            'User Info',
            {
                'fields': (
                    'games_won',
                    'games_lost',
                    'total_games',
                    'is_online',
                    'friends',
                    'friend_requests',
                )
            }
        )
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Chat)
admin.site.register(Message)
