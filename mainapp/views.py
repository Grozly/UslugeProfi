import json
from django.contrib.auth.views import LogoutView
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView, UpdateView, ListView, DetailView
from django.views.generic.base import TemplateView, View
from django.forms import inlineformset_factory
from django.http import JsonResponse, HttpResponseRedirect
from validate_email import validate_email
from django.contrib import messages
from django.core.mail import EmailMessage
from authapp.models import UslugeUser, UslugeUserProfile
from django.utils.encoding import force_bytes, force_text
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


def get_json_announcement_data():
    context = Announcement.objects.all().order_by('-created_at')
    return JsonResponse({'data': context})


class TemplateVerifyView(TemplateView):

    template_name = 'mainapp/verify.html'


class TemplateIndexView(TemplateView):

    template_name = 'mainapp/index.html'

    def get_context_data(self, **kwargs):
        context = super(TemplateIndexView, self).get_context_data(**kwargs)
        context['announcements'] = Announcement.objects.all().order_by('-created_at')
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
                    return JsonResponse({'data': 'ok'}, status=200)
                return JsonResponse({'error': 'no service selected'}, status=400)
            return JsonResponse({'error': 'Not POST reqeust!'}, status=400)
        return JsonResponse({'error': 'Not AJAX reqeust!'}, status=400)


class AnnouncementListView(ListView):

    model = Announcement

    def get_queryset(self):
        return Announcement.objects.filter(user_id=self.request.user.id)


class FeaturedAnnouncementsListView(TemplateView):

    template_name = 'mainapp/featured_announcements.html'


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
                    form.initial['id'] = services[num].id
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


class ApiEditAdView(View):

    def post(self, request):
        if request.is_ajax():
            if request.method == "POST":
                data = request.POST
                idAd = request.POST.get('id')
                name = request.POST.get('name')
                description = request.POST.get('description')
                photo_announcement = request.POST.get('image')
                user_services = request.POST.get('options')
                parse_user_services = json.loads(user_services)
                object_announcement = get_object_or_404(Announcement, pk=idAd)
                form = EditAdModelForm(request.POST, instance=object_announcement)
                if form.is_valid():
                    announcement = form.save(commit=False)
                    announcement.user = request.user
                    announcement.save()
                if parse_user_services:
                    for item in parse_user_services:
                        service_object = get_object_or_404(UserService, pk=item['id'])
                        form_service = EditUserServiceModelForm(request.POST, instance=service_object)
                        checkbox_value = item['is_active']
                        select_price_object = SelectPrice.objects.only('id').get(id=item['select_price'])
                        select_currency_object = SelectCurrency.objects.only('id').get(id=item['select_currency'])
                        select_measurement_object = SelectMeasurement.objects.only('id'). \
                            get(id=item['select_measurement'])
                        if form_service.is_valid():
                            if 'fixed_price' in item:
                                fixed_price = float(item['fixed_price'].replace(',', '.'))
                                UserService.objects.filter(id=service_object.id).update(
                                                           select_price=select_price_object,
                                                           select_currency=select_currency_object,
                                                           select_measurement=select_measurement_object,
                                                           price_lower=fixed_price,
                                                           price_upper=0,
                                                           is_active=checkbox_value,)
                            elif 'upper_price' in item:
                                lower_price = float(item['lower_price'].replace(',', '.'))
                                upper_price = float(item['upper_price'].replace(',', '.'))
                                UserService.objects.filter(id=service_object.id).update(
                                                           select_price=select_price_object,
                                                           select_currency=select_currency_object,
                                                           select_measurement=select_measurement_object,
                                                           price_lower=lower_price,
                                                           price_upper=upper_price,
                                                           is_active=checkbox_value,)
                            else:
                                UserService.objects.filter(id=service_object.id).update(
                                                           select_price=select_price_object,
                                                           select_currency=select_currency_object,
                                                           select_measurement=select_measurement_object,
                                                           price_lower=0,
                                                           price_upper=0,
                                                           is_active=checkbox_value,)

                return JsonResponse({'data': data}, status=200)
            return JsonResponse({'error': 'Not POST reqeust!'}, status=400)
        return JsonResponse({'error': 'Not AJAX reqeust!'}, status=400)


class AnnouncementDetailView(DetailView):

    model = Announcement
    template_name = 'mainapp/components/detail_announcement.html'
    context_object_name = 'announcement'

    def get_context_data(self, **kwargs):
        announcement_id = Announcement.objects.only('id').get(id=self.kwargs['pk'])
        ser = UserService.objects.all()
        print(ser)
        context = super(AnnouncementDetailView, self).get_context_data(**kwargs)
        context['services'] = UserService.objects.filter(user_announcement_id=announcement_id)
        return context