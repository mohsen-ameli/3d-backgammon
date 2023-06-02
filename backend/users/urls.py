from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from . import views

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', views.register_user),
    path('handle-friends/', views.handle_friends),
    path('get-user-profile/<int:id>', views.get_user_profile),
    path('get-user-ids/', views.get_user_ids),
    path('search-friend/<str:typed>/', views.search_friend),
    path('get-chat-uuid/<str:friend_id>/', views.get_chat_uuid),
    path('validate-chat/<str:chat_uuid>/', views.validate_chat),
    path('sign-in-up-provider/', views.sign_in_up_provider),
    path('get-jwt-provider/', views.get_jwt_provider),
]