from rest_framework.renderers import JSONRenderer
from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseServerError, JsonResponse
from so_endpoint.serializers import QuestionSerializer
from so_endpoint.models import *
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.forms.models import model_to_dict

# Create your views here.
class QuestionView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(QuestionView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            question = request.POST['question']
            if len(question) <= 1:
                return HttpResponseServerError()
            q = Question(question_text=question)
            q.save()
            return JsonResponse({'id': q.id})

        except KeyError:
            return HttpResponseServerError()

    def get(self, request, id=None, order=None, limit=None):
        if id is None:

            limit = 10 if limit is None else int(limit)
            order = "desc" if order is None else order

            if order == "desc":
                modifier = '-'
            else:
                modifier = ''

            questions = Question.objects.all().order_by(modifier + 'date_created')[:limit].values()
            return JsonResponse({'question_list':list(questions)})
        else:
            try:
                question = Question.objects.get(id=id)
            except:
                return HttpResponseServerError()
            serialized = QuestionSerializer(question).data
            return JsonResponse(serialized)


class AnswerView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(AnswerView, self).dispatch(request, *args, **kwargs)

    def post(self, request, id=None):

        try:
            answer = request.POST['answer']
            q_id = int(request.POST['q_id'])

            try:
                q = Question.objects.get(id=q_id)
            except ObjectDoesNotExist:
                return HttpResponseServerError()

            if len(answer) <= 1:
                return HttpResponseServerError()
            a = Answer(question_id=q, answer_text=answer)
            a.save()

            return JsonResponse({'id': a.id})

        except KeyError:
            return HttpResponseServerError()

    def get(self, request, q_id=None, order=None, limit=None):

        limit = 10 if limit is None else int(limit)
        order = "desc" if order is None else order

        if order == "desc":
            modifier = '-'
        else:
            modifier = ''
        try:
            q = Question.objects.get(id=q_id)
        except ObjectDoesNotExist:
            return HttpResponseServerError()

        answers = Answer.objects.filter(question_id=q).order_by(modifier + 'date_created')[:limit].values()
        return JsonResponse({'answer_list':list(answers)})


# Return the list of users in the database
class UserView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        users_vals =  User.objects.all().values(
            'id', 'username', 'date_joined', 'is_active'
        )
        return JsonResponse(list(users_vals), safe=False)

# Return the currently logged in user
class UserMeView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        if request.user.is_authenticated:
            user = request.user
            return JsonResponse(model_to_dict(user))
        else:
            return JsonResponse({'error': 'User is not logged in'})

# Register a new user and log him in
class UserRegisterView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        # expected Content-Type: application/json
        # expected Json Body: {'username':'myname', password:'mypassword'}
        try:
            raw_data = json.loads(request.body)
            username = raw_data.get('username')
            password = raw_data.get('password')

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'})

            User.objects.create_user(username=username, password=password)
            user = authenticate(request, username=username, password=password)
            login(request, user)

            return JsonResponse(model_to_dict(user))

        except BaseException as e: #either a json, key or user validation error
            print(repr(e))
            return JsonResponse({'error': repr(e)}, status=400)

#Log the user in
class UserLoginView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        # expected Content-Type: application/json
        # expected Json Body: {'username':'myname', password:'mypassword'}
        try:
            raw_data = json.loads(request.body)
            username = raw_data.get('username')
            password = raw_data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse(model_to_dict(user))
            else:
                return JsonResponse({'error': 'Wrong username/password'})


        except BaseException as e: #either a json or key error
            print(str(e))
            return JsonResponse({'error': repr(e)}, status=400)


# Log the user out
class UserLogoutView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({'status':'done'})
        else:
            return JsonResponse({'error': 'User is not logged in'})
