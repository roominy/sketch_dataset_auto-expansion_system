from flask_restx import fields
from api.restx import profile_api as api

user = api.model('user', {
    'id': fields.Integer(required=False, description='user id'),
    'username': fields.String(required=True, description='username'),
    'password': fields.String(required=False, description='password'),
    'email': fields.String(required=True, description='email'),
    'first_name': fields.String(required=True, description='first name'),
    'last_name': fields.String(required=True, description='last name'),
    'role': fields.String(required=True, description='user role', default='user', enum=['admin', 'user', 'data_admin']),
    'status': fields.String(required=False, description='user status', default='active', enum=['active', 'inactive', 'pending'])
})