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
from django.urls import re_path
from so_endpoint.views import (QuestionView, QuestionVoteView, AnswerView,
                               AnswerVoteView, AnswerAcceptView, AnswerRejectView,
                               UserLoginView, UserRegisterView, UserLogoutView,
                               UserView, UserMeView, UserNameView, ProfileQuestionView,
                               SearchView, TagView, TagViewName, JobView,
                               JobAppView, ProfileJobView)

urlpatterns = [
    re_path(r'^question/$', QuestionView.as_view()),
    re_path(r'^question/vote/$', QuestionVoteView.as_view()),
    re_path(r'^answer/$', AnswerView.as_view()),
    re_path(r'^answer/vote/$', AnswerVoteView.as_view()),

    re_path(r'^answer/(?P<answer_id>\d+)/accept/$',
            AnswerAcceptView.as_view()),
    re_path(r'^answer/(?P<answer_id>\d+)/reject/$',
            AnswerRejectView.as_view()),

    re_path(r'^user/register/$', UserRegisterView.as_view()),
    re_path(r'^user/login/$', UserLoginView.as_view()),
    re_path(r'^user/logout/$', UserLogoutView.as_view()),
    re_path(r'^user/me/$', UserMeView.as_view()),
    re_path(r'^user/$', UserView.as_view()),

    # Get a specific user by username ex. api/user/name/TestUser/
    # Usernames may contain alphanumeric, _, @, +, . and - characters.
    re_path(
        r'^user/name/(?P<username>[\w_@\+\.\-]+)/$', UserNameView.as_view()),
    re_path(
        r'^user/name/(?P<username>[\w_@\+\.\-]+)/questions/$', ProfileQuestionView.as_view()),
    re_path(
        r'^user/name/(?P<username>[\w_@\+\.\-]+)/jobs/$', ProfileJobView.as_view()),
    re_path(r'^search/$', SearchView.as_view()),
    re_path(r'^tag/$', TagView.as_view()),
    re_path(r'^tag/name/(?P<tagname>\w+)/$', TagViewName.as_view()),
    re_path(r'^job/$', JobView.as_view()),
    re_path(r'^job/application/$', JobAppView.as_view()),
]
