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
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('so_endpoint.urls')),
    path('', TemplateView.as_view(template_name='templates/index.html')),
    path('question/<id>', TemplateView.as_view(template_name='templates/index.html')),
    path('search/', TemplateView.as_view(template_name='templates/index.html')),
    path('profile/', TemplateView.as_view(template_name='templates/index.html')),
    path('careers/', TemplateView.as_view(template_name='templates/index.html')),
    path('tags/<tags>', TemplateView.as_view(template_name='templates/index.html')),
    path('categories/', TemplateView.as_view(template_name='templates/index.html')),
    path('user/<id>', TemplateView.as_view(template_name='templates/index.html'))
]
