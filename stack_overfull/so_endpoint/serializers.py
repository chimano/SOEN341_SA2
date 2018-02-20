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
        fields = ('id', 'user_id', 'question_text', 'accepted_answer_id', 'rejected_answers_ids', 'date_created', 'points')

class AnswerSerializer(serializers.ModelSerializer):
    user_id = AccountSerializer(read_only=True)
    is_accepted = serializers.SerializerMethodField(read_only=True)
    is_rejected = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Answer
        fields = ('id', 'user_id', 'answer_text', 'date_created', 'points', 'is_accepted', 'is_rejected')

    def get_is_accepted(self, answer):
        try: return answer == answer.question_id.accepted_answer_id
        except: return False

    def get_is_rejected(self, answer):
        try: return answer in answer.question_id.rejected_answers_ids.all()
        except: return False


def user_to_dict(user, many=False, fields=None, exclude=None):
    if many is not True:
        user_dict = model_to_dict(user, fields=fields, exclude=exclude)
        # if user.profile exists attach it to the user_dict
        if hasattr(user, 'profile'):
            profile_dict = model_to_dict(user.profile)
            for i, q in enumerate(profile_dict['upvoted_questions']):
                profile_dict['upvoted_questions'][i] = profile_dict['upvoted_questions'][i].id
            for i, q in enumerate(profile_dict['downvoted_questions']):
                profile_dict['downvoted_questions'][i] = profile_dict['downvoted_questions'][i].id
            for i, q in enumerate(profile_dict['upvoted_answers']):
                profile_dict['upvoted_answers'][i] = profile_dict['upvoted_answers'][i].id
            for i, q in enumerate(profile_dict['downvoted_answers']):
                profile_dict['downvoted_answers'][i] = profile_dict['downvoted_answers'][i].id

            user_dict['profile'] = profile_dict
        return user_dict

    else: # many=True; user is an array of Users
        users_array = []
        for single in user:
            users_array.append(user_to_dict(single, fields=fields, exclude=exclude))
        return users_array
