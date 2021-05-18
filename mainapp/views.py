from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView, UpdateView, ListView, DetailView
from django.views.generic.base import TemplateView, View
import json
import ast
from django.forms import inlineformset_factory
from django.http import JsonResponse, HttpResponseRedirect
from validate_email import validate_email
from django.contrib import messages
from django.core.mail import EmailMessage
from authapp.models import UslugeUser, UslugeUserProfile
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse, reverse_lazy
from .forms import CreateAdModelForm, EditAdModelForm, EditUserServiceModelForm
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

    def get_context_data(self, **kwargs):
        context = super(TemplateIndexView, self).get_context_data(**kwargs)
        return context


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
            print('valid email 1')
            if not UslugeUser.objects.filter(email=email).exists():
                print('valid email 2')

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


class ApiCreateAdView(View):

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

    def post(self, request):
        if request.is_ajax():
            if request.method == "POST":
                user_id = UslugeUser.objects.only('id').get(id=request.POST.get('user_id'))
                category_id = Category.objects.only('id').get(id=request.POST.get('categoty'))
                subcategory_id = SubCategory.objects.only('id').get(id=request.POST.get('subcategory'))
                user_services = request.POST.get('options')
                parse_user_services = json.loads(user_services)
                name = request.POST.get('name')
                description = request.POST.get('description')
                photo_announcement = request.FILES.get('image')
                address = request.POST.get('address')
                if len(parse_user_services) >= 1:
                    object_announcement = Announcement.objects.create(user_id=user_id,
                                                                      category_id=category_id,
                                                                      subcategory_id=subcategory_id,
                                                                      name=name,
                                                                      description=description,
                                                                      photo_announcement=photo_announcement,
                                                                      address=address,
                                                                      is_active=True)
                    object_announcement.save()
                    for item in parse_user_services:
                        service_object = Service.objects.only('id').get(id=item['id'])
                        select_price_object = SelectPrice.objects.only('id').get(id=item['select_price'])
                        select_currency_object = SelectCurrency.objects.only('id').get(id=item['select_currency'])
                        select_measurement_object = SelectMeasurement.objects.only('id'). \
                            get(id=item['select_measurement'])
                        if 'fixed_price' in item:
                            object_service = UserService.objects.create(service_id=service_object,
                                                                        user_id=user_id,
                                                                        select_price=select_price_object,
                                                                        select_currency=select_currency_object,
                                                                        select_measurement=select_measurement_object,
                                                                        user_announcement_id=object_announcement,
                                                                        name=item['name'],
                                                                        price_lower=item['fixed_price'],
                                                                        price_upper=0,
                                                                        is_active=True)
                            object_service.save()
                        elif 'upper_price' in item:
                            object_service = UserService.objects.create(service_id=service_object,
                                                                        user_id=user_id,
                                                                        select_price=select_price_object,
                                                                        select_currency=select_currency_object,
                                                                        select_measurement=select_measurement_object,
                                                                        user_announcement_id=object_announcement,
                                                                        name=item['name'],
                                                                        price_lower=item['lower_price'],
                                                                        price_upper=item['upper_price'],
                                                                        is_active=True)
                            object_service.save()
                        else:
                            object_service = UserService.objects.create(service_id=service_object,
                                                                        user_id=user_id,
                                                                        select_price=select_price_object,
                                                                        select_currency=select_currency_object,
                                                                        select_measurement=select_measurement_object,
                                                                        user_announcement_id=object_announcement,
                                                                        name=item['name'],
                                                                        price_lower=0,
                                                                        price_upper=0,
                                                                        is_active=True)
                            object_service.save()
                    return HttpResponseRedirect(reverse('main:main'))
                return JsonResponse({'error': 'no service selected'}, status=400)
            return JsonResponse({'error': 'Not POST reqeust!'}, status=400)
        return JsonResponse({'error': 'Not AJAX reqeust!'}, status=400)


class AnnouncementListView(ListView):

    model = Announcement

    def get_queryset(self):
        return Announcement.objects.filter(user_id=self.request.user.id)


class UpdateAnnouncementView(UpdateView):

    model = Announcement
    template_name = "mainapp/announcement_update_form.html"
    form_class = EditAdModelForm
    is_update_view = True
    success_url = reverse_lazy('mainapp:announcements')


    def get_context_data(self, **kwargs):
        context = super(UpdateAnnouncementView, self).get_context_data(**kwargs)
        this_announcement = Announcement.objects.get(id=self.kwargs['pk'])
        announcement_formset = inlineformset_factory(Announcement, UserService, form=EditUserServiceModelForm, extra=1)
        if self.request.POST:
            formset = announcement_formset(self.request.POST)
        else:
            services = UserService.get_services_in_announcement(self.request.resolver_match.kwargs['pk'])
            if len(services):
                announcement_formset = inlineformset_factory(Announcement, UserService, form=EditUserServiceModelForm,
                                                             extra=len(services))
                formset = announcement_formset()
                for num, form in enumerate(formset.forms):
                    form.initial['is_active'] = services[num].is_active
                    form.initial['name'] = services[num].name
                    form.initial['select_price'] = services[num].select_price
                    form.initial['price_lower'] = services[num].price_lower
                    form.initial['price_upper'] = services[num].price_upper
                    form.initial['select_currency'] = services[num].select_currency
                    form.initial['select_measurement'] = services[num].select_measurement
            else:
                formset = announcement_formset()

        context['user_services'] = formset
        context['announcement'] = Announcement.objects.get(id=self.kwargs['pk'])
        context['category'] = Category.objects.get(id=this_announcement.category_id.id)
        context['subcategory'] = SubCategory.objects.get(id=this_announcement.subcategory_id.id)
        return context


# class UpdateAnnouncementView(UpdateView):
#     model = Announcement
#     template_name = "mainapp/announcement_update_form.html"
#     form_class = EditAdModelForm
#     second_form_class = EditUserServiceModelForm
#     is_update_view = True
#
#     def get_form_class(self):
#         """Return the form class to use."""
#         return self.form_class
#
#     def get_second_form_class(self):
#         """Return the form class to use."""
#         return self.second_form_class
#
#     def get_form(self, form_class=None, second_form_class=None):
#         """Return an instance of the form to be used in this view."""
#         if form_class is None:
#             form_class = self.get_form_class()
#         if second_form_class is None:
#             second_form_class = self.get_second_form_class()
#         print(form_class, second_form_class)
#         return [form_class(**self.get_form_kwargs()), second_form_class(**self.get_form_kwargs())]
#
#     def get_context_data(self, **kwargs):
#         """Insert the form into the context dict."""
#         if 'form' not in kwargs:
#             kwargs['form'] = self.get_form()
#         if 'form2' not in kwargs:
#             kwargs['form2'] = self.get_form()
#         return super().get_context_data(**kwargs)


# class UpdateViewAd(UpdateView):
#     model = Announcement
#     template_name = "mainapp/announcement_update_form.html"
#     is_update_view = True
#
#     def get_form(self, form_class=None):
#         self.request = self.request.user.pk
#
#     def get_context_data(self, pk, **kwargs):
#         context = super(UpdateViewAd, self).get_context_data(**kwargs)
#         context['second_model'] = UserService
#         context['form_ad'] = UpdateAdModelForm()
#         context['form_service'] = UpdateServiceAdModelForm()
#         context['announcement'] = Announcement.objects.filter(user_id=request.user.id)
#         context['user_service'] = UserService.objects.filter(user_announcement_id=request.announcement.pk)
#         context['category'] = Category.objects.all()
#         context['subcategory'] = SubCategory.objects.all()
#         return context


# class UpdateViewAd(View):
#
#     def get(self, request, pk):
#         form_ad = UpdateAdModelForm()
#         form_service = UpdateServiceAdModelForm()
#         category = Category.objects.all()
#         subcategory = SubCategory.objects.all()
#         announcement = Announcement.objects.filter(user_id=request.user.id)
#         print(announcement)
#         for item in announcement:
#             print(item)
#             print(item.id)
#             user_services = UserService.objects.filter(user_announcement_id=item.id)
#         context = {
#             'form_ad': form_ad,
#             'form_service': form_service,
#             'category': category,
#             'subcategory': subcategory,
#             'user_service': user_services,
#             'announcement': announcement
#         }
#         return render(request, 'mainapp/announcement_update_form.html', context)