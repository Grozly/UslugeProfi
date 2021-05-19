from django import forms
from authapp.models import UslugeUser
from mainapp.models import Announcement, Service, UserService


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
        self.fields['name'].widget.attrs.update({'class': 'ad_name form_input', 'placeholder': 'Название'})
        self.fields['description'].widget.attrs.update({'class': 'form_input ad_description', 'placeholder': 'Описание'})
        self.fields['photo_announcement'].widget = forms.FileInput(attrs={
            'class': 'form_input ad_photo_announcement'
        })
        self.fields['address'].widget.attrs.update({'class': 'form_input ad_address', 'placeholder': 'Адрес'})


# class CreateUserServiceModelForm(forms.ModelForm):
#     class Meta:
#         model = UserService
#         fields = ('is_active',
#                   'name',
#                   'select_price',
#                   'price_lower',
#                   'price_upper',
#                   'select_currency',
#                   'select_measurement')
#
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#
#         self.fields['is_active'].widget.attrs['class'] = 'subcat_checkbox'
#         self.fields['name'].widget.attrs.update({'class': 'form_input ad_name', 'placeholder': 'Название'})
#         self.fields['price_lower'].widget.attrs['class'] = 'ads_input'
#         self.fields['price_upper'].widget.attrs['class'] = 'ads_input'
#         self.fields['price_lower'].widget.attrs.update({'placeholder': 'Цена от'})
#         self.fields['price_upper'].widget.attrs.update({'placeholder': 'Цена до'})


class EditAdModelForm(forms.ModelForm):
    class Meta:
        model = Announcement
        fields = ('name', 'description', 'photo_announcement')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'ads_input'
            field.help_text = ''
            field.label = ''

        self.fields['name'].widget.attrs.update({'style': 'width: 100%; margin-top: 30px;',
                                                 'placeholder': 'Название'})
        self.fields['description'].widget.attrs.update({'style': 'width: 100%; margin-top: 30px;',
                                                        'placeholder': 'Описание'})
        self.fields['photo_announcement'].widget = forms.FileInput(attrs={
            'class': 'ads_input'
        })


class EditUserServiceModelForm(forms.ModelForm):
    class Meta:
        model = UserService
        fields = ('is_active',
                  'name',
                  'select_price',
                  'price_lower',
                  'price_upper',
                  'select_currency',
                  'select_measurement')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['is_active'].widget.attrs['class'] = 'subcat_checkbox'
        self.fields['name'].widget.attrs['type'] = 'text'
        self.fields['price_lower'].widget.attrs['class'] = 'ads_input'
        self.fields['price_upper'].widget.attrs['class'] = 'ads_input'
        self.fields['price_lower'].widget.attrs.update({'placeholder': 'Цена от'})
        self.fields['price_upper'].widget.attrs.update({'placeholder': 'Цена до'})