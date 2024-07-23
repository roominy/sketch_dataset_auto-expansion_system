from itsdangerous import URLSafeTimedSerializer

from cipher import get_aes_key_from_rsa, get_salt_from_rsa
import settings
from mail.models import mail

from flask_mail import  Message
# from app import app

def generate_token(email):
    serializer = URLSafeTimedSerializer(get_aes_key_from_rsa(settings.KEY_FILE_PATH))
    return serializer.dumps(email, salt=get_salt_from_rsa(settings.KEY_FILE_PATH))


def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(get_aes_key_from_rsa(settings.KEY_FILE_PATH))
    try:
        email = serializer.loads(
            token, salt=get_salt_from_rsa(settings.KEY_FILE_PATH), max_age=expiration)
        return email
    except Exception:
        return False
    
def send_verification_email(request, email):
    
    # pass
    token = generate_token(email)
    # print("token", type(email),email, token)
    verification_link = f"{request.url_root}api/auth/authorization/verify/{token}"
    # print("verification_link", verification_link)
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f0f0f0;">
        <div style="max-width: 600px;margin: 40px auto;padding: 20px;background-color: #fff;border-radius: 8px;box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2>Email Verification</h2>
            <p>Please click the button below to verify your email address and complete your registration.</p>
            <a href="{verification_link}" style="display: inline-block;padding: 10px 20px;background-color: #007bff;color: #ffffff;text-decoration: none;border-radius: 5px;">Verify Email</a>
            <p style=" margin-top: 20px;text-align: center;font-size: 14px;color: #777;">If you did not create an account using this email address, please ignore this email.</p>
        </div>
    </body>
    </html>
    """.format(verification_link=verification_link)
    subject = "Please verify your email address"
    msg = Message()
    msg.subject = subject
    msg.sender = settings.MAIL_USERNAME
    msg.recipients = [email]
    msg.html = html_content
    mail.send(msg)
    # msg = Message('Token', sender =   settings.MAIL_USERNAME, recipients = [email])
    # msg.body = token
    # mail.send(msg)
    return 

def send_password_reset_email(email, password):
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f0f0f0;">
        <div style="max-width: 600px;margin: 40px auto;padding: 20px;background-color: #fff;border-radius: 8px;box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2>Password Reset</h2>
            <p>Your password has been reset successfully. Your new temporary password is: {password}.</p>
            <p> Please login using this password and reset your password.</p>
            <p style=" margin-top: 20px;text-align: center;font-size: 14px;color: #777;">If you did not request a password reset, please contact support.</p>
        </div>
    </body>
    </html>
    """.format(password=password)
    subject = "Password Reset"
    msg = Message()
    msg.subject = subject
    msg.sender = settings.MAIL_USERNAME
    msg.recipients = [email]
    msg.html = html_content
    mail.send(msg)

    return

