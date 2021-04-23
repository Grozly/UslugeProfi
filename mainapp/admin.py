from django.contrib import admin

from mainapp.models import Category, SubCategory, Announcement, Service, SelectMeasurement, SelectPrice, SelectCurrency

admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Service)
admin.site.register(Announcement)
admin.site.register(SelectPrice)
admin.site.register(SelectCurrency)
admin.site.register(SelectMeasurement)
