from rest_framework import serializers
from so_endpoint.models import Question, Answer
from django.contrib.auth.models import User
from django.forms.models import model_to_dict

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)

class QuestionSerializer(serializers.ModelSerializer):
    user_id = AccountSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'user_id', 'question_text', 'accepted_answer_id', 'rejected_answers_ids', 'date_created')

class AnswerSerializer(serializers.ModelSerializer):
    user_id = AccountSerializer(read_only=True)

    class Meta:
        model = Answer
        fields = ('id', 'user_id', 'answer_text', 'date_created')


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
