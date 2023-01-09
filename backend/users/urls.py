from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from . import views

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('handle-friends/', views.handle_friends),
    path('get-friend-requests/', views.get_friend_requests),
    path('change-user-status/', views.change_status),
    path('signup/', views.register_user),
    path('get-chat-uuid/<int:friend_id>/', views.get_chat_uuid),
]