import os
import django
import sys
import traceback

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'coreinventory.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    target_email = "drashtichavda176@gmail.com"
    print(f"Testing email delivery to: {target_email}")
    print(f"Using SMTP Server: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
    print(f"Sender (EMAIL_HOST_USER): {settings.EMAIL_HOST_USER}")
    
    if settings.EMAIL_HOST_PASSWORD == 'your-app-password':
        print("\n[!] ERROR: The EMAIL_HOST_PASSWORD in .env is still set to 'your-app-password'.")
        print("Please generate a Gmail App Password, update your .env file, and run this script again.")
        sys.exit(1)

    try:
        print("Attempting to send email...")
        sent = send_mail(
            subject='Test Diagnostic Email from CoreInventory',
            message='This is a test email to verify SMTP configuration and delivery for drashtichavda176@gmail.com.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[target_email],
            fail_silently=False,
        )
        if sent:
            print("\n[+] SUCCESS: Test email successfully sent to SMTP server!")
            print("Please check the inbox (and spam/junk folder) for drashtichavda176@gmail.com.")
            print("If it is not in the inbox, Gmail might be filtering it.")
        else:
            print("\n[-] WARNING: send_mail returned 0. The email might not have been sent.")
    except Exception as e:
        print("\n[-] FAILED to send email due to an exception:")
        print("--- Traceback ---")
        traceback.print_exc()
        print("-----------------")
        print("Common reasons for failure:")
        print("1. Invalid Gmail App Password (make sure to use a 16-character App Password, not your normal password).")
        print("2. 2-Step Verification is not enabled (required for App Passwords).")
        print("3. Network/firewall blocking the connection to port 587.")

if __name__ == '__main__':
    test_email()
