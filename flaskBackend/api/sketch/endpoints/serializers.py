from flask_restx import fields
from api.restx import sketch_api as api

sketch_submission_model = api.model('CanvasData', {
    'png': fields.String(required=True, description='PNG data URL'),
    'svg': fields.String(required=True, description='SVG data URL'),
    'sketcher_id': fields.Integer(required=False, description='User ID'),
    'category_id': fields.Integer(required=False, description='Category ID')
})

