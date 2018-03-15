from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.

class Job(models.Model):
    job_id = models.IntegerField(primary_key=True)
    position = models.CharField(max_length=48, null=False, default=None)
    TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Temporary', 'Trainee']
    job_type = models.CharField(max_length=48, null=False, default=None)
    CATEGORIES = ['Photography', 'Architechture', 'Music', 'Theatre', 'Receptionist',
        'Coordinator', 'Payroll Administrator', 'Sales Representative', 'Accountant',
        'Marketing', 'Computer Science', 'Software Engineering', 'Mechanical Engineering',
        'Electrical Engineering', 'Industrial Engineering', 'Tutor', 'Elementary School Teacher',
        'Highschool Teacher', 'Cegep Teacher', 'University Teacher', 'Biology', 'Chemistry',
        'Physics', 'Sociology', 'Geoscience']
    category = models.CharField(max_length=48, null=False, default=None)
    company = models.CharField(max_length=48, null=False, default=None)
    location = models.CharField(max_length=84, null=False, default=None)
    description = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    question_head = models.CharField(max_length=128, null=True, default=None)
    question_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    #https://stackoverflow.com/questions/2606194/django-error-message-add-a-related-name-argument-to-the-definition
    accepted_answer_id = models.OneToOneField('Answer', on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_answer_set')
    rejected_answers_ids = models.ManyToManyField('Answer', related_name='rejected_answers_set', blank=True)
    points = models.IntegerField(default=0)
    tags = models.ManyToManyField('Tag', related_name='question_set', blank=True)

class Answer(models.Model):
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    answer_text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    points = models.IntegerField(default=0)

#User Profile
#https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html
class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    about_me = models.TextField(default='Add something about yourself')
    reputation = models.IntegerField(default=0)

    upvoted_questions = models.ManyToManyField(Question, related_name='up_questions', blank=True)
    downvoted_questions = models.ManyToManyField(Question, related_name='down_questions', blank=True)
    upvoted_answers = models.ManyToManyField(Answer, related_name='up_answers', blank=True)
    downvoted_answers = models.ManyToManyField(Answer, related_name='down_answers', blank=True)

    def update_profile_reputation(self, delta):
        self.reputation += delta
        self.save()

    #Automaticly create a user profile when a user is created
    @receiver(post_save, sender=User)
    def create_user_profile(sender, **kwargs):
        user = kwargs["instance"]
        if kwargs["created"] is True:
            Profile.objects.create(user_id=user)

class Tag(models.Model):
    tag_text = models.CharField(max_length=128, primary_key=True)
    date_created = models.DateTimeField(auto_now=True)
