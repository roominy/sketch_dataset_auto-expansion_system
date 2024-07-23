import logging
import traceback
from exception.auth_error import AuthError

from flask_restx import Api
import settings

log = logging.getLogger('api')

auth_api = Api(version='1.0', title='Auth API',
          description='Auth API',security='basicAuth',
    authorizations={
        'basicAuth': {
            'type': 'basic'
        }
    }
)

sketch_api = Api(version='1.0', title='Sktech API',
          description='Sketch API',security='Bearer',
    authorizations={
        "Bearer": {
            "type": "apiKey", 
            "in": "header", 
            "name": "Authorization"
            }
    }
)

admin_api = Api(version='1.0', title='Admin API',
          description='admin API',security='Bearer',
    authorizations={
        "Bearer": {
            "type": "apiKey", 
            "in": "header", 
            "name": "Authorization"
            }
    }
)



profile_api = Api(version='1.0', title='Profile API',
          description='Profile API',security='Bearer',
    authorizations={
        "Bearer": {
            "type": "apiKey", 
            "in": "header", 
            "name": "Authorization"
            }
    }
)

data_admin_api = Api(version='1.0', title='Dataset API',
          description='dataset API',security='Bearer',
    authorizations={
        "Bearer": {
            "type": "apiKey", 
            "in": "header", 
            "name": "Authorization"
            }
    }
)

# auth_api
@auth_api.errorhandler(AuthError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 400

@auth_api.errorhandler(ValueError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 401

@auth_api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred'
    if settings.FLASK_DEBUG:
        data_admin_api.logger.error(e)
        log.exception(e)
    return {'message': message.strip()}, 500

# sketch_api
@sketch_api.errorhandler(ValueError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 400

@sketch_api.errorhandler(AuthError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 401

@sketch_api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred'
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': message.strip()}, 500

# admin_api
@admin_api.errorhandler(ValueError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 400

@admin_api.errorhandler(AuthError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 401

@admin_api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred'
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': message.strip()}, 500


# data_admin_api
@data_admin_api.errorhandler(ValueError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 400

@data_admin_api.errorhandler(AuthError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 401

@data_admin_api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred'
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': message.strip()}, 500

@profile_api.errorhandler(ValueError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 400

@profile_api.errorhandler(AuthError)
def handle_value_error(e):
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': str(e).strip()}, 401

@profile_api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred'
    if settings.FLASK_DEBUG:
        log.exception(e)
    return {'message': message.strip()}, 500