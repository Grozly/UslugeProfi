from django import forms
from django.forms import ModelForm

from authapp.models import UslugeUser, UslugeUserProfile
from mainapp.models import Announcement, SubCategory, Service


class CreateAdModelForm(forms.ModelForm):
    class Meta:
        model = Announcement
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form_input'
            field.help_text = ''
            field.label = ''

        self.fields['user_id'].widget.attrs.update({'value': UslugeUserProfile.user_profile})
        self.fields['user_id'].widget.attrs.update({'type': 'hidden'})
        self.fields['category_id'].widget.attrs.update({'placeholder': 'Категория'})
        self.fields['subcategory_id'].widget.attrs.update({'placeholder': 'Подкатегория'})
        self.fields['name'].widget.attrs.update({'placeholder': 'Название'})
        self.fields['description'].widget.attrs.update({'placeholder': 'Описание'})
        self.fields['photo_announcement'].widget = forms.FileInput(attrs={
            'class': 'form_input'
        })
        self.fields['address'].widget.attrs.update({'placeholder': 'Адрес'})


class CreateServiceAdModelForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['isActiveService',
                  'name',
                  'select_price',
                  'price_from',
                  'price_up_to',
                  'select_currency',
                  'select_measurement']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            for field_name, field in self.fields.items():
                field.widget.attrs['class'] = 'ads_input'
                field.help_text = ''
                field.label = ''
