import bcrypt
from database.models import mysql
import pymysql
import base64
import logging
log = logging.getLogger('api_profile_db')

#profile related db calls   
def fetch_profile(username):
    log.info("Fetching profile")
    _username = username
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_fetch_profile', (_username,))
        data = cursor.fetchone()
        log.info("Profile fetched successfully.")
        return data
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error fetching user.')
    
def update_profile(data):
    log.info("Updating profile")
    _id = data.get('id')
    _username = data.get('username').lower()
    _email = data.get('email')
    _firstname = data.get('first_name')
    _lastname = data.get('last_name')
    _password = base64.b64decode(data.get('password'))
    # print("password",_password)
    if _password:
        _hashed_password = bcrypt.hashpw(_password, bcrypt.gensalt())
    else:
        _hashed_password = ''
    _user_modified = data.get('username').lower()

    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:

        cursor.callproc('sp_update_profile', (_id, _firstname, _lastname, _username, _email, _hashed_password,))
        data = cursor.fetchone()
        # print("data",data)
        conn.commit()
        log.info("User updated successfully.")
        return 'User updated successfully.' , data['p_email_updated']
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error updating user.')
    
def deactivate_profile(username, user_id):
    log.info("Deactivating profile")
    _username = username
    _user_id = user_id
    
    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_deactivate_profile', (_user_id, _username,))
        data = cursor.fetchall()
        conn.commit()
        log.info("Profile deactivated successfully.")
        return 'Profile deactivated successfully.'
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error deactivating profile.')
    