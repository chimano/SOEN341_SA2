from rest_framework.renderers import JSONRenderer
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
            q = Question(question=question)
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
            print(limit)
            print(order)
            questions = Question.objects.all().order_by(modifier + 'date_created')[:limit].values()
            return JsonResponse({'question_list':list(questions)})
        else:

            question = Question.objects.get(id=id)
            serialized = QuestionSerializer(question).data
            return JsonResponse(serialized)