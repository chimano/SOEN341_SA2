"""
This module handles all the logic for the backend
It provides a response to all the routed endpoint in the urls.py file
"""
import json

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count

from so_endpoint.serializers import (QuestionSerializer, AnswerSerializer,
                                     AccountSerializerPrivate, AccountSerializerPublic,
                                     TagViewSerializer, JobSerializer, JobAppSerializer)

from so_endpoint.models import Question, Answer, Tag, Job, JobApp


# Create your views here.

class QuestionView(TemplateView):
    """
    This view is designed to handle the /api/question/ endpoint.
    It's used to create questions through a POST request or to
    get a question with a GET request
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(QuestionView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            # Extracts question info from request
            json_data = json.loads(request.body)
            question_head = json_data['question_head']
            question_text = json_data['question_text']
            question_tags = json_data.get('tags', None)

            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User is not logged in'}, status=400)

            # Checks if question has a valid length
            if len(question_head) <= 1:
                return JsonResponse({'error': 'Question length is invalid'}, status=400)
            question = Question(question_head=question_head,
                                question_text=question_text, user_id=user)

            question.save()
            # question should exist in db since question.tags is required
            add_tags_to_question(question, question_tags)
            question.save()

            return JsonResponse({'id': question.id})

        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

    def get(self, request, *args, **kwargs):
        """
        Extracts GET request parameters
        """

        page = request.GET.get('page', 1)
        limit = request.GET.get('limit', 10)
        q_id = request.GET.get('id', None)
        order = request.GET.get('order', 'desc')
        sorted_by = request.GET.get('sort', 'points')
        tags = request.GET.getlist('tags[]', list())

        if q_id is None:
            # If q_id is not set then it returns a list of questions
            page = 1 if page is None else int(page)
            limit = 10 if limit is None else int(limit)
            order = "desc" if order is None else order
            modifier = '-' if order == 'desc' else ''

            questions = Question.objects.all()
            questions = filter_questions_by_tags(questions, tags)
            questions = questions.order_by(modifier + sorted_by)

            total_items = questions.count()
            paginated = paginate(questions, limit, page)
            serialized = QuestionSerializer(paginated, many=True).data

            response = {
                'question_list': serialized,
                'total_items': total_items,
                'page': page
            }

            return JsonResponse(response)

        # Returns a single question
        try:
            question = Question.objects.get(id=q_id)
        except Question.DoesNotExist:
            return JsonResponse({'error': 'Question does not exist'}, status=400)
        serialized = QuestionSerializer(question).data
        return JsonResponse(serialized)

    def put(self, request, *args, **kwargs):
        """
        This method is used in order to edit questions
        """
        # Extracts question info from request
        try:
            json_data = json.loads(request.body)
            question_id = json_data['q_id']
            question_head = json_data['question_head']
            question_text = json_data['question_text']

            question = Question.objects.get(id=question_id)

            if request.user != question.user_id:
                return JsonResponse({'error': 'This user cannot edit this question'},
                                    status=400)

            question.question_head = question_head
            question.question_text = question_text
            question.save()

            return JsonResponse({'id': question.id})

        except Question.DoesNotExist:
            return JsonResponse({'error': 'Question does not exist'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

    def delete(self, request, *args, **kwargs):
        """
        This method is used in order to delete questions
        """
        # Extracts question info from request
        try:
            json_data = json.loads(request.body)
            question_id = json_data['q_id']

            question = Question.objects.get(id=question_id)

            if request.user != question.user_id:
                return JsonResponse({'error': 'This user cannot delete this question'},
                                    status=400)

            question.delete()

            return JsonResponse({'success': 'Question has been deleted'})

        except Question.DoesNotExist:
            return JsonResponse({'error': 'Question does not exist'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)


class AnswerView(TemplateView):
    """
    This view is designed to handle the /api/answer/ endpoint.
    It's used to create answers through a POST request or to
    get a list of answers with a GET request
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(AnswerView, self).dispatch(request, *args, **kwargs)

    def post(self, request):

        try:
            # Extracts data from request
            json_data = json.loads(request.body)
            answer = json_data['answer']
            q_id = int(json_data['q_id'])

            # Checks if user is logged in
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User is not logged in'}, status=400)

            # Checks to see if the question that's getting answered exists
            try:
                question = Question.objects.get(id=q_id)
            except Question.DoesNotExist:
                return JsonResponse({'error': 'Question does not exist'}, status=400)

            # Checks to see if answer has valid length
            if len(answer) <= 1 or len(answer) > 1000:
                return JsonResponse({'error': 'Answer length is invalid'}, status=400)
            answer_db = Answer(question_id=question,
                               answer_text=answer, user_id=user)
            answer_db.save()

            return JsonResponse({'id': answer_db.id})

        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

    def get(self, request, *args, **kwargs):

        try:
            # Gets a list of answers from the question id
            limit = int(request.GET.get('limit', 10))
            order = request.GET.get('order', 'desc')
            q_id = request.GET.get('q_id', None)
            sorted_by = request.GET.get('sort', 'points')
            modifier = '-' if order == 'desc' else ''

            # Checks to see if question exists
            try:
                question = Question.objects.get(id=q_id)
            except Question.DoesNotExist:
                return JsonResponse({'error': 'Question does not exist'}, status=400)

            answers = Answer.objects.filter(question_id=question).order_by(
                modifier + sorted_by)[:limit]
            serialized = AnswerSerializer(answers, many=True).data
            return JsonResponse({'answer_list': serialized})
        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

    def put(self, request, *args, **kwargs):
        """
        This method is used in order to edit answers
        """
        # Extracts question info from request
        try:
            json_data = json.loads(request.body)
            answer_id = json_data['a_id']
            answer_text = json_data['answer_text']

            answer = Answer.objects.get(id=answer_id)

            if request.user != answer.user_id:
                return JsonResponse({'error': 'This user cannot edit this answer'},
                                    status=400)

            answer.answer_text = answer_text
            answer.save()

            return JsonResponse({'id': answer.id})

        except Answer.DoesNotExist:
            return JsonResponse({'error': 'Answer does not exist'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)

    def delete(self, request, *args, **kwargs):
        """
        This method is used in order to delete answers
        """
        # Extracts question info from request
        try:
            json_data = json.loads(request.body)
            answer_id = json_data['a_id']

            answer = Answer.objects.get(id=answer_id)

            if request.user != answer.user_id:
                return JsonResponse({'error': 'This user cannot delete this answer'},
                                    status=400)

            answer.delete()

            return JsonResponse({'success': 'Answer has been deleted'})

        except Answer.DoesNotExist:
            return JsonResponse({'error': 'Answer does not exist'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)
# Accept or undo accept an answer


class AnswerAcceptView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, answer_id):
        try:
            answer = Answer.objects.get(pk=answer_id)
            to_question = answer.question_id

        except ObjectDoesNotExist as error:  # nonexistent answer_id
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)

        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'}, status=400)

        if to_question.user_id != request.user:
            return JsonResponse({'error': 'User is not the author of the question'}, status=400)

        undo = True if to_question.accepted_answer_id == answer else False
        # if question.accepted_answer_id is not None and undo is False:
        #    return JSONResponse({'error': 'An answer to the question is alreay accepted'})

        if undo is True and to_question.accepted_answer_id != answer:
            return JsonResponse({'error': "Can't undo since the answer is not accepted"},
                                status=400)

        to_question.accepted_answer_id = None if undo else answer

        if answer in to_question.rejected_answers_ids.all():
            to_question.rejected_answers_ids.remove(answer)
        to_question.save()
        return JsonResponse(QuestionSerializer(to_question).data)


class AnswerRejectView(TemplateView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, answer_id):

        try:
            answer = Answer.objects.get(pk=answer_id)
            to_question = answer.question_id

        except ObjectDoesNotExist as error:  # nonexistent answer_id
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)

        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'}, status=400)

        if to_question.user_id != request.user:
            return JsonResponse({'error': 'User is not the author of the question'}, status=400)

        undo = True if answer in to_question.rejected_answers_ids.all() else False

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

    def get(self, request, *args, **kwargs):
        try:
            username = kwargs['username']
            user = User.objects.get(username=username)
            user_serialized = AccountSerializerPublic(user).data
            return JsonResponse(user_serialized)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)

# Return the list of users in the database


class UserView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):

        inname = request.GET.get('inname', '')
        limit = request.GET.get('limit', 10)
        order = request.GET.get('order', 'desc')
        sorted_by = request.GET.get('sort', 'date_joined')

        try:
            limit = int(limit)
            modifier = '-' if order == "desc" else ''

            users = User.objects.select_related('profile')
            users = users.filter(username__contains=inname)
            users = users.order_by(modifier+sorted_by)[:limit]
            users_list = AccountSerializerPublic(users, many=True).data

            return JsonResponse({'user_list': users_list})

        except BaseException as error:  # either TypeError or ValueError from query params
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)


# Return the currently logged in user
class UserMeView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
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
                user.last_name = json_body['last_name']

            if 'about_me' in json_body and json_body['about_me'] is not None:
                user.profile.about_me = json_body['about_me']

            if 'github' in json_body and json_body['github'] is not None:
                user.profile.github = json_body['github']

            if 'linkedin' in json_body and json_body['linkedin'] is not None:
                user.profile.linkedin = json_body['linkedin']

            user.save()
            user.profile.save()

            return JsonResponse(AccountSerializerPrivate(user).data)

        except BaseException as error:
            # json or user, user.profile or request body params don't match db
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)


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
            is_employer = raw_data.get('is_employer', False)

            email = raw_data.get('email', None)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)

            created_user = User.objects.create_user(
                username=username, password=password, email=email)

            created_user.profile.is_employer = is_employer
            created_user.profile.save()

            user = authenticate(request, username=username, password=password)
            login(request, user)

            return JsonResponse(AccountSerializerPrivate(user).data)

        except BaseException as error:  # either a json, key or user validation error
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)

# Log the user in


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

            return JsonResponse({'error': 'Wrong username/password'}, status=400)

        except BaseException as error:  # either a json or key error
            print(str(error))
            return JsonResponse({'error': repr(error)}, status=400)


# Log the user out
class UserLogoutView(TemplateView):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({'status': 'done'})

        return JsonResponse({'error': 'User is not logged in'}, status=400)


class AnswerVoteView(TemplateView):
    """
    This view is used to handle the /api/answer/vote/ endpoint.
    It is used to vote on a given answer through a post request
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            # Extracts information from request
            json_data = json.loads(request.body)
            a_id = json_data['a_id']

            # Checks to see if answer exists

            answer = Answer.objects.get(id=a_id)
            vote_type = json_data['vote_type']

            # Checks to see if user is logged in
            if request.user.is_authenticated:
                user = request.user
            else:
                return JsonResponse({'error': 'User is not logged in'}, status=400)

            if answer.user_id == user:
                return JsonResponse({'error': 'Cannot vote on your own answer'},
                                    status=400)

        except KeyError:
            return JsonResponse({'error': 'There was an error extracting the parameters'},
                                status=400)
        except Answer.DoesNotExist:
            return JsonResponse({'error': 'Answer id is not valid'}, status=400)

        if vote_type == "UP":
            # Checks to see if the user already upvoted for answer
            if answer in user.profile.upvoted_answers.all():
                user.profile.upvoted_answers.remove(answer)
                answer.points -= 1
                answer.user_id.profile.update_profile_reputation(-1)
                answer.save()
                return JsonResponse({'success': 'Reverted upvote',
                                     'points': answer.points}, status=200)

            # Checks to see if user has previously downvoted the answer
            if answer in user.profile.downvoted_answers.all():
                user.profile.downvoted_answers.remove(answer)
                answer.points += 1
                try:
                    answer.user_id.profile.update_profile_reputation(1)
                except AttributeError:
                    print("Answer has no user")

            user.profile.upvoted_answers.add(answer)
            answer.points += 1

            # Increments user's reputation,
            try:
                answer.user_id.profile.update_profile_reputation(1)
            except AttributeError:
                # It should never come to this section
                print("Answer has no user")
            answer.save()
            return JsonResponse({'success': 'Upvoted the answer',
                                 'points': answer.points}, status=200)

        else:
            # Checks to see if user has previously downvoted the answer
            if answer in user.profile.downvoted_answers.all():
                user.profile.downvoted_answers.remove(answer)
                answer.points += 1
                answer.user_id.profile.update_profile_reputation(1)
                answer.save()
                return JsonResponse({'success': 'Reverted upvote',
                                     'points': answer.points}, status=200)

            # Checks to see if user has previously upvoted the answer
            if answer in user.profile.upvoted_answers.all():
                user.profile.upvoted_answers.remove(answer)
                answer.points -= 1
                try:
                    answer.user_id.profile.update_profile_reputation(-1)
                except AttributeError:
                    print("Answer has no user")

            user.profile.downvoted_answers.add(answer)
            answer.points -= 1
            try:
                answer.user_id.profile.update_profile_reputation(-1)
            except AttributeError:
                print("Answer has no user")
            answer.save()
            return JsonResponse({'success': 'Downvoted the answer',
                                 'points': answer.points}, status=200)


class QuestionVoteView(TemplateView):
    """
    This view is used to handle the /api/question/vote/ endpoint.
    It is used to vote on a given question through a post request
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        # This method handles the question voting
        try:
            # Extracts parameters from requests
            json_data = json.loads(request.body)
            q_id = json_data['q_id']
            question = Question.objects.get(id=q_id)
            vote_type = json_data['vote_type']

            # Checks to see if user is logged in
            if request.user.is_authenticated:
                user = request.user
            else:
                return JsonResponse({'error': 'User is not logged in'}, status=400)

            if question.user_id == user:
                return JsonResponse({'error': 'Cannot vote on your own question'},
                                    status=400)
        except Question.DoesNotExist:
            return JsonResponse({'error': 'Question id is not valid'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'There was an error extracting the parameters'},
                                status=400)

        # Handles upvotes and downvotes same way as the AnswerVoteView does
        if vote_type == "UP":
            if question in user.profile.upvoted_questions.all():
                user.profile.upvoted_questions.remove(question)
                question.points -= 1
                question.user_id.profile.update_profile_reputation(-1)
                question.save()
                return JsonResponse({'success': 'Reverted upvote',
                                     'points': question.points}, status=200)

            if question in user.profile.downvoted_questions.all():
                user.profile.downvoted_questions.remove(question)
                question.points += 1
                try:
                    question.user_id.profile.update_profile_reputation(1)
                except AttributeError:
                    print("Question has no user")

            user.profile.upvoted_questions.add(question)
            question.points += 1
            try:
                question.user_id.profile.update_profile_reputation(1)
            except AttributeError:
                print("Question has no user")
            question.save()
            return JsonResponse({'success': 'Upvoted the question',
                                 'points': question.points}, status=200)

        else:

            if question in user.profile.downvoted_questions.all():
                user.profile.downvoted_questions.remove(question)
                question.points += 1
                question.user_id.profile.update_profile_reputation(1)
                question.save()
                return JsonResponse({'success': 'Reverted downvote',
                                     'points': question.points}, status=200)

            if question in user.profile.upvoted_questions.all():
                user.profile.upvoted_questions.remove(question)
                question.points -= 1
                try:
                    question.user_id.profile.update_profile_reputation(-1)
                except AttributeError:
                    print("Question has no user")

            user.profile.downvoted_questions.add(question)
            question.points -= 1
            try:
                question.user_id.profile.update_profile_reputation(-1)
            except AttributeError:
                print("Question has no user")
            question.save()
            return JsonResponse({'success': 'Downvoted the question',
                                 'points': question.points}, status=200)


class SearchView(TemplateView):
    """
    This view handles the /api/search/ endpoint
    It returns a list of questions matching a query and filters array
    The filters array can contain any of:
        ('head', 'text', 'username', 'tags',
         'answered', 'notanswered', 'accepted', 'notaccepted')
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        try:
            query = request.GET.get('q', '')
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 10)
            order = request.GET.get('order', 'desc')
            sorted_by = request.GET.get('sort', 'date_created')
            filters = request.GET.getlist('filters[]', list())

            page = int(page)
            limit = int(limit)
            modifier = '-' if order == "desc" else ''

            filters = list() if filters is None else filters

            # has_filters is true if any of the fitlers in filters[]
            # depends on the search query ('q') parameter
            if set(filters).intersection(['head', 'text', 'tags', 'username']):
                has_filters = True
            else:
                has_filters = False

            by_question_head = Question.objects.none()
            by_question_text = Question.objects.none()
            by_username = Question.objects.none()
            by_tags = Question.objects.none()

            # filter questions by case-insensitive matching with question_head
            if has_filters is False or 'head' in filters:
                by_question_head = Question.objects.filter(
                    question_head__icontains=query)

            # filter questions by case-insensitive matching with question_text
            if has_filters is False or 'text' in filters:
                by_question_text = Question.objects.filter(
                    question_text__icontains=query)

            # filter questions by case-insensitive matching with username
            if has_filters is False or 'username' in filters:
                by_username = Question.objects.filter(
                    user_id__username__icontains=query)

            # filter questions by case-insensitive matching with tags
            if has_filters is False or 'tags' in filters:
                by_tags = Question.objects.filter(
                    tags__tag_text__icontains=query)

            # find answered questions set
            # https://stackoverflow.com/questions/258296/django-models-how-to-filter-number-of-foreignkey-objects
            answered_set = Question.objects.all().annotate(
                answers_count=Count('answer')
            ).filter(answers_count__gt=0)

            # Get a new answered_set without the answers_count annotation
            answered_set = Question.objects.filter(pk__in=answered_set)

            # find accepted questions set
            accepted_set = Question.objects.all().filter(
                accepted_answer_id__isnull=False)

            matching_questions = by_question_head | by_question_text | by_username | by_tags
            matching_questions = matching_questions.distinct()  # remove duplicates

            if 'answered' in filters:
                matching_questions = matching_questions.intersection(
                    answered_set)
            elif 'notanswered' in filters:
                matching_questions = matching_questions.difference(
                    answered_set)

            if 'accepted' in filters:
                matching_questions = matching_questions.intersection(
                    accepted_set)
            elif 'notaccepted' in filters:
                matching_questions = matching_questions.difference(
                    accepted_set)

            matching_questions = matching_questions.order_by(
                modifier+sorted_by)

            total_items = matching_questions.count()
            paginated = paginate(matching_questions, limit, page)
            serialized = QuestionSerializer(paginated, many=True).data

            response = {
                'question_list': serialized,
                'total_items': total_items,
                'page': page
            }

            return JsonResponse(response)

        except BaseException as error:
            # either TypeError or ValueError from query params
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)


class TagView(TemplateView):
    """
    This view handles the /api/tag/ endpoint
    It returns a list of existing tags
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        inname = request.GET.get('inname', '')
        page = request.GET.get('page', 1)
        limit = request.GET.get('limit', 10)
        order = request.GET.get('order', 'desc')
        sorted_by = request.GET.get('sort', 'question_count')

        try:
            page = int(page)
            limit = int(limit)
            modifier = '-' if order == "desc" else ''

            tags_set = Tag.objects.all()
            tags_set = tags_set.filter(tag_text__icontains=inname)
            tags_set = tags_set.order_by(
                modifier+sorted_by)

            total_items = tags_set.count()
            paginated = paginate(tags_set, limit, page)
            tags_serialized = TagViewSerializer(paginated, many=True).data

            response = {
                'tag_list': tags_serialized,
                'total_items': total_items,
                'page': page
            }

            return JsonResponse(response)

        except BaseException as error:
            # either TypeError or ValueError from query params
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)


class TagViewName(TemplateView):
    """
    This view handles the /api/tag/<tagname> endpoint
    It returns a tag matching <tagname>
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        try:
            tagname = kwargs['tagname']
            tag = Tag.objects.get(tag_text=tagname)
            tag_serialized = TagViewSerializer(tag).data
            print(tag_serialized)
            return JsonResponse(tag_serialized)
        except Tag.DoesNotExist:
            return JsonResponse({'error': 'Tag does not exist'}, status=400)


class JobView(TemplateView):
    """
    This view handles the /api/job/ endpoint
    It returns a list of jobs
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        """
        Extracts GET request parameters
        """
        category = request.GET.get('category', 0)
        if category not in Job.CATEGORIES:
            return JsonResponse({'error': 'Invalid Category'}, status=400)
        # get list of job that are in the requested category
        job_list = Job.objects.filter(category=category)
        serialized = JobSerializer(job_list, many=True).data
        return JsonResponse({'job_list': serialized})

    def post(self, request):
        # Extracts job info from request
        try:
            json_data = json.loads(request.body)
            position = json_data['position']
            job_type = json_data['job_type']
            category = json_data['category']
            company = json_data['company']
            location = json_data['location']
            description = json_data['description']

            # Verify that category is right
            if category not in Job.CATEGORIES:
                raise ValueError

            # Verify that type is right
            if job_type not in Job.TYPES:
                raise ValueError
            # Verify that description has at least 50 characters
            if len(description) < 50:
                raise ValueError
            # Verify that length of other input to be bigger than 0

            if (len(position) < 1 or len(job_type) < 1
                    or len(category) < 1 or len(company) < 1
                    or len(location) < 1):
                raise ValueError

            if request.user.profile.is_employer:
                job = Job(position=position,
                          job_type=job_type,
                          category=category,
                          company=company,
                          location=location,
                          description=description,
                          posted_by=request.user)
                job.save()
                return JsonResponse({'success': 'You have successfully added a job to the database'})

            return JsonResponse({'error': 'This account is not an employer'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'There was an error parsing the request'}, status=400)
        except AttributeError:
            return JsonResponse({'error': 'User is not logged in'}, status=400)
        except ValueError:
            return JsonResponse({'error': 'One or more inputs are invalid'},
                                status=400)


class JobAppView(TemplateView):
    """
    This view handles the /api/job/ endpoint
    It returns a list of jobs
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        """
        Extracts GET request parameters
        """
        try:
            job_id = request.GET['job_id']
            job = Job.objects.get(job_id=job_id)

            if request.user != job.posted_by:
                return JsonResponse({'error': 'Cannot view postings of a job you did not post'},
                                    status=400)

            applications = JobApp.objects.filter(job_id=job)
            # get list of job that are in the requested category
            serialized_applications = JobAppSerializer(
                applications, many=True).data

            return JsonResponse({'application_list': serialized_applications})
        except Job.DoesNotExist:
            return JsonResponse({'error': 'Job does not exist'}, status=400)

    def post(self, request):
        """
        This handles the post request and creates a job application
        with it
        """
        # Extracts job application info from request
        try:
            json_data = json.loads(request.body)
            job_id = json_data['job_id']
            user = request.user
            if not user.is_authenticated:
                return JsonResponse({'error': 'User is not authenticated'}, status=400)

            if user.profile.is_employer:
                return JsonResponse({'error': 'Employers cannot apply to jobs'},
                                    status=400)

            job = Job.objects.get(job_id=job_id)
            JobApp.objects.get_or_create(job_id=job, user_id=user)
            return JsonResponse({'success': 'Application was successfully created'})
        except Job.DoesNotExist:
            return JsonResponse({'error': 'Job id is not valid'}, status=400)


class ProfileQuestionView(TemplateView):
    """
    This view handles the /api/user/name/<username>/questions/
    end point
    It is used to get a list of questions asked and answered by the user
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        try:
            username = kwargs['username']
            user = User.objects.get(username=username)
            asked_questions = Question.objects.filter(user_id=user)
            answered_questions = Question.objects.filter(answer__user_id=user)
            upvoted_questions = user.profile.upvoted_questions
            downvoted_questions = user.profile.downvoted_questions

            serialized_asked_questions = QuestionSerializer(
                asked_questions, many=True).data

            serialized_answered_questions = QuestionSerializer(
                answered_questions, many=True).data

            serialized_upvoted_questions = QuestionSerializer(
                upvoted_questions, many=True).data

            serialized_downvoted_questions = QuestionSerializer(
                downvoted_questions, many=True).data

            return JsonResponse({'asked_questions': serialized_asked_questions,
                                 'answered_questions': serialized_answered_questions,
                                 'upvoted_questions': serialized_upvoted_questions,
                                 'downvoted_questions': serialized_downvoted_questions})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'},
                                status=400)


def paginate(query_set, page_size, page):

    first_index = (page-1)*page_size
    last_index = (page-1)*page_size + page_size

    return query_set[first_index:last_index]


class ProfileJobView(TemplateView):
    """
    This view handles the /api/user/name/<username>/jobs/
    end point
    It is used to get a list of jobs posted by the user
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        try:
            username = kwargs['username']
            user = User.objects.get(username=username)
            posted_jobs = Job.objects.filter(posted_by=user)
            serialized_jobs = JobSerializer(posted_jobs, many=True).data
            return JsonResponse({'posted_positions': serialized_jobs})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'},
                                status=400)


def add_tags_to_question(question, tags_list):

    if not tags_list:
        return question

    # strip spaces and convert to lowercase
    tags_list = [tag.strip().lower() for tag in tags_list]

    for tag_text in tags_list:
        tag, _ = Tag.objects.get_or_create(tag_text=tag_text)

        tag.question_count += 1
        tag.save()

        question.tags.add(tag)

    return question


def filter_questions_by_tags(question_set, tags_list):

    if not tags_list:
        return question_set

    # strip spaces and convert to lowercase
    tags_list = [tag.strip().lower() for tag in tags_list]

    return question_set.filter(tags__in=tags_list)
