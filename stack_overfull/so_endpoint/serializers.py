from rest_framework import serializers
from so_endpoint.models import Question, Answer
from django.contrib.auth.models import User


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)

class QuestionSerializer(serializers.ModelSerializer):
    user_id = AccountSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'user_id', 'question_text', 'date_created')

class AnswerSerializer(serializers.ModelSerializer):
    user_id = AccountSerializer(read_only=True)

    class Meta:
        model = Answer
        fields = ('id', 'user_id', 'answer_text', 'date_created')

