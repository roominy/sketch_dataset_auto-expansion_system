

from flask_restx import Resource
from flask import request, g
from api.admin.business.db_calls import fetch_users, update_user , add_user, change_user_status , reset_user_password
from api.email import send_password_reset_email
from api.restx import  admin_api as api
from api.utils import admin_required, generate_random_password
from api.admin.endpoints.serializers import user

ns = api.namespace('users', description='users admin operations', path='/users')

# admin users related operations
@ns.route('/fetchUsers')
class FetchUsers(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @admin_required
    def get(self):
        """
        fetch users
        """

        username = g.user.get('username')
        data = fetch_users(username)

        return data, 200


@ns.route('/addUser')
class AddUser(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(user)
    @ns.doc(security='Bearer')
    @admin_required
    def post(self):
        """
        add user
        """
        
        data = request.json
        username = g.user.get('username')
        result = add_user(data, username)

        return {'message': result }, 200
    
@ns.route('/editUser')
class EditUser(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(user)
    @ns.doc(security='Bearer')
    @admin_required
    def post(self):
        """
        edit user
        """

        data = request.json
        username = g.user.get('username')
        result = update_user(data, username)

        return {'message': result }, 200 

@ns.route('/resetPassword')
class ResetPassword(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(user)
    @ns.doc(security='Bearer')
    @admin_required
    def post(self):
        """
        reset password
        """

        data = request.json
        username = g.user.get('username')
        email = data.get('email')
        password = generate_random_password()
        result = reset_user_password(data, username, password)
        send_password_reset_email(email, password)

        return {'message': result }, 200  
    
@ns.route('/changeUserStatus')
class DeactivateUser(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(user)
    @ns.doc(security='Bearer')
    @admin_required
    def post(self):
        """
        deactivate user
        """

        data = request.json
        username = g.user.get('username')
        result = change_user_status(data, username)

        return {'message': result }, 200

# # profile related operations
# @ns.route('/fetchProfile')
# class FetchProfile(Resource):
#     @ns.response(200, 'Success')
#     @ns.response(400, 'Error')
#     @ns.doc(security='Bearer') 
#     @token_required
#     def get(self):
#         """
#         fetch profile
#         """

#         username = g.user.get('username')
#         data = fetch_profile(username)
#         # print('data before',data)
#         data['token'] = g.user.get('token')
#         # print('data after',data)

#         return data, 200

# @ns.route('/updateProfile')
# class UpdateProfile(Resource):
#     @ns.response(200, 'Success')
#     @ns.response(400, 'Error')
#     @ns.expect(user)
#     @ns.doc(security='Bearer')
#     @token_required
#     def post(self):
#         """
#         update profile
#         """

#         data = request.json
#         result = update_profile(data)

#         return {'message': result }, 200
    
# @ns.route('/deactivateProfile')
# class DeactivateProfile(Resource):
#     @ns.response(200, 'Success')
#     @ns.response(400, 'Error')
#     @ns.doc(security='Bearer')
#     @token_required
#     def post(self):
#         """
#         deactivate profile
#         """
#         user_id = g.user.get('id')
#         username = g.user.get('username')

#         result = deactivate_profile(username,user_id)

#         return {'message': result }, 200
    

    


