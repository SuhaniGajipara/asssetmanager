from django.contrib import admin
from .models import User, PendingUser

admin.site.register(User)
admin.site.register(PendingUser)
