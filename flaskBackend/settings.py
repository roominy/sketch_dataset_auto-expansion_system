import os

# Flask settings
FLASK_SERVER_PORT = '8890'
FLASK_SERVER_NAME = f'localhost:{FLASK_SERVER_PORT}'

FLASK_DEBUG = True  # Do not use debug mode in production

# Flask-Restplus settings
RESTPLUS_SWAGGER_UI_DOC_EXPANSION = 'list'
RESTPLUS_VALIDATE = True
RESTPLUS_MASK_SWAGGER = False
RESTPLUS_ERROR_404_HELP = False

# RSA Cipher settings
RSA_KEY_FILE_PATH = '~/.ssh/id_rsa'
KEY_FILE_PATH = os.path.expanduser(RSA_KEY_FILE_PATH)

EMAIL_PASSWORD_FILE = '~/.ssh/email_password'
EMAIL_PASSWORD_FILE_PATH = os.path.expanduser(EMAIL_PASSWORD_FILE)
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 465
MAIL_USERNAME = 'sketch.dataset.auto.expansion@gmail.com'
MAIL_USE_TLS = False
MAIL_USE_SSL = True

# MySQL settings
MYSQL_DATABASE_PASSWORD_FILE = '~/.ssh/mysql_password'
MYSQL_DATABASE_PASSWORD_FILE_PATH = os.path.expanduser(MYSQL_DATABASE_PASSWORD_FILE)
MYSQL_DATABASE_HOST = '172.234.228.88'
MYSQL_DATABASE_DB = 'SKETCHDB'
MYSQL_DATABASE_USER = 'sketch_user'

# Sketch model settings
GPU = 0
MODEL_PATH = 'models/final_resnet_model.pth'
GLOBAL_DATASET_MEAN = 0.0179
GLOBAL_DATASET_STD = 0.0860

