from flask_restx import fields
from api.restx import data_admin_api as api

add_category = api.model('Add Category', {
    'category_name': fields.String(required=True, description='category name'),
    'category_label': fields.String(required=True, description='category label'),
    'category_description': fields.String(required=True, description='category description')
})

category = api.model('Category', {
    'category_id': fields.Integer(required=True, description='category id'),
    'category_name': fields.String(required=True, description='category name'),
    'category_label': fields.String(required=True, description='category label'),
    'description': fields.String(required=True, description='category description'),
    'status': fields.String(required=True, description='category status', enum=['active', 'inactive'])
})


baseline_group = api.model('BaselineGroup', {
    'category_id': fields.Integer(required=True, description='category id'),
    'group_name': fields.String(required=True, description='group name'),
    'description': fields.String(required=True, description='category description'),
})

baseline_sketch = api.model('BaselineSketch', {
    # 'baseline_id': fields.Integer(required=True, description='baseline id'),
    'baseline_name': fields.String(required=True, description='The baseline sketch name'),
    'baseline_sketch': fields.String(required=True, description='The base64 encoded sketch data')
})

baseline_sketches = api.model('BaselineSketches', {
    'baseline_group_id': fields.Integer(required=True, description='The baseline group ID'),
    'baseline_sketches': fields.List(fields.Nested(baseline_sketch), required=True, description='List of baseline sketches')
})


pipeline_configuration = api.model('PipelineConfiguration', {
    'category_id': fields.Integer(required=True, description='category id'),
    'configuration_name': fields.String(required=True, description='configuration name'),
    'baseline_group_id': fields.Integer(required=True, description='group id'),
    'threshold': fields.Float(required=True, description='threshold')
})