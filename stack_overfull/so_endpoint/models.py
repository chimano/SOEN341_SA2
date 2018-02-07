from django.db import models

# Create your models here.
class Question(models.Model):
    question_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)