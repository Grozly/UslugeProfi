from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView, UpdateView
from django.views.generic.base import TemplateView, View
import json
from django.http import JsonResponse, HttpResponseRedirect
from validate_email import validate_email
from django.contrib import messages
from django.core.mail import EmailMessage
from authapp.models import UslugeUser, UslugeUserProfile
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse, reverse_lazy

from .forms import CreateAdModelForm
from .models import Announcement, SubCategory, Category, Service, SelectPrice, SelectCurrency, SelectMeasurement, \
    UserService
from .utils import account_activation_token
from django.contrib import auth


def get_json_category_data(request):
    category_val = list(Category.objects.values())
    return JsonResponse({'data': category_val})


def get_json_subcategory_data(request, *args, **kwargs):
    selected_category = kwargs.get('pk')
    object_subcategory = list(SubCategory.objects.filter(category_id=selected_category).values())
    return JsonResponse({'data': object_subcategory})


def get_json_service_data(request, *args, **kwargs):
    selected_subcategory = kwargs.get('pk')
    object_service = list(Service.objects.filter(subcategory_id=selected_subcategory).values())
    return JsonResponse({'data': object_service})


class TemplateVerifyView(TemplateView):

    template_name = 'mainapp/verify.html'


class TemplateIndexView(TemplateView):

    template_name = 'mainapp/index.html'


class EmailValidationView(View):

    def post(self, request):
        data = json.loads(request.body)
        email = data['email']

        if not validate_email(email):
            return JsonResponse({'email_error': 'E-mail введен некорректно'}, status=400)
        if UslugeUser.objects.filter(email=email).exists():
            return JsonResponse({'email_error': 'Такой E-mail уже зарегистрирован'}, status=400)
        return JsonResponse({'email_valid': True}, status=200)


class RegisterUserView(View):

    def get(self, request):
        return render(request, 'mainapp/index.html')

    def post(self, request):
        data = json.loads(request.body)
        email = data['email']
        password1 = data['password1']
        password2 = data['password2']
        is_agree = data['is_agree']
        is_over18 = data['is_over18']
        print(email, password1, password2, is_agree, is_over18)
        if validate_email(email):
            if not UslugeUser.objects.filter(email=email).exists():

                user = UslugeUser.objects.create_user(email=email, is_agree=is_agree, is_over18=is_over18)
                user.set_password(password1)
                user.is_active = False
                user.save()

                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

                domain = get_current_site(request).domain
                link = reverse('main:activate', kwargs={'uidb64':uidb64, 'token': account_activation_token.make_token(user)})
                activate_url = 'http://' + domain + link

                email_subject = 'Активация аккаунта'
                email_body = 'Здравствуйте, ' + user.email + \
                             ' пожалуйста перейдите по ссылке для активации Вашего аккаунта\n' + activate_url
                email = EmailMessage(
                    email_subject,
                    email_body,
                    'uslugeprofiloc@gmail.com',
                    [email],
                )
                email.send(fail_silently=False)

                return render(request, 'mainapp/index.html')
        return render(request, 'mainapp/index.html')


class VerificationView(View):
    def get(self, request, uidb64, token):
        try:
            id = force_text(urlsafe_base64_decode(uidb64))
            user = UslugeUser.objects.get(pk=id)

            if not account_activation_token.check_token(user, token):
                return redirect('main:main'+'?message'+'User activated')

            if user.is_active:
                return redirect('main:main')
            user.is_active = True
            user.save()
            auth.login(request, user)

            messages.success(request, 'Аккаунт активирован')
            return redirect('main:main')

        except Exception as ex:
            pass

        return redirect('main:main')


class LoginUserView(View):

    def get(self, request):
        return render(request, 'mainapp/index.html')

    def post(self, request):
        data = json.loads(request.body)
        email = data['email']
        password = data['password']
        remember = data['remember']
        if not validate_email(email):
            return JsonResponse({'email_error': 'E-mail введен некорректно'}, status=400)
        if UslugeUser.objects.filter(email=email).exists():
            user = auth.authenticate(email=email, password=password)
            if user and user.is_active:
                auth.login(request, user)
                if not remember:
                    request.session.set_expiry(0)
                    return HttpResponseRedirect(reverse('main:main'))
                return HttpResponseRedirect(reverse('main:main'))
            return JsonResponse({'email_error': 'Такой пользователь не зарегистрирован'}, status=400)


class LogoutUserView(LogoutView):

    template_name = 'mainapp/index.html'


class CreateViewAd(View):

    def get(self, request, pk):
        form = CreateAdModelForm(current_user=request.user)
        category = Category.objects.all()
        subcategory = SubCategory.objects.all()
        service = Service.objects.all()
        context = {
            'form': form,
            'category': category,
            'subcategory': subcategory,
            'service': service,
        }
        return render(request, 'mainapp/announcement_form.html', context)


class ApiCreateViewAd(View):

    def get(self, request):
        return render(request, 'mainapp/announcement_form.html')

    def post(self, request):

        if request.is_ajax():
            if request.method == "POST":
                data = request.POST
                for value in data.values():
                    print(value)
                return JsonResponse({'data': data}, status=200)
            return JsonResponse({'error': 'Not POST reqeust!'}, status=400)


class UpdateViewAd(View):

    def get(self, request, pk):
        form = CreateAdModelForm(current_user=request.user)
        category = Category.objects.all()
        subcategory = SubCategory.objects.all()
        user_service = UserService.objects.all()
        context = {
            'form': form,
            'category': category,
            'subcategory': subcategory,
            'user_service': user_service,
        }
        return render(request, 'mainapp/announcement_update_form.html', context)