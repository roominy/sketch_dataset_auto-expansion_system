import logging.config

import os
import datetime
from flask import Flask, Blueprint
from flask_cors import CORS
from flask_apscheduler import APScheduler
import settings
from api.restx import auth_api , sketch_api , admin_api , data_admin_api, profile_api
from api.auth.endpoints.authorization import ns as auth_namespace
from api.sketch.endpoints.sketching import ns as sketch_namespace
from api.data_admin.endpoints.dataset import ns as dataset_namespace
from api.admin.endpoints.users import ns as users_namespace
from api.profile.endpoints.profile import ns as profile_namespace
from database.models import mysql as db
from mail.models import mail 
from cipher import AESCipher, get_aes_key_from_rsa, get_salt_from_rsa
from flask_mail import Mail
from run_pipeline import run_pipeline

app = Flask("SketchApp")
CORS(app)


logging_conf_path = os.path.normpath(os.path.join(os.path.dirname(__file__), 'logging.conf'))
logging.config.fileConfig(logging_conf_path)
# logging.basicConfig(level=logging.INFO)
log = logging.getLogger("root")
# print(__name__)


if not os.path.exists(settings.KEY_FILE_PATH):
    raise FileNotFoundError(f"The file {settings.KEY_FILE_PATH} does not exist.")
if not os.path.exists(settings.MYSQL_DATABASE_PASSWORD_FILE_PATH):
    raise FileNotFoundError(f"The file {settings.MYSQL_DATABASE_PASSWORD_FILE_PATH} does not exist.")

aes_key = get_aes_key_from_rsa(settings.KEY_FILE_PATH)
log.info("AES key set")


salt = get_salt_from_rsa(settings.KEY_FILE_PATH)
log.info("Salt set")


cipher = AESCipher(aes_key)
log.info("Cipher created")

with open(settings.MYSQL_DATABASE_PASSWORD_FILE_PATH, 'rb') as f:
    db_pass_encrypted = f.read()
    log.info("Database password read")
    # print("encrypted")

with open(settings.EMAIL_PASSWORD_FILE_PATH, 'rb') as f:
    email_pass_encrypted = f.read()
    log.info("Email password read")
    # print("encrypted")


def configure_app(flask_app):
    flask_app.config["SECRET_KEY"] = aes_key
    flask_app.config["SALT"] = salt
    flask_app.config['SERVER_NAME'] = settings.FLASK_SERVER_NAME
    flask_app.config['SWAGGER_UI_DOC_EXPANSION'] = settings.RESTPLUS_SWAGGER_UI_DOC_EXPANSION
    flask_app.config['RESTPLUS_VALIDATE'] = settings.RESTPLUS_VALIDATE
    flask_app.config['RESTPLUS_MASK_SWAGGER'] = settings.RESTPLUS_MASK_SWAGGER
    flask_app.config['ERROR_404_HELP'] = settings.RESTPLUS_ERROR_404_HELP
    
    # MySQL settings
    flask_app.config['MYSQL_DATABASE_HOST'] = settings.MYSQL_DATABASE_HOST
    flask_app.config['MYSQL_DATABASE_USER'] = settings.MYSQL_DATABASE_USER
    flask_app.config['MYSQL_DATABASE_PASSWORD'] = cipher.decrypt(db_pass_encrypted)
    flask_app.config['MYSQL_DATABASE_DB'] = settings.MYSQL_DATABASE_DB

    # Email settings
    flask_app.config['MAIL_SERVER']= settings.MAIL_SERVER
    flask_app.config['MAIL_PORT'] = settings.MAIL_PORT
    flask_app.config['MAIL_USERNAME'] = settings.MAIL_USERNAME
    flask_app.config['MAIL_PASSWORD'] = cipher.decrypt(email_pass_encrypted)
    flask_app.config['MAIL_USE_TLS'] = False
    flask_app.config['MAIL_USE_SSL'] = True

def initialize_app(flask_app):
    configure_app(flask_app)

    db.init_app(flask_app)
    mail.init_app(flask_app)

    auth_blueprint = Blueprint('auth_api', __name__, url_prefix='/api/auth')
    sketch_blueprint = Blueprint('sketch_api', __name__, url_prefix='/api/sketch')
    admin_blueprint = Blueprint('admin_api', __name__, url_prefix='/api/admin')

    data_admin_blueprint = Blueprint('data_admin_api', __name__, url_prefix='/api/data_admin')
    profile_blueprint = Blueprint('profile_api', __name__, url_prefix='/api/user')
    
    
    auth_api.init_app(auth_blueprint)
    auth_api.add_namespace(auth_namespace)
    flask_app.register_blueprint(auth_blueprint)

    sketch_api.init_app(sketch_blueprint)
    sketch_api.add_namespace(sketch_namespace)
    flask_app.register_blueprint(sketch_blueprint)

    data_admin_api.init_app(data_admin_blueprint)
    data_admin_api.add_namespace(dataset_namespace)
    # admin_api.add_namespace(dataset_namespace)
    flask_app.register_blueprint(data_admin_blueprint)

    admin_api.init_app(admin_blueprint)
    admin_api.add_namespace(users_namespace)
    # admin_api.add_namespace(dataset_namespace)
    flask_app.register_blueprint(admin_blueprint)
    
    profile_api.init_app(profile_blueprint)
    profile_api.add_namespace(profile_namespace)
    flask_app.register_blueprint(profile_blueprint)

class Config:
    JOBS = [
        {
            'id': 'pipeline_job',
            'func': 'run_pipeline:run_pipeline',  # Reference the function directly
            'trigger': 'cron',
            'hour': 23
        }
    ]
    SCHEDULER_API_ENABLED = True

app.config.from_object(Config())

# Initialize the scheduler
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

def main():


    initialize_app(app)


    log.info(f'>>>>> Starting app at http://{app.config["SERVER_NAME"]}/api/ <<<<<')
    app.run(debug=settings.FLASK_DEBUG, port=settings.FLASK_SERVER_PORT)

if __name__ == "__main__":
    main()