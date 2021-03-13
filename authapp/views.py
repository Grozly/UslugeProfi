from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.views.generic import TemplateView, UpdateView
from django.views.generic.edit import FormMixin

from authapp.forms import EditProfileModelForm
from authapp.models import UslugeUserProfile, UslugeUser


class TemplateIndexView(TemplateView):

    template_name = "authapp/index.html"

    def get_context_data(self, pk, **kwargs):
        context = super(TemplateIndexView, self).get_context_data(**kwargs)
        # here's the difference:
        context['uslugeuserprofile'] = UslugeUserProfile.objects.get(pk=pk)
        return context


class UpdateUserProfileView(UpdateView):
    model = UslugeUserProfile
    template_name = "authapp/uslugeprofile_update_form.html"
    form_class = EditProfileModelForm
    is_update_view = True

    def get_success_url(self):
        return reverse("auth:editprofile", args=(self.object.pk,))

    # def get_context_data(self, **kwargs):
    #     context = super(UpdateUserProfileView, self).get_context_data(**kwargs)
    #     context['form'] = EditProfileModelForm
    #     context['pass'] = PasswordChangeForm
    #     return context


class PasswordChangeUserProfileView(PasswordChangeView):
    template_name = "authapp/uslugeprofile_update_form.html"
    # success_url = reverse_lazy("auth:editprofile")
    prefix = 'pass'

    def get_success_url(self):
        return reverse("auth:editprofile", args=(self.object.pk,))


    # def get_success_url(self):
    #     return reverse("auth:editprofile", args=(self.object.pk,))



