from django.apps import AppConfig
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from so_endpoint.models import Profile
from so_endpoint.signals import create_user_profile


class SoEndpointConfig(AppConfig):
    name = 'so_endpoint'

    def ready(self):
        post_save.connect(create_user_profile, sender=User)
