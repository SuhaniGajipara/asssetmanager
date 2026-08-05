import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coreinventory.settings')
django.setup()

from django.test import Client
from apps.users.models import PendingUser, User

def test_signup_otp():
    client = Client()
    target_email = "drashtichavda176@gmail.com"
    
    print("=== Testing Signup OTP ===")
    PendingUser.objects.filter(email=target_email).delete()
    User.objects.filter(email=target_email).delete()
    
    response = client.post('/api/users/signup/', {
        'username': 'testuser123',
        'email': target_email,
        'full_name': 'Test User',
        'mobile_number': '1234567890',
        'password': 'testpassword123',
        'role': 'Admin'
    })
    
    print(f"Signup Response Status: {response.status_code}")
    print(f"Signup Response Data: {response.json()}")

def test_forgot_password_otp():
    client = Client()
    target_email = "drashtichavda176@gmail.com"
    
    print("\n=== Testing Forgot Password OTP ===")
    
    user, created = User.objects.get_or_create(
        email=target_email,
        defaults={
            'username': 'drashtic',
            'full_name': 'Drashti Chavda',
            'mobile_number': '9876543210'
        }
    )
    if created:
        user.set_password('testpassword123')
        user.save()
    
    response = client.post('/api/users/forgot-password/', {
        'email': target_email
    })
    
    print(f"Forgot Password Response Status: {response.status_code}")
    print(f"Forgot Password Response Data: {response.json()}")

if __name__ == '__main__':
    test_signup_otp()
    test_forgot_password_otp()
