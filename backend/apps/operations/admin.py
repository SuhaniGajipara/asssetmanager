from django.contrib import admin
from .models import Receipt, Delivery, Transfer, Adjustment

admin.site.register(Receipt)
admin.site.register(Delivery)
admin.site.register(Transfer)
admin.site.register(Adjustment)
