
import bcrypt
from flask import request
from api.email import send_verification_email
from database.models import mysql
import pymysql
import logging
log = logging.getLogger('api_admin_db')

# User related db calls 
def fetch_users(username):
    log.info("Fetching users")
    _username = username
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_fetch_users', (_username,))
        data = cursor.fetchall()
        log.info("Users fetched successfully.")
        return data
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error fetching users.')

def add_user(data,username):
    log.info("Creating user")
    _username = data.get('username').lower()
    _password = data.get('password')
    _email = data.get('email')
    _firstname = data.get('first_name')
    _lastname = data.get('last_name')
    _role = data.get('role')
    _user_created = username
    
    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_create_user', (_firstname, _lastname, _username,  _email, _password, _role, _user_created,))
        data = cursor.fetchall()
        conn.commit()
        log.info("User created successfully.")
        return 'User created successfully.'
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error creating user.')

def update_user(data, username):
    log.info("Updating user")
    _id = data.get('id')
    _username = data.get('username').lower()
    _email = data.get('email')
    _firstname = data.get('first_name')
    _lastname = data.get('last_name')
    _role = data.get('role')
    _user_modified = username
    email_modified = 1

    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:

        cursor.callproc('sp_update_user', (_id, _firstname, _lastname, _username, _email, _role, _user_modified, email_modified ))
        data = cursor.fetchall()
        conn.commit()
        # print("data",data, email_modified)
        if data[0]['p_email_updated'] == 1:
            log.info("Sending verification email")
            send_verification_email(request, _email)
        log.info("User updated successfully.")
        return 'User updated successfully.' 
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error updating user.')
    
def reset_user_password(data, username, password):
    log.info("Resetting user password")
    _username = data.get('username')
    _password = password
    _hashed_password = bcrypt.hashpw(_password.encode('utf-8'), bcrypt.gensalt())
    _user_modified = username

    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        cursor.callproc('sp_reset_user_password', (_username, _hashed_password, _user_modified,))
        data = cursor.fetchall()
        conn.commit()
        log.info("Password reset successfully.")
        return 'Password reset successfully.'
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error resetting password.')
    
def change_user_status(data, username):
    log.info("Changing user status")
    _id = data.get('id')
    _username = data.get('username')
    _user_modified = username
    _status = data.get('status')
    
    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_change_user_status', (_id, _username, _user_modified,))
        data = cursor.fetchall()
        conn.commit()
        log.info("User status changed successfully.")
        return 'User {status} successfully.'.format(status='deactivated' if _status == 'active' else 'activated')
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error changing user status.')

# #profile related db calls   
# def fetch_profile(username):
#     log.info("Fetching profile")
#     _username = username
#     conn = mysql.connect()
#     cursor = conn.cursor(pymysql.cursors.DictCursor)
#     try:
#         cursor.callproc('sp_fetch_profile', (_username,))
#         data = cursor.fetchone()
#         log.info("Profile fetched successfully.")
#         return data
#     except pymysql.Error as e:
#         if (e.args[0] == 1001):
#             log.error(e.args[1])
#             raise ValueError(e.args[1])
#         log.error(e.args[1])
#         # print(e.args[1])
#         raise ValueError('Error fetching user.')
    
# def update_profile(data):
#     log.info("Updating profile")
#     _id = data.get('id')
#     _username = data.get('username').lower()
#     _email = data.get('email')
#     _firstname = data.get('first_name')
#     _lastname = data.get('last_name')
#     _password = base64.b64decode(data.get('password'))
#     # print("password",_password)
#     if _password:
#         _hashed_password = bcrypt.hashpw(_password, bcrypt.gensalt())
#     else:
#         _hashed_password = ''
#     _user_modified = data.get('username').lower()

#     conn = mysql.connect()
#     cursor = conn.cursor(pymysql.cursors.DictCursor)
#     try:

#         cursor.callproc('sp_update_profile', (_id, _firstname, _lastname, _username, _email, _hashed_password,))
#         data = cursor.fetchone()
#         # print("data",data)
#         conn.commit()
#         log.info("User updated successfully.")
#         return 'User updated successfully.' , data['p_email_updated']
        
#     except pymysql.Error as e:
#         if (e.args[0] == 1001):
#             log.error(e.args[1])
#             raise ValueError(e.args[1])
#         log.error(e.args[1])
#         # print(e.args[1])
#         raise ValueError('Error updating user.')
    
# def deactivate_profile(username, user_id):
#     log.info("Deactivating profile")
#     _username = username
#     _user_id = user_id
    
#     conn = mysql.connect()
#     cursor = conn.cursor()
#     try:

#         cursor.callproc('sp_deactivate_profile', (_user_id, _username,))
#         data = cursor.fetchall()
#         conn.commit()
#         log.info("Profile deactivated successfully.")
#         return 'Profile deactivated successfully.'
        
#     except pymysql.Error as e:
#         if (e.args[0] == 1001):
#             log.error(e.args[1])
#             raise ValueError(e.args[1])
#         log.error(e.args[1])
#         # print(e.args[1])
#         raise ValueError('Error deactivating profile.')
    