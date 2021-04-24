from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView
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

from .forms import CreateAdModelForm, CreateServiceAdModelForm
from .models import Announcement, SubCategory, Category, Service, SelectPrice, SelectCurrency, SelectMeasurement
from .utils import account_activation_token
from django.contrib import auth


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


class CreateViewServiceAd(CreateView):
    model = Service
    template_name = 'mainapp/announcement_form.html'
    form_class = CreateServiceAdModelForm

    def get_context_data(self, **kwargs):
        context_data = super(CreateViewServiceAd, self).get_context_data(**kwargs)
        context_data['service'] = Service.objects.all()
        context_data['select_price'] = SelectPrice.objects.all()
        context_data['select_currency'] = SelectCurrency.objects.all()
        context_data['select_measurement'] = SelectMeasurement.objects.all()
        return context_data

    def get_success_url(self):
        return reverse("auth:editprofile", args=(self.object.pk,))


def load_subcategories(request):
    category_id = request.GET.get('category')
    subcategory = SubCategory.objects.filter(category_id=category_id).order_by('name')
    return render(request, 'mainapp/announcement_form.html', {'subcategory': subcategory})


class ApiCreateViewAd(View):

    def get(self, request):
        return render(request, 'mainapp/announcement_form.html')

    def post(self, request):
        if request.method == "POST":
            form = CreateAdModelForm(request.POST, request.FILES, current_user=request.user)
            if form.is_valid():
                edited = Announcement.objects.filter(pk=request.user.pk)
                # edited.update(
                #     first_name=request.POST.get('first_name'),
                #     second_name=request.POST.get('second_name'),
                #     patronymic=request.POST.get('patronymic'),
                #     birth_date=request.POST.get('birth_date')
                # )
        else:
            form = CreateAdModelForm()
        form = CreateAdModelForm()
        return render(request, 'mainapp/announcement_form.html', context={'form': form})
        # form = CreateAdModelForm(request.POST or None, request.FILES or None, pk=request.user.pk)
        # print(form)
        # data = {}
        #
        # if request.is_ajax():
        #     if form.is_valid():
        #         print(form.data)
        #         form.save()
        #         data['name'] = form.cleaned_data.get('name')
        #         data['status'] = 'ok'
        #         return JsonResponse(data, status=200)
        #
        # return JsonResponse({}, status=200)





