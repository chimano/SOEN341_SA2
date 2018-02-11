from rest_framework import serializers
from so_endpoint.models import Question
from django.forms.models import model_to_dict

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'question_text', 'date_created')


def user_to_dict(user, many=False, fields=None, exclude=None):
    if many is not True:
        user_dict = model_to_dict(user, fields=fields, exclude=exclude)

        # if user.profile exists attach it to the user_dict
        if hasattr(user, 'profile'):
            profile_dict = model_to_dict(user.profile)
            user_dict['profile'] = profile_dict

        return user_dict

    else: # many=True; user is an array of Users
        users_array = []
        for single in user:
            users_array.append(user_to_dict(single, fields=fields, exclude=exclude))
        return users_array
