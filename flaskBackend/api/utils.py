import datetime
from flask import Response, jsonify, request
from functools import wraps
import bcrypt
import jwt
from exception.auth_error import AuthError
from database.models import mysql
from cipher import get_aes_key_from_rsa
import settings
from api.db_calls import verify_user
from flask import g
import random, string

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        auth = request.headers.get('Authorization')
        auth = auth.split(" ")
        if len(auth) == 2:
            token = auth[1]
        else:
            raise AuthError( 'Token is invalid, Please login to get a new token.')  

        # print("Token is ", token)
        # if 'x-access-token' in request.headers:
        #     token = request.headers['x-access-token']
        #     print("x-access-token Token is  ", token)
        # return 401 if token is not passed
        if not token:
            # print("Token is missing !!")
            raise AuthError( 'Token is missing, Please login to get token.')
        # print("Token is ", token)
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, get_aes_key_from_rsa(settings.KEY_FILE_PATH), algorithms='HS256')
            # print("data", data)
            current_user = verify_user(data['username'],request)
            current_user['token'] = token
            # print("current_user", current_user)
            g.user = current_user 
        except jwt.ExpiredSignatureError as e:
            raise AuthError( 'Token has expired, Please login to get a new token.', errors=e)  
        except jwt.InvalidTokenError as e:
            raise AuthError( 'Token is invalid, Please login to get a new token.' , errors=e)  
        except Exception as e:
            # print(e)
            raise AuthError( 'Token is invalid., Please login to get a new token.' , errors=e)
        
        # returns the current logged in users context to the routes
        return  f(*args, **kwargs)
  
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        auth = request.headers.get('Authorization')
        auth = auth.split(" ")
        if len(auth) == 2:
            token = auth[1]
        else:
            raise AuthError( 'Token is invalid, Please login to get a new token.')  

        # print("Token is ", token)
        # if 'x-access-token' in request.headers:
        #     token = request.headers['x-access-token']
        #     print("x-access-token Token is  ", token)
        # return 401 if token is not passed
        if not token:
            # print("Token is missing !!")
            raise AuthError( 'Token is missing, Please login to get token.')
        # print("Token is ", token)
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, get_aes_key_from_rsa(settings.KEY_FILE_PATH), algorithms='HS256')
            # print("data", data)
            current_user = verify_user(data['username'],request)
            # print("current_user", current_user)
            if  current_user['role'] != 'admin':
                raise AuthError( 'Unauthorized access, Please login to get a new token.')
            current_user['token'] = token
            g.user = current_user 
        except jwt.ExpiredSignatureError as e:
            raise AuthError( 'Token has expired, Please login to get a new token.', errors=e)  
        except jwt.InvalidTokenError as e:
            raise AuthError( 'Token is invalid, Please login to get a new token.' , errors=e)  
        except Exception as e:
            # print(e)
            raise AuthError( 'Token is invalid., Please login to get a new token.' , errors=e)
        
        # returns the current logged in users context to the routes
        return  f(*args, **kwargs)
  
    return decorated


def data_admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        auth = request.headers.get('Authorization')
        auth = auth.split(" ")
        if len(auth) == 2:
            token = auth[1]
        else:
            raise AuthError( 'Token is invalid, Please login to get a new token.')  

        print("Token is ", token)
        # if 'x-access-token' in request.headers:
        #     token = request.headers['x-access-token']
        #     print("x-access-token Token is  ", token)
        # return 401 if token is not passed
        if not token:
            # print("Token is missing !!")
            raise AuthError( 'Token is missing, Please login to get token.')
        # print("Token is ", token)
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, get_aes_key_from_rsa(settings.KEY_FILE_PATH), algorithms='HS256')
            # print("data", data)
            current_user = verify_user(data['username'],request)
            # print("current_user", current_user)
            if not(current_user['role'] in ['data_admin','admin']):
                raise AuthError( 'Unauthorized access, Please login to get a new token.')
            current_user['token'] = token
            g.user = current_user 
        except jwt.ExpiredSignatureError as e:
            raise AuthError( 'Token has expired, Please login to get a new token.', errors=e)  
        except jwt.InvalidTokenError as e:
            raise AuthError( 'Token is invalid, Please login to get a new token.' , errors=e)  
        except Exception as e:
            # print(e)
            raise AuthError( 'Token is invalid., Please login to get a new token.' , errors=e)
        
        # returns the current logged in users context to the routes
        return  f(*args, **kwargs)
  
    return decorated


# def auth_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         auth = request.authorization
#         # print(auth)
#         # print(auth.username)
#         # print(auth.password)
#         if not auth or not check_auth(auth.username, auth.password):
#             return Response(
#                 'Could not verify your access level for that URL.\n'
#                 'You have to login with proper credentials', 400
#             )
#         return f(*args, **kwargs)
#     return decorated

# def check_auth(username, password):
#     # Here you should retrieve the hashed password from your database based on the username
#     mysql.connect()
#     cursor = mysql.get_db().cursor()

#     # For demonstration, I'm using a hardcoded hash
#     hash = b"$2b$12$h17SvF6wkrYYz1/QhqK4R.b6vqSKUOD03slqBKMn//eRYXV7g1iI."
   
#     if bcrypt.checkpw(password.encode('utf-8'), hash):
#         return  True
#     else:
#         return False
    

def generate_random_password():
    length = 13
    chars = string.ascii_letters + string.digits + '!@#$%^&*()'
    rnd = random.SystemRandom()
    return ''.join(rnd.choice(chars) for i in range(length))




    