from django.db import models

# Create your models here.
class Question(models.Model):
    question = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)