from rest_framework.renderers import JSONRenderer
from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseServerError, JsonResponse
from so_endpoint.serializers import *
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
            question_head = json_data['question_head']
            question_text = json_data['question_text']
            try:
                user = User.objects.get(username=request.user)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'User is not logged in'}, status=400)

            if len(question_head) <= 1:
                return JsonResponse({'error': 'Question length is invalid'}, status=400)
            q = Question(question_head=question_head, question_text=question_text, user_id=user)
            q.save()
            return JsonResponse({'id': q.id})

        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

    def get(self, request):
        limit = request.GET.get('limit', 10)
        q_id = request.GET.get('id', None)
        order = request.GET.get('order', 'desc')
        sorted_by = request.GET.get('sort', 'points')
        if q_id is None:
            limit = 10 if limit is None else int(limit)
            order = "desc" if order is None else order
            modifier = '-' if order == 'desc' else ''

            questions = Question.objects.all().order_by(modifier + sorted_by)[:limit]
            serialized = QuestionSerializer(questions, many=True).data
            return JsonResponse({'question_list':serialized})
        else:
            try:
                question = Question.objects.get(id=q_id)
            except:
                return JsonResponse({'error': 'Question does not exist'}, status=400)
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
                return JsonResponse({'error': 'User is not logged in'}, status=400)

            try:
                q = Question.objects.get(id=q_id)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Question does not exist'}, status=400)

            if len(answer) <= 1:
                return JsonResponse({'error': 'Answer length is invalid'}, status=400)
            a = Answer(question_id=q, answer_text=answer, user_id=user)
            a.save()

            return JsonResponse({'id': a.id})

        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

    def get(self, request):

        try:
            limit = int(request.GET.get('limit', 10))
            order = request.GET.get('order', 'desc')
            q_id = request.GET.get('q_id', None)
            sorted_by = request.GET.get('sort', 'points')
            modifier = '-' if order == 'desc' else ''
            try:
                q = Question.objects.get(id=q_id)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Question does not exist'}, status=400)

            answers = Answer.objects.filter(question_id=q_id).order_by(modifier + sorted_by)[:limit]
            serialized = AnswerSerializer(answers, many=True).data
            return JsonResponse({'answer_list':serialized})
        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

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
            return JsonResponse({'error': 'User is not authenticated'}, status=400)

        if to_question.user_id != request.user:
            return JsonResponse({'error': 'User is not the author of the question'}, status=400)

        #if question.accepted_answer_id is not None and undo is False:
        #    return JSONResponse({'error': 'An answer to the question is alreay accepted'})

        if undo is True and to_question.accepted_answer_id != answer:
            return JsonResponse({'error': "Can't undo since the answer is not accepted"}, status=400)

        to_question.accepted_answer_id = None if undo else answer

        if answer in to_question.rejected_answers_ids.all():
            to_question.rejected_answers_ids.remove(answer)
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
            return JsonResponse({'error': 'User is not authenticated'}, status=400)

        if to_question.user_id != request.user:
            return JsonResponse({'error': 'User is not the author of the question'}, status=400)

        if not undo:
            to_question.rejected_answers_ids.add(answer)
        else:
            to_question.rejected_answers_ids.remove(answer)

        if answer == to_question.accepted_answer_id:
            to_question.accepted_answer_id = None
        to_question.save()
        return JsonResponse(QuestionSerializer(to_question).data)

class UserNameView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            user_serialized = AccountSerializerPublic(user).data
            return JsonResponse(user_serialized)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)

# Return the list of users in the database
class UserView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):

        inname = request.GET.get('inname', '')
        limit = request.GET.get('limit', 10)
        order = request.GET.get('order', 'desc')
        sorted_by = request.GET.get('sort', 'date_joined')

        try:
            limit = int(limit)
            modifier = '-' if order == "desc" else ''

            users =  User.objects.select_related('profile')
            users = users.filter(username__contains=inname)
            users = users.order_by(modifier+sorted_by)[:limit]
            users_list = AccountSerializerPublic(users, many=True).data

            return JsonResponse({'user_list': users_list})

        except BaseException as e: # either TypeError or ValueError from query params
            print(repr(e))
            return JsonResponse({'error': repr(e)}, status=400)


# Return the currently logged in user
class UserMeView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):

        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User is not logged in'}, status=400)

        user = request.user
        return JsonResponse(AccountSerializerPrivate(user).data)

    # allow api requests to edit some of the user/me/ profile properties
    def post(self, request):

        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User is not logged in'}, status=400)

        user = request.user

        try:
            json_body = json.loads(request.body)

            if 'email' in json_body and json_body['email'] is not None:
                user.email = json_body['email']

            if 'first_name' in json_body and json_body['first_name'] is not None:
                user.first_name = json_body['first_name']

            if 'last_name' in json_body and json_body['last_name'] is not None:
                user.first_name = json_body['last_name']

            if 'about_me' in json_body and json_body['about_me'] is not None:
                user.profile.about_me = json_body['about_me']

            user.save()
            user.profile.save()

            return JsonResponse(AccountSerializerPrivate(user).data)

        except BaseException as e: # json or user, user.profile or request body params don't match db
            print(repr(e))
            return JsonResponse({'error': repr(e)}, status=400)


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
                return JsonResponse({'error': 'Username already exists'}, status=400)

            User.objects.create_user(username=username, password=password, email=email)
            user = authenticate(request, username=username, password=password)
            login(request, user)

            return JsonResponse(AccountSerializerPrivate(user).data)

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
                return JsonResponse(AccountSerializerPrivate(user).data)
            else:
                return JsonResponse({'error': 'Wrong username/password'}, status=400)


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
            return JsonResponse({'error': 'User is not logged in'}, status=400)


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
            return JsonResponse({'sucess': 'Upvoted the answer',
                                 'points': answer.points}, status=200)

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
            return JsonResponse({'sucess': 'Downvoted the answer',
                                 'points': answer.points}, status=200)


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

            if question in user.profile.downvoted_questions.all():
                user.profile.downvoted_questions.remove(question)
                question.points += 1
                try:
                    question.user_id.profile.update_profile_reputation(1)
                except:
                    print("Question has no user")

            user.profile.upvoted_questions.add(question)
            question.points += 1
            try:
                question.user_id.profile.update_profile_reputation(1)
            except:
                print("Question has no user")
            question.save()
            return JsonResponse({'sucess': 'Upvoted the question',
                                 'points': question.points},status=200)

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
            return JsonResponse({'sucess': 'Downvoted the question',
                                 'points': question.points},status=200)

class SearchView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        try :
            query = request.GET.get('q', '')
            limit = request.GET.get('limit', 10)
            order = request.GET.get('order', 'desc')
            sorted_by = request.GET.get('sort', 'date_created')

            limit = int(limit)
            modifier = '-' if order == "desc" else ''

            #filter questions by case-insensitive matching with question_text
            by_question_text = Question.objects.filter(question_text__icontains=query)

            #filter questions by case-insensitive matching with username
            by_username = Question.objects.filter(user_id__username__icontains=query)

            matching_questions = by_question_text | by_username

            matching_questions = matching_questions.order_by(modifier+sorted_by)[:limit]

            serialized = QuestionSerializer(matching_questions, many=True).data
            return JsonResponse({'question_list': serialized})

        except BaseException as e: # either TypeError or ValueError from query params
            print(repr(e))
            return JsonResponse({'error': repr(e)}, status=400)
