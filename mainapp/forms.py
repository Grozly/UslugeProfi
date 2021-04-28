from django import forms
from authapp.models import UslugeUser
from mainapp.models import Announcement, Service


class CreateAdModelForm(forms.ModelForm):

    class Meta:
        model = Announcement
        fields = '__all__'

    def __init__(self, current_user, *args, **kwargs):
        user = UslugeUser.objects.get(email=current_user)
        user_pk = user.pk
        super(CreateAdModelForm, self).__init__(*args, **kwargs)
        self.fields['user_id'].initial = user_pk
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form_input'
            field.help_text = ''
            field.label = ''

        self.fields['user_id'].widget.attrs.update({'value': user_pk,
                                                    'type': 'hidden'})
        self.fields['category_id'].widget.attrs.update({'placeholder': 'Категория'})
        self.fields['subcategory_id'].widget.attrs.update({'placeholder': 'Подкатегория'})
        self.fields['user_service_id'].widget.attrs.update({'placeholder': 'Услуга'})
        self.fields['name'].widget.attrs.update({'placeholder': 'Название'})
        self.fields['description'].widget.attrs.update({'placeholder': 'Описание'})
        self.fields['photo_announcement'].widget = forms.FileInput(attrs={
            'class': 'form_input'
        })
        self.fields['address'].widget.attrs.update({'placeholder': 'Адрес'})


# class CreateServiceAdModelForm(forms.ModelForm):
#     class Meta:
#         model = Service
#         fields = ['isActiveService',
#                   'name',
#                   'select_price',
#                   'price_from',
#                   'price_up_to',
#                   'select_currency',
#                   'select_measurement']
#
#         def __init__(self, *args, **kwargs):
#             super().__init__(*args, **kwargs)
#             for field_name, field in self.fields.items():
#                 field.widget.attrs['class'] = 'ads_input'
#                 field.help_text = ''
#                 field.label = ''
