from django import forms
from django.forms import ModelForm

from authapp.models import UslugeUserProfile


class EditProfileModelForm(forms.ModelForm):
    class Meta:
        model = UslugeUserProfile
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form_input'
            field.help_text = ''
            field.label = ''

        self.fields['user_profile'].widget.attrs.update({'value': UslugeUserProfile.user_profile, 'type': 'hidden'})
        self.fields['status_profile'].widget.attrs.update({'placeholder': 'Статус'})
        self.fields['name_profile'].widget.attrs.update({'placeholder': 'Имя'})
        self.fields['surname_profile'].widget.attrs.update({'placeholder': 'Фамилия'})
        self.fields['companyname_profile'].widget.attrs.update({'placeholder': 'Название компании'})
        self.fields['ogrn_profile'].widget.attrs.update({'placeholder': 'ОГРН'})
        self.fields['inn_profile'].widget.attrs.update({'placeholder': 'ИНН'})
        self.fields['phone_profile'].widget.attrs.update({'placeholder': 'Номер телефона'})
        self.fields['photo_profile'].widget = forms.FileInput(attrs={
            'class': 'form_input'
        })
        self.fields['address_profile'].widget.attrs.update({'placeholder': 'Адрес'})
        self.fields['country_profile'].widget.attrs.update({'placeholder': 'Страна'})