from datetime import timedelta
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.utils.timezone import now


class UslugeUserManager(BaseUserManager):

    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class UslugeUser(AbstractUser):
    username = None
    email = models.EmailField(_('email'), unique=True, max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    is_agree = models.BooleanField(default=False)
    is_over18 = models.BooleanField(default=False)

    objects = UslugeUserManager()


class UslugeUserProfile(models.Model):

    class Meta:
        verbose_name = 'профиль'
        verbose_name_plural = 'профили'

    IP = 'IP'
    OOO = 'OOO'
    PF = 'PF'
    STATUS = (
        (IP, 'ИП'),
        (OOO, 'ООО'),
        (PF, 'Физ. лицо'),
    )
    user_profile = models.OneToOneField(UslugeUser, unique=True, null=False, db_index=True, on_delete=models.CASCADE)
    status_profile = models.CharField(max_length=3, choices=STATUS, default=PF)
    name_profile = models.CharField(max_length=64, verbose_name='Имя', blank=True)
    surname_profile = models.CharField(max_length=64, verbose_name='Фамилия', blank=True)
    companyname_profile = models.CharField(max_length=64, verbose_name='Название компании', blank=True)
    ogrn_profile = models.CharField(verbose_name='ОГРН', max_length=64, blank=True)
    inn_profile = models.CharField(verbose_name='ИНН', max_length=64, blank=True)
    phone_profile = PhoneNumberField(blank=True)
    photo_profile = models.ImageField(upload_to='photos_profiles',
                                      blank=True,
                                      verbose_name='Фото',
                                      default='photos_profiles/default.jpg')
    address_profile = models.CharField(max_length=80, verbose_name='Адресс', blank=True)
    country_profile = models.CharField(max_length=32, verbose_name='Страна', blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.is_authenticated = None

    @receiver(post_save, sender=UslugeUser)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            UslugeUserProfile.objects.create(user_profile=instance)

    @receiver(post_save, sender=UslugeUser)
    def save_user_profile(sender, instance, **kwargs):
        instance.uslugeuserprofile.save()

    def __str__(self):
        return self.user_profile
