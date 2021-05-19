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
    path('place-ad/<pk>/', mainapp.ApiCreateAdView.as_view(), name='place-ad'),
    path('create-ad/', csrf_exempt(mainapp.ApiCreateAdView.as_view()), name='create-ad'),
    path('announcements/', mainapp.AnnouncementListView.as_view(), name='announcements'),
    path('edit-announcement/<pk>/', mainapp.UpdateAnnouncementView.as_view(), name='edit-announcement'),
    path('featured-announcements/', mainapp.FeaturedAnnouncementsListView.as_view(), name='featured-announcements'),
    path('ajax/category-val/', mainapp.get_json_category_data, name='ajax-category-val'),
    path('ajax/subcategory-val/<pk>/', mainapp.get_json_subcategory_data, name='ajax-subcategory-val'),
    path('ajax/service-val/<pk>/', mainapp.get_json_service_data, name='ajax-service-val'),
]

