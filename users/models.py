from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    # ... (existing fields)
    ROLE_CHOICES = (
        ('Inventory Manager', 'Inventory Manager'),
        ('Warehouse Staff', 'Warehouse Staff'),
    )
    full_name = models.CharField(max_length=255, blank=True)
    mobile_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Warehouse Staff')
    
    is_email_verified = models.BooleanField(default=False)
    is_mobile_verified = models.BooleanField(default=False)

    email_otp = models.CharField(max_length=6, blank=True, null=True)
    mobile_otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)
    reset_otp = models.CharField(max_length=6, blank=True, null=True)

    def is_otp_expired(self):
        if not self.otp_expiry:
            return True
        return timezone.now() > self.otp_expiry

    def __str__(self):
        return self.email or self.username

class PendingUser(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15, unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128) # Will store hashed password
    role = models.CharField(max_length=50, default='Warehouse Staff')
    
    otp = models.CharField(max_length=6)
    otp_expiry = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.otp_expiry

    def __str__(self):
        return self.email
