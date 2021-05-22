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

        self.fields['user_id'].widget.attrs.update({
            'value': user_pk,
            'type': 'hidden'
        })
        self.fields['name'].widget.attrs.update({
            'placeholder': 'Название',
            'class': 'form_input ad_name_input'
        })
        self.fields['description'].widget.attrs.update({
            'placeholder': 'Описание',
            'class': 'form_input ad_description_input'
        })
        self.fields['photo_announcement'].widget = forms.FileInput(attrs={
            'class': 'form_input ad_photo_announcement_input'
        })
        self.fields['category_id'].widget.attrs.update({
            'placeholder': 'Категория',
            'class': 'form_input ad_category_input'
        })
        self.fields['subcategory_id'].widget.attrs.update({
            'placeholder': 'Подкатегория',
            'class': 'form_input ad_subcategory_input'
        })
        self.fields['address'].widget.attrs.update({
            'placeholder': 'Адрес',
            'class': 'form_input ad_address_input'
        })


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

        self.fields['name'].widget.attrs.update({
            'style': 'width: 100%; margin-top: 30px;',
            'placeholder': 'Название'
        })
        self.fields['description'].widget.attrs.update({
            'style': 'width: 100%; margin-top: 30px;',
            'placeholder': 'Описание'
        })
        self.fields['photo_announcement'].widget = forms.FileInput(attrs={
            'class': 'ads_input'
        })


class EditUserServiceModelForm(forms.ModelForm):
    class Meta:
        model = UserService
        fields = ('id',
                  'is_active',
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
        self.fields['select_price'].empty_label = None
        self.fields['select_price'].widget.attrs.update({
            'class': 'new_ad_price_category select_price'
        })
        self.fields['price_lower'].widget.attrs.update({
            'placeholder': 'Цена от',
            'class': 'ads_input ads_input_lower',
            'type': 'text',
            'step': 1
        })
        self.fields['price_upper'].widget.attrs.update({
            'placeholder': 'Цена до',
            'class': 'ads_input ads_input_upper',
            'type': 'text',
            'step': 1
        })
        self.fields['select_currency'].empty_label = None
        self.fields['select_currency'].widget.attrs.update({
            'class': 'ads_input select_currency'
        })
        self.fields['select_measurement'].empty_label = None
        self.fields['select_measurement'].widget.attrs.update({
            'class': 'select_measurement'
        })



