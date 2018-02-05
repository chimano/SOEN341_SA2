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
