from flask_restx import Resource
from flask import request, g
from api.profile.business.db_calls import update_profile, deactivate_profile, fetch_profile

from api.restx import profile_api as api
from api.utils import token_required
from api.profile.endpoints.serializers import user

ns = api.namespace('profile', description='profile operations', path='/profile')

# profile related operations
@ns.route('/fetchProfile')
class FetchProfile(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer') 
    @token_required
    def get(self):
        """
        fetch profile
        """

        username = g.user.get('username')
        data = fetch_profile(username)
        # print('data before',data)
        data['token'] = g.user.get('token')
        # print('data after',data)

        return data, 200

@ns.route('/updateProfile')
class UpdateProfile(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(user)
    @ns.doc(security='Bearer')
    @token_required
    def post(self):
        """
        update profile
        """

        data = request.json
        result = update_profile(data)

        return {'message': result }, 200
    
@ns.route('/deactivateProfile')
class DeactivateProfile(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @token_required
    def post(self):
        """
        deactivate profile
        """
        user_id = g.user.get('id')
        username = g.user.get('username')

        result = deactivate_profile(username,user_id)

        return {'message': result }, 200
    

    



