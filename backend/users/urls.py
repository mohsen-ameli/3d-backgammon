from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from . import views

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('signup/', views.register_user),
    path('handle-friends/', views.handle_friends),
    path('get-user-profile/', views.get_user_profile),
    path('get-chat-uuid/<int:friend_id>/', views.get_chat_uuid),
]