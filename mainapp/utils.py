from django.contrib.auth.tokens import PasswordResetTokenGenerator
from six import text_type


class AppTokenGenerator(PasswordResetTokenGenerator):

    def __make_hash_value(self, user, timestap):
        return (text_type(user.is_active) + text_type(user.pk) + text_type(timestap))


account_activation_token = AppTokenGenerator()