from django.urls import path, include
from authapp.views import TemplateIndexView, UpdateUserProfileView, PasswordChangeUserProfileView

app_name = 'authapp'

urlpatterns = [
    path('<pk>', TemplateIndexView.as_view(), name='profile'),
    path('edit/<pk>/', UpdateUserProfileView.as_view(), name='editprofile'),
    path('password-change/<pk>/', PasswordChangeUserProfileView.as_view(), name='password_change'),
]