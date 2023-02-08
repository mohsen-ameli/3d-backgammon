from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Chat, Message

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_online')

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
                    'game_requests',
                    'rejected_request'
                )
            }
        )
    )

class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('sender__username', 'text')
    ordering = ('-timestamp',)
    list_per_page = 25


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Chat)
admin.site.register(Message, MessageAdmin)
