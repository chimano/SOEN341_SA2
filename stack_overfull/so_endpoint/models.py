from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class Question(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    question_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    #https://stackoverflow.com/questions/2606194/django-error-message-add-a-related-name-argument-to-the-definition
    accepted_answer_id = models.ForeignKey('Answer', on_delete=models.SET_NULL, null=True, related_name='accepted_answer_set')
    rejected_answers_ids = models.ManyToManyField('Answer', related_name='rejected_answers_set')

class Answer(models.Model):
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    answer_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)


#User Profile
#https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html
class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    about_me = models.TextField(default='Add something about yourself')
    reputation = models.IntegerField(default=0)

    def update_profile_reputation(self):
        pass

    #Automaticly create a user profile when a user is created
    @receiver(post_save, sender=User)
    def create_user_profile(sender, **kwargs):
        user = kwargs["instance"]
        if kwargs["created"] is True:
            Profile.objects.create(user_id=user)
