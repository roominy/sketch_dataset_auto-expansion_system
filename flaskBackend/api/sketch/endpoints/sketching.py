import logging

from flask import request, send_file
from flask_restx import Resource

from api.restx import sketch_api as api
# from api.sketch.endpoints.parsers import add_args
from api.sketch.endpoints.serializers import sketch_submission_model
from api.utils import token_required
from flask import g 
from api.sketch.business.db_calls import submit_sketch

log = logging.getLogger('api_sketch')

ns = api.namespace('sketch', description='sketch operations',path='/submission')


@ns.route('/sketch')
class SubmitSketch(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(sketch_submission_model)
    @ns.doc(security='Bearer Auth')
    @token_required
    def post(self):
        """
        submit sketch
        """
        log.info("Submit sketch called")
        data = request.json
        
        username = g.user.get('username')

        result = submit_sketch(data, username)

        log.info("Sketch submitted successfully")
        return {'message': result }, 200
    
