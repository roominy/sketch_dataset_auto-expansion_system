
from flask import jsonify
from database.models import mysql
import pymysql
import json
import logging
import base64
log = logging.getLogger('api_sketch_db')



def decode_base64_data(data_url):
    log.info("Decoding base64 data")
    """Decode base64 data to binary."""
    header, data = data_url.split(',', 1)
    log.info("Base64 data decoded successfully.")
    return base64.b64decode(data)
    

def submit_sketch(data, username):
    log.info("Submitting sketch")
    _png = decode_base64_data(data.get('png'))
    _sav = decode_base64_data(data.get('svg'))
    _category_id = data.get('category_id')
    _user_id = data.get('sketcher_id')
    _username = username

    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        # print("data", _category_id, _user_id, _png, _sav, _username)

        cursor.callproc('sp_submit_sketch', (_category_id, _user_id, _png, _sav, _username,))
        data = cursor.fetchall()
        conn.commit()
        log.info("Sketch submitted successfully.")
        return 'Sketch submitted successfully.'

    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error submitting sketch.') 