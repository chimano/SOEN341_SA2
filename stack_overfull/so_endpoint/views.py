from rest_framework.renderers import JSONRenderer
from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseServerError, JsonResponse
from so_endpoint.serializers import QuestionSerializer, AnswerSerializer, user_to_dict
from so_endpoint.models import *
import json

from django.contrib.auth import authenticate, login, logout

# Create your views here.
class QuestionView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(QuestionView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            json_data = json.loads(request.body)
            question = json_data['question']

            try:
                user = User.objects.get(username=request.user)
            except ObjectDoesNotExist:
                user = None

            if len(question) <= 1:
                return HttpResponseServerError()
            q = Question(question_text=question, user_id=user)
            q.save()
            return JsonResponse({'id': q.id})

        except KeyError:
            return HttpResponseServerError()

    def get(self, request):
        limit = request.GET.get('limit', 10)
        q_id = request.GET.get('id', None)
        order = request.GET.get('order', 'desc')
        sorted_by = request.GET.get('sort', 'points')
        if q_id is None:

            limit = 10 if limit is None else int(limit)
            order = "desc" if order is None else order

            if order == "desc":
                modifier = '-'
            else:
                modifier = ''

            questions = Question.objects.all().order_by(modifier + sorted_by)[:limit]
            serialized = QuestionSerializer(questions, many=True).data
            return JsonResponse({'question_list':serialized})
        else:
            try:
                question = Question.objects.get(id=q_id)
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
            json_data = json.loads(request.body)
            answer = json_data['answer']
            q_id = int(json_data['q_id'])

            try:
                user = User.objects.get(username=request.user)
            except ObjectDoesNotExist:
                user = None

            try:
                q = Question.objects.get(id=q_id)
            except ObjectDoesNotExist:
                return HttpResponseServerError()

            if len(answer) <= 1:
                return HttpResponseServerError()
            a = Answer(question_id=q, answer_text=answer, user_id=user)
            a.save()

            return JsonResponse({'id': a.id})

        except KeyError:
            return HttpResponseServerError()

    def get(self, request):

        limit = int(request.GET.get('limit', 10))
        order = request.GET.get('order', 'desc')
        q_id = request.GET.get('q_id', None)
        sorted_by = request.GET.get('sort', 'points')

        if order == "desc":
            modifier = '-'
        else:
            modifier = ''
        try:
            q = Question.objects.get(id=q_id)
        except ObjectDoesNotExist:
            return HttpResponseServerError()

        answers = Answer.objects.filter(question_id=q_id).order_by(modifier + sorted_by)[:limit]
        serialized = AnswerSerializer(answers, many=True).data
        return JsonResponse({'answer_list':serialized})

#Accept or undo accept an answer
class AnswerAcceptView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, answer_id, undo=False):

        try:
            answer = Answer.objects.get(pk=answer_id)
            to_question = answer.question_id

        except ObjectDoesNotExist as e: # nonexistent answer_id
            print(repr(e))
            return JsonResponse({'error': repr(e)}, status=400)

        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'})

        if to_question.user_id != request.user:
            return JsonResponse({'error': 'User is not the author of the question'})

        #if question.accepted_answer_id is not None and undo is False:
        #    return JSONResponse({'error': 'An answer to the question is alreay accepted'})

        if undo is True and to_question.accepted_answer_id != answer:
            return JsonResponse({'error': "Can't undo since the answer is not accepted"})

        to_question.accepted_answer_id = None if undo else answer
        to_question.save()
        return JsonResponse(QuestionSerializer(to_question).data)

class AnswerRejectView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, answer_id, undo=False):

        try:
            answer = Answer.objects.get(pk=answer_id)
            to_question = answer.question_id

        except ObjectDoesNotExist as e: # nonexistent answer_id
            print(repr(e))
            return JsonResponse({'error': repr(e)}, status=400)

        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'})

        if to_question.user_id != request.user:
            return JsonResponse({'error': 'User is not the author of the question'})

        if not undo:
            to_question.rejected_answers_ids.add(answer)
        else:
            to_question.rejected_answers_ids.remove(answer)

        to_question.save()
        return JsonResponse(QuestionSerializer(to_question).data)


# Return the list of users in the database
class UserView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        users =  User.objects.select_related('profile')
        users_array = user_to_dict(
            users,
            many=True,
            fields=['id', 'username', 'date_joined', 'is_active']
        )
        return JsonResponse(users_array, safe=False)

# Return the currently logged in user
class UserMeView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        if request.user.is_authenticated:
            user = request.user
            return JsonResponse(user_to_dict(user))
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
            username = raw_data['username']
            password = raw_data['password']
            email = raw_data.get('email', None)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'})

            User.objects.create_user(username=username, password=password, email=email)
            user = authenticate(request, username=username, password=password)
            login(request, user)

            return JsonResponse(user_to_dict(user))

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
            username = raw_data['username']
            password = raw_data['password']

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse(user_to_dict(user))
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


class AnswerVoteView(TemplateView):

    @method_decorator(csrf_exempt)  
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            json_data = json.loads(request.body)
            a_id = json_data['a_id']
            try:
                answer = Answer.objects.get(id=a_id)
            except Answer.DoesNotExist:
                return JsonResponse({'error': 'Answer id is not valid'}, status=400)

            vote_type = json_data['vote_type']
            
            if request.user.is_authenticated:
                user = request.user
            else:
                return JsonResponse({'error': 'User is not logged in'}, status=400)

        except:
            return JsonResponse({'error': 'There was an error extracting the parameters'}, status=400)

        if vote_type == "UP":
            if answer in user.profile.upvoted_answers.all():
                return JsonResponse({'error': 'User has already voted for this answer'}, status=400)

            if answer in user.profile.downvoted_answers.all():
                user.profile.downvoted_answers.remove(answer)
                answer.points += 1
                try:
                    answer.user_id.profile.update_profile_reputation(1)
                except:
                    print("Answer has no user")

            user.profile.upvoted_answers.add(answer)
            answer.points += 1
            try:
                answer.user_id.profile.update_profile_reputation(1)
            except:
                print("Answer has no user")
            answer.save()
            return JsonResponse({'sucess': 'Upvoted the answer'}, status=200)

        elif vote_type == "DOWN":

            if answer in user.profile.downvoted_answers.all():
                return JsonResponse({'error': 'User has already voted for this answer'}, status=400)

            if answer in user.profile.upvoted_answers.all():
                user.profile.upvoted_answers.remove(answer)
                answer.points -= 1
                try:
                    answer.user_id.profile.update_profile_reputation(-1)
                except:
                    print("Answer has no user")

            user.profile.downvoted_answers.add(answer)
            answer.points -= 1
            try:
                answer.user_id.profile.update_profile_reputation(-1)
            except:
                print("Answer has no user")
            answer.save()
            return JsonResponse({'sucess': 'Downvoted the answer'}, status=200)


class QuestionVoteView(TemplateView):

    @method_decorator(csrf_exempt)  
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            json_data = json.loads(request.body)
            q_id = json_data['q_id']
            try:
                question = Question.objects.get(id=q_id)
            except Question.DoesNotExist:
                return JsonResponse({'error': 'Question id is not valid'}, status=400)

            vote_type = json_data['vote_type']
            
            if request.user.is_authenticated:
                user = request.user
            else:
                return JsonResponse({'error': 'User is not logged in'}, status=400)

        except:
            return JsonResponse({'error': 'There was an error extracting the parameters'}, status=400)

        if vote_type == "UP":
            if question in user.profile.upvoted_questions.all():
                return JsonResponse({'error': 'User has already voted for this question'}, status=400)
            print("test1")
            if question in user.profile.downvoted_questions.all():
                user.profile.downvoted_questions.remove(question)
                question.points += 1
                try:
                    question.user_id.profile.update_profile_reputation(1)
                except:
                    print("Question has no user")
            print("test2")
            user.profile.upvoted_questions.add(question)
            question.points += 1
            try:
                question.user_id.profile.update_profile_reputation(1)
            except:
                print("Question has no user")
            question.save()
            return JsonResponse({'sucess': 'Upvoted the question'},status=200)

        elif vote_type == "DOWN":

            if question in user.profile.downvoted_questions.all():
                return JsonResponse({'error': 'User has already voted for this question'},status=400)

            if question in user.profile.upvoted_questions.all():
                user.profile.upvoted_questions.remove(question)
                question.points -= 1
                try:
                    question.user_id.profile.update_profile_reputation(-1)
                except:
                    print("Question has no user")

            user.profile.downvoted_questions.add(question)
            question.points -= 1
            try:
                question.user_id.profile.update_profile_reputation(-1)
            except:
                print("Question has no user")
            question.save()
            return JsonResponse({'sucess': 'Downvoted the question'},status=200)