from django.urls import path, include
import mainapp.views as mainapp
from django.views.decorators.csrf import csrf_exempt


app_name = 'mainapp'

urlpatterns = [
    path('', mainapp.TemplateIndexView.as_view(), name='main'),
    path('register/', csrf_exempt(mainapp.RegisterUserView.as_view()), name='register'),
    path('login/', csrf_exempt(mainapp.LoginUserView.as_view()), name='login'),
    path('logout/', mainapp.LogoutUserView.as_view(), name='logout'),
    path('activate/<uidb64>/<token>/', mainapp.VerificationView.as_view(), name='activate'),
    path('validate-email/', csrf_exempt(mainapp.EmailValidationView.as_view()), name='validate-email'),
    path('create-ad/', mainapp.CreateViewAd.as_view(), name='create-ad'),
    path('ajax/load-subcategories/', mainapp.load_subcategories, name='ajax-load-subcategories'),
]

