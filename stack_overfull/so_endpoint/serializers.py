from rest_framework import serializers
from so_endpoint.models import Question, Answer, Profile, Tag
from django.contrib.auth.models import User

"""
This classes are used to serialize data to send them in a
JSON format
"""
class ProfileSerializerPrivate(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class AccountSerializerPrivate(serializers.ModelSerializer):
    profile = ProfileSerializerPrivate(read_only=True)
    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializerPublic(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('reputation', 'about_me')

class AccountSerializerPublic(serializers.ModelSerializer):
    profile = ProfileSerializerPublic(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'last_login', 'date_joined', 'profile')

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)

# A tag serializer used by the TagView
class TagViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    user_id = AccountSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'user_id', 'question_head', 'question_text', 'accepted_answer_id', 'rejected_answers_ids', 'date_created', 'points', 'tags')

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
