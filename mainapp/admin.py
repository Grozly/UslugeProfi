from django.contrib import admin

from mainapp.models import Category, SubCategory, Announcement, Service

admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Service)
admin.site.register(Announcement)
