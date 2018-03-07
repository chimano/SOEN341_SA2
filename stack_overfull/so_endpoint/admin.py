from django.contrib import admin
from so_endpoint.models import *

# Register your models here.
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Profile)
admin.site.register(Tag)
