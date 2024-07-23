from flask_restx import fields
from api.restx import auth_api as api

login_user = api.model('login a user', {
    'username': fields.String(required=True, description='username'),
    'password': fields.String(required=True, description='password')})

register_user = api.model('register a user', {
    'username': fields.String(required=True, description='username'),
    'password': fields.String(required=True, description='password'),
    'email': fields.String(required=True, description='email'),
    'firstname': fields.String(required=True, description='first name'),
    'lastname': fields.String(required=True, description='last name'),
    'role': fields.String(required=True, description='user role', default='user', enum=['admin', 'user', 'data_admin']),
})

