from django.db import models


class Category(models.Model):
    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'

    name = models.CharField(verbose_name='имя', max_length=64, unique=True)
    is_active = models.BooleanField(verbose_name='активна', default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    class Meta:
        verbose_name = 'подкатегория'
        verbose_name_plural = 'подкатегории'

    category_id = models.ForeignKey('Category', on_delete=models.CASCADE)
    name = models.CharField(verbose_name='имя', max_length=64, unique=True)
    is_active = models.BooleanField(verbose_name='активна', default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class SelectPrice(models.Model):
    class Meta:
        verbose_name = 'Цена'
        verbose_name_plural = 'Цен'

    price_name = models.CharField(verbose_name='цена', max_length=64, unique=True)

    def __str__(self):
        return self.price_name


class SelectCurrency(models.Model):
    class Meta:
        verbose_name = 'Валюта'
        verbose_name_plural = 'Валюты'

    currency_name = models.CharField(verbose_name='валюта', max_length=64, unique=True)

    def __str__(self):
        return self.currency_name


class SelectMeasurement(models.Model):
    class Meta:
        verbose_name = 'Измерение'
        verbose_name_plural = 'Измерения'

    measurement_name = models.CharField(verbose_name='измерение', max_length=64, unique=True)

    def __str__(self):
        return self.measurement_name


class Service(models.Model):
    class Meta:
        verbose_name = 'услуга'
        verbose_name_plural = 'услуги'

    category_id = models.ForeignKey(
        'Category',
        verbose_name='категория',
        on_delete=models.CASCADE)
    subcategory_id = models.ForeignKey(
        'SubCategory',
        verbose_name='подкатегория',
        on_delete=models.CASCADE)
    select_currency = models.ForeignKey(
        'SelectCurrency',
        verbose_name='валюта',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING)
    select_measurement = models.ForeignKey(
        'SelectMeasurement',
        verbose_name='измерение',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING)
    select_price = models.ForeignKey(
        'SelectPrice',
        verbose_name='цена',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING)
    name = models.CharField(verbose_name='имя', max_length=64, unique=False)
    isActiveService = models.BooleanField(default=False)
    price_from = models.DecimalField(max_digits=8, decimal_places=2, default=0.00, blank=True)
    price_up_to = models.DecimalField(max_digits=8, decimal_places=2, default=0.00, blank=True)
    is_active = models.BooleanField(verbose_name='активна', default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Announcement(models.Model):
    class Meta:
        verbose_name = 'объявление'
        verbose_name_plural = 'объявления'

    user_id = models.ForeignKey('authapp.UslugeUser', verbose_name='автор', on_delete=models.CASCADE)
    category_id = models.ForeignKey('Category', verbose_name='категория', on_delete=models.CASCADE)
    subcategory_id = models.ForeignKey('SubCategory', verbose_name='подкатегория', on_delete=models.CASCADE)
    service_id = models.ForeignKey('Service', verbose_name='услуга', on_delete=models.CASCADE)
    name = models.CharField(max_length=64, verbose_name='имя')
    description = models.TextField(verbose_name='описание', blank=True)
    photo_announcement = models.ImageField(upload_to='photos_announcement',
                                      blank=True,
                                      verbose_name='фото',
                                      default='photo_announcement/default.png')
    address = models.CharField(max_length=80, verbose_name='Адрес', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name