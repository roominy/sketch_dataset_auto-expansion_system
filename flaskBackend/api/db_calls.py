
from api.email import send_verification_email
from database.models import mysql
import pymysql
import json
import logging
log = logging.getLogger("api_db")


def verify_user(username, request):
    # Here you should retrieve the hashed password from your database based on the username
    log.info("Verifying user")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    # print("username",username)
    try:
        cursor.callproc('sp_validate_user', (username,))
        data = cursor.fetchone()
        if data:
            # print(data)
            user_data = {}
            user_data['id'] = data["id"]
            user_data['username'] = data["username"]
            user_data['email'] = data["email"]
            user_data['role'] = data["role"]
            if data['status'] == 'inactive':
                log.info("User is inactive")
                send_verification_email(request, user_data['email'])
                log.info("verification email sent")
                raise ValueError('User is not active.')
            log.info("User verified successfully.")
            return  user_data
        else:
           raise ValueError('Invalid user.')
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            # print(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError("Error in logging in.")