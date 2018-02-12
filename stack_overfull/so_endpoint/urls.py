"""stack_overfull URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from so_endpoint.views import QuestionView, AnswerView, AnswerAcceptView, AnswerRejectView
from so_endpoint.views import UserRegisterView, UserLoginView, UserLogoutView, UserMeView, UserView

urlpatterns = [
    re_path(r'question/$', QuestionView.as_view()),
    re_path(r'answer/$', AnswerView.as_view()),
    re_path(r'answer/q_id=(?P<q_id>\d+)/(?:order=(?P<order>\D+)/)?(?:limit=(?P<limit>\d+)/)?$', AnswerView.as_view()),
    re_path(r'answer/q_id=(?P<q_id>\d+)/(?:limit=(?P<limit>\d+)/)?(?:order=(?P<order>\D+)/)?$', AnswerView.as_view()),

    re_path(r'answer/(?P<answer_id>\d+)/accept/$', AnswerAcceptView.as_view() ),
    re_path(r'answer/(?P<answer_id>\d+)/accept/undo/$', AnswerAcceptView.as_view(), {'undo':True} ),
    re_path(r'answer/(?P<answer_id>\d+)/reject/$', AnswerRejectView.as_view() ),
    re_path(r'answer/(?P<answer_id>\d+)/reject/undo/$', AnswerRejectView.as_view(), {'undo':True} ),

    re_path(r'user/register/$', UserRegisterView.as_view()),
    re_path(r'user/login/$', UserLoginView.as_view()),
    re_path(r'user/logout/$', UserLogoutView.as_view()),
    re_path(r'user/me/$', UserMeView.as_view()),
    re_path(r'user/$', UserView.as_view()),
]
