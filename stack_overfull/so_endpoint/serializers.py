"""
These classes are used to serialize data to send them in a
JSON format
"""
from django.contrib.auth.models import User

from rest_framework import serializers
from so_endpoint.models import Question, Answer, Profile, Tag, Job, JobApp


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
        fields = ('reputation', 'about_me', 'github', 'linkedin')


class AccountSerializerPublic(serializers.ModelSerializer):
    profile = ProfileSerializerPublic(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name',
                  'email', 'last_login', 'date_joined', 'profile')


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
    answer_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'user_id', 'question_head', 'question_text',
                  'accepted_answer_id', 'rejected_answers_ids', 'date_created',
                  'answer_count', 'points', 'tags')

    def get_answer_count(self, question):
        return len(question.answer_set.all())


class AnswerSerializer(serializers.ModelSerializer):
    user_id = AccountSerializer(read_only=True)
    is_accepted = serializers.SerializerMethodField(read_only=True)
    is_rejected = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Answer
        fields = ('id', 'user_id', 'answer_text', 'date_created',
                  'points', 'is_accepted', 'is_rejected')

    def get_is_accepted(self, answer):

        return answer == answer.question_id.accepted_answer_id

    def get_is_rejected(self, answer):

        return answer in answer.question_id.rejected_answers_ids.all()


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = ('job_id', 'position', 'job_type', 'category',
                  'company', 'location', 'description', 'date_posted')


class JobAppSerializer(serializers.ModelSerializer):
    user_id = AccountSerializerPublic(read_only=True)

    class Meta:
        model = JobApp
        fields = ('id', 'job_id', 'user_id')
