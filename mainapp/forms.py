from django import forms
from django.forms import ModelForm

from authapp.models import UslugeUser, UslugeUserProfile
from mainapp.models import Announcement, SubCategory


class CreateAdModelForm(forms.ModelForm):
    class Meta:
        model = Announcement
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['subcategory_id'].queyset = SubCategory.objects.none()
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
        self.fields['price_select'].widget.attrs.update({'placeholder': 'Цена'})
        self.fields['price_from'].widget.attrs.update({'placeholder': '0.00'})
        self.fields['price_up_to'].widget.attrs.update({'placeholder': '0.00'})
        self.fields['currency_select'].widget.attrs.update({'placeholder': 'Валюта'})
        self.fields['measurement_selection'].widget.attrs.update({'placeholder': 'Единица измерения'})
        self.fields['photo_announcement'].widget = forms.FileInput(attrs={
            'class': 'form_input'
        })
        self.fields['address'].widget.attrs.update({'placeholder': 'Адрес'})
