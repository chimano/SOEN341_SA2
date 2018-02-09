from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Question(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    question_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    answer_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)