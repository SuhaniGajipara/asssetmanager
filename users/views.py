from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from .models import PendingUser
from .serializers import SignupSerializer, UserSerializer
import random

User = get_user_model()

class SignupView(generics.CreateAPIView):
    queryset = PendingUser.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        pending_user = serializer.save()
        try:
            send_mail(
                'Verify your CoreInventory Account',
                f'Your verification code is: {pending_user.otp}',
                settings.DEFAULT_FROM_EMAIL,
                [pending_user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")
            print(f"OTP for {pending_user.email} is {pending_user.otp}")

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier') # email or mobile
        password = request.data.get('password')

        if not identifier or not password:
            return Response({'error': 'Credentials required'}, status=status.HTTP_400_BAD_REQUEST)

        # Try to find user by email or mobile
        user = User.objects.filter(email=identifier).first() or \
               User.objects.filter(mobile_number=identifier).first() or \
               User.objects.filter(username=identifier).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': UserSerializer(user).data
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        try:
            pending_user = PendingUser.objects.get(email=email)
            if pending_user.otp == otp and not pending_user.is_expired():
                # Create permanent User
                user = User.objects.create(
                    username=pending_user.username,
                    email=pending_user.email,
                    full_name=pending_user.full_name,
                    mobile_number=pending_user.mobile_number,
                    password=pending_user.password, # Already hashed in PendingUser
                    role=pending_user.role,
                    is_email_verified=True,
                    is_active=True
                )
                # Delete temporary data
                pending_user.delete()
                
                return Response({'message': 'Account verified and created successfully'}, status=status.HTTP_201_CREATED)
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except PendingUser.DoesNotExist:
            return Response({'error': 'Registration request not found or expired'}, status=status.HTTP_404_NOT_FOUND)

class ResendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            pending_user = PendingUser.objects.get(email=email)
            otp = str(random.randint(100000, 999999))
            pending_user.otp = otp
            pending_user.otp_expiry = timezone.now() + timedelta(minutes=5)
            pending_user.save()
            
            send_mail(
                'Verify your CoreInventory Account',
                f'Your new verification code is: {otp}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response({'message': 'New OTP sent to email'}, status=status.HTTP_200_OK)
        except PendingUser.DoesNotExist:
            return Response({'error': 'Registration request not found'}, status=status.HTTP_404_NOT_FOUND)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            otp = str(random.randint(100000, 999999))
            user.reset_otp = otp
            user.otp_expiry = timezone.now() + timedelta(minutes=5)
            user.save()
            
            # Send email
            send_mail(
                'Reset your CoreInventory Password',
                f'Your password reset code is: {otp}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=True,
            )
            print(f"Reset OTP for {email} is {otp}")
            return Response({'message': 'Reset OTP sent to email'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(email=email, reset_otp=otp)
            if user.is_otp_expired():
                 return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.reset_otp = None
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid OTP or email'}, status=status.HTTP_400_BAD_REQUEST)
