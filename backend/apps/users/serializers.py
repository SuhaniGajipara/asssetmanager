from rest_framework import serializers
from django.contrib.auth import get_user_model
import random
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'mobile_number', 'role', 'is_email_verified', 'is_mobile_verified')

from .models import PendingUser
from django.contrib.auth.hashers import make_password

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = PendingUser
        fields = ('username', 'email', 'full_name', 'mobile_number', 'password', 'confirm_password', 'role')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        # Check if email is already provided in another PERMANENT account
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
            
        # Check if mobile_number is already provided in another PERMANENT account
        if data.get('mobile_number') and User.objects.filter(mobile_number=data['mobile_number']).exists():
            raise serializers.ValidationError({"mobile_number": "Mobile number already registered."})

        # Check if username is already taken in another PERMANENT account
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already taken."})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        # Hash password before storage in PendingUser
        hashed_password = make_password(password)
        
        email = validated_data.get('email')
        mobile = validated_data.get('mobile_number')
        
        # Delete any existing pending record for this email or mobile to allow resend/update
        PendingUser.objects.filter(email=email).delete()
        PendingUser.objects.filter(mobile_number=mobile).delete()
        
        # Initial OTP generation
        otp = str(random.randint(100000, 999999))
        otp_expiry = timezone.now() + timedelta(minutes=5)
        
        pending_user = PendingUser.objects.create(
            **validated_data,
            password=hashed_password,
            otp=otp,
            otp_expiry=otp_expiry
        )
        return pending_user
