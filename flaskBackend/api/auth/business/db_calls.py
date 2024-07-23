
from api.email import send_verification_email
from database.models import mysql
import pymysql
import json
import bcrypt 
import base64
import logging
log = logging.getLogger('api_auth_db')


def check_auth(username, password, request):
    # Here you should retrieve the hashed password from your database based on the username
    log.info("Checking auth")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    # print("username",username)
    try:
        cursor.callproc('sp_validate_login', (username,))
        data = cursor.fetchone()
        if data:
            # print(data)
            user_data = {}
            user_pass = data["password"]
            # print(password, user_pass)
            if bcrypt.checkpw(password.encode('utf-8'), user_pass.encode('utf-8')):
                # print("password matched")
                user_data = {}
                user_data['id'] = data["id"]
                user_data['username'] = data["username"]
                user_data['first_name'] = data["first_name"]
                user_data['last_name'] = data["last_name"]
                user_data['email'] = data["email"]
                user_data['role'] = data["role"]
                if data['status'] == 'pending':
                    log.info("User is pending")
                    send_verification_email(request, user_data['email'])
                    log.info("verification email sent")
                    raise ValueError('User is not active, Please check your email for verification.')
                elif data['status'] == 'inactive':
                    log.info("User is not active")
                    raise ValueError('User is not active. Please contact the administrator.')
                log.info("User logged in successfully.")
                return  user_data
            else:
                raise ValueError( 'Invalid username or password.')
        else:
            raise ValueError('Invalid username or password.')
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            # print(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError( 'Error in logging in.')
    
def register_user(data):
    log.info("Registering user")
    _username = data.get('username').lower()
    _password = base64.b64decode(data.get('password'))
    _email = data.get('email')
    _firstname = data.get('first_name')
    _lastname = data.get('last_name')
    _hashed_password = bcrypt.hashpw(_password, bcrypt.gensalt())
    _hashed_password =_hashed_password.decode('utf-8')
    
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        cursor.callproc('sp_register_user', (_firstname, _lastname, _username, _email, _hashed_password))
        data = cursor.fetchall()
        conn.commit()
        log.info("User created successfully.")
        return 'User created successfully.' 
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError( e.args[1])
        log.error(e.args[1])
        raise ValueError('Error creating user.')

def verify_email(email):
    log.info("Verifying email")
    _email = email
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        cursor.callproc('sp_verify_email', (_email,))
        cursor.fetchall()
        conn.commit()
        log.info("Email verified successfully.")
        return 'Email verified successfully.'
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        raise ValueError('Error verifying email.')
    