"""
This module handles signals that get generated with
database interactions
"""

from so_endpoint.models import Profile


def create_user_profile(sender, **kwargs):
    """
    Automaticly create a user profile when a user is created
    """
    user = kwargs["instance"]
    if kwargs["created"] is True:
        Profile.objects.create(user_id=user)
