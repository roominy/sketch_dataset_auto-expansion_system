import logging
from api.email import generate_token, confirm_token, send_verification_email
import settings
import bcrypt 
import base64
import jwt
from datetime import datetime, timedelta
from flask import request, send_file, jsonify
from flask_restx import Resource
# from api.utils import auth_required
from api.auth.business.db_calls import register_user , check_auth, verify_email

from api.restx import auth_api as api
# from api.auth.endpoints.parsers import 
from api.auth.endpoints.serializers import register_user, login_user
from cipher import get_aes_key_from_rsa
from mail.models import mail

from flask_mail import  Message


log = logging.getLogger('api_auth')

ns = api.namespace('authorization', description='authorization operations', path='/authorization')


@ns.route('/login')
class Login(Resource):
    @ns.response(201, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='basicAuth')
    def get(self):
        """
        login with basic authentication
        """

        log.info("Login called")
        auth = request.authorization
        if not auth or not auth.username or not auth.password:
            return {'message': 'Invalid Username or Password'}, 400
        
        result = check_auth(auth.username, auth.password, request)
           
        token_expiry =  timedelta(hours = 1)
        try:
            token = jwt.encode({
                'username': auth.username,
                'exp' : datetime.utcnow() + token_expiry
            }, get_aes_key_from_rsa(settings.KEY_FILE_PATH), algorithm='HS256')
        except Exception as e:
            log.error(e)
            return {'message': 'Error in creating token'}, 400
        # print("token")
        # print("token",token,  token_expiry)
        # Here you can add logic to verify the user and return a response
        result['token'] = token
        result['token_exp'] = token_expiry.total_seconds()
        log.info("Token created for user")
        return result, 200
        
        # data = request.json
        # user_data = {}
        # user_data['username'] = data['username']
        # password = base64.b64decode(data['password'])
        # # password = data['password'].encode('utf-8')
        
        # hash = b"$2b$12$h17SvF6wkrYYz1/QhqK4R.b6vqSKUOD03slqBKMn//eRYXV7g1iI."
        # result = bcrypt.checkpw(password, hash) 

        # return {'result': result } , 200
    
@ns.route('/register')
class Register(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(register_user)
    def post(self):
        """
        register user 
        """
        log.info("Register called")
        data = request.json
        data['role'] = 'user'
        register_user(data)
        send_verification_email(request, data.get('email'))

        # token = generate_token(data.get('email'))
        # msg = Message('Token', sender =   settings.MAIL_USERNAME, recipients = ['roominoura@gmail.com'])
        # msg.body = token
        # mail.send(msg)
        # return {'message': result }, 200
        log.info("User registered successfully")
        return {'message': ' User registered successfully. Please check your email for verification.' }, 200
    
@ns.route('/verify/<token>')
@ns.param('token', 'The confirmation token')
class Confirm(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    def get(self, token):
        """
        confirm user 
        """
        log.info("Confirm called")
        
        email = confirm_token(token)

        verify_email(email)

        if not email:
            log.error("The confirmation link is invalid or has expired.")
            send_verification_email(request, email)
            log.info("verification email sent")
            return {'message': 'The confirmation link is invalid or has expired.'}, 400
        log.info("User confirmed successfully")
        return {'message': 'You have confirmed your email. You can now login.'}, 200
    
