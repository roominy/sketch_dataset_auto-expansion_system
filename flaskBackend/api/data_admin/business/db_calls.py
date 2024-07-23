
from flask import jsonify
from database.models import mysql
import pymysql
import json
import logging
log = logging.getLogger('api_data_admin_db')


# Category related db calls
def create_category(data, username):
    log.info("Creating category")
    _category_name = data.get('category_name').lower()
    _category_label = data.get('category_label')
    _category_description = data.get('description')
    _username = username

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_create_category', (_category_name,_category_label,_category_description, _username))
        data = cursor.fetchall()
        conn.commit()
        log.info("Category created successfully.")
        return 'Category created successfully.'
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error creating category.')
    
def edit_category(data, username):
    log.info("Updating category")
    _category_id = data.get('category_id')
    _category_name = data.get('category_name').lower()
    _category_label = data.get('category_label')
    _category_description = data.get('description')
    _username = username

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_update_category', (_category_id, _category_name, _category_label, _category_description, _username))
        data = cursor.fetchall()
        conn.commit()
        log.info("Category updated successfully.")
        return 'Category updated successfully.'
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error updating category')

def change_category_status(data, username):
    log.info("Changing category status")
    _category_id = data.get('category_id')
    _category_status = data.get('status')
    _username = username

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_change_category_status', (_category_id, _category_status, _username))
        data = cursor.fetchall()
        conn.commit()
        log.info("Category status changed successfully.")
        return 'Category status changed successfully.'
        
    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error changing category status.')
       
def get_categories(username):
    log.info("Fetching categories")
    _username = username
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_fetch_categroies', (_username,))
        
        data = cursor.fetchall()
        log.info("Categories fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error fetching categories.')
    
# Baseline group related db calls
def get_baseline_groups(category_id, username):
    log.info("Fetching baseline groups")
    _username = username
    _category_id = category_id
    print(_category_id)
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_fetch_baselines_groups', (_category_id, _username,))
        # cursor.execute(""" SELECT category_id, category_name,
        #                 category_label, description, status FROM CATEGORY """)
        data = cursor.fetchall()
        log.info("Baseline groups fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error fetching baseline groups.')
    
def create_baseline_group(data, username):
    log.info("Creating baseline group")
    _baseline_group_name = data.get('group_name').lower()
    _baseline_category_id = data.get('category_id')
    _description = data.get('description')
    _username = username

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_create_baseline_group', (_baseline_category_id,_baseline_group_name,_description, _username))
        data = cursor.fetchall()
        conn.commit()
        log.info("Baseline group created successfully.")
        return 'Baseline group created successfully.'

    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error creating baseline group.')
    
def delete_baseline_group(beseline_group_id, username):
    log.info("Deleting baseline group")
    _username = username
    _baseline_group_id = beseline_group_id

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_delete_baseline_group', (_baseline_group_id, _username))
        conn.commit()
        log.info("Baseline group deleted successfully.")
        return 'Baseline group deleted successfully.'

    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error deleting baseline group.')
    
# Baseline sketch related db calls
def get_baseline_sketches(baseline_group_id, username):
    log.info("Fetching baseline sketches")
    _username = username
    _baseline_group_id = baseline_group_id

    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_fetch_baseline_sketches', (_baseline_group_id, _username))
        data = cursor.fetchall()
        # print(data)
        log.info("Baseline sketches fetched successfully.")
        return {'baseline_group_id': _baseline_group_id, 'baseline_sketches': data}
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error fetching baseline group sketches.')

def create_baseline_sketches(data, username):
    log.info("Creating baseline sketches")
    _username = username
    _baseline_group_id = data.get('baseline_group_id')
    _baseline_data = data.get('baseline_sketches')

    _baseline_data = json.dumps(_baseline_data)

    # print("_baseline_group_id", _baseline_group_id)

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_create_baseline_sketches', (_baseline_group_id, _baseline_data, _username))
        conn.commit()
        log.info("Baseline group sketches created successfully.")
        return 'Baseline group sketches created successfully.'

    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error creating baseline group sketches.')
    
def delete_baseline_sketch(baseline_id, username):
    log.info("Deleting baseline sketches")
    _username = username
    _baseline_id = baseline_id

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_delete_baseline_sketch', (_baseline_id, _username))
        conn.commit()
        log.info("Baseline group sketches deleted successfully.")
        return 'Baseline group sketches deleted successfully.'

    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error deleting baseline group sketches.')
    
# Pipeline configuration related db calls
def create_pipeline_configuration(data, username):
    log.info("Creating pipeline configuration")
    _username = username
    _category_id = data.get('category_id')
    # print(_category_id)
    _configuration_name = data.get('configuration_name').lower()
    _baseline_group_id = data.get('baseline_group_id')
    _threshold = data.get('threshold')

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_create_pipeline_configuration', (_configuration_name, _baseline_group_id, _category_id, _threshold, _username))
        conn.commit()
        log.info("Pipeline configuration created successfully.")
        return 'Pipeline configuration created successfully.'

    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error creating pipeline configuration.')
    
def get_pipeline_configurations(category_id, username):
    log.info("Fetching pipeline configurations")
    _username = username
    _category_id = category_id
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_fetch_pipeline_configurations', (_category_id, _username,))
        data = cursor.fetchall()
        log.info("Pipeline configurations fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error fetching pipeline configurations.')
    
def change_pipeline_configuration_status(configuration_id, category_id, username):
    log.info("Changing pipeline configuration status")
    _username = username
    _configuration_id = configuration_id
    _category_id = category_id

    conn = mysql.connect()
    cursor = conn.cursor()
    try:

        cursor.callproc('sp_change_pipeline_configuration_status', (_configuration_id, _category_id, _username))
        conn.commit()
        log.info("Pipeline configuration status changed successfully.")
        return 'Pipeline configuration status changed successfully.'

    except pymysql.Error as e:
        if (e.args[0] == 1001):
            log.error(e.args[1])
            raise ValueError(e.args[1])
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error changing pipeline configuration status.')\

# Pipeline result related db calls
def get_pipeline_result(configuration_id, username):
    log.info("Fetching pipeline result")
    _username = username
    _configuration_id = configuration_id
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_fetch_pipeline_result', (_configuration_id, _username,))
        data = cursor.fetchall()
        log.info("Pipeline result fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error fetching pipeline result.')
