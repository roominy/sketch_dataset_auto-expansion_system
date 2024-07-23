from flask import jsonify
from database.models import mysql
import pymysql
import json
import logging
log = logging.getLogger('run_pipeline_db')


def get_catgories_with_active_pipeline():
    log.info("Fetching categories with active pipeline")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_get_categories_with_active_piplene')
        data = cursor.fetchall()
        log.info("Categories fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error getting categories with active pipeline.')
    
def get_category_baselines(baseline_group_id):
    log.info("Fetching category baselines")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_get_category_baselines', (baseline_group_id,))
        data = cursor.fetchall()
        log.info("Category baselines fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error getting baselines.')
    
def sp_get_category_sketch_withno_results(category_id, configuration_id):
    log.info("Fetching category sketches")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_get_category_sketch_withno_results', (category_id, configuration_id))
        data = cursor.fetchall()
        log.info("Category sketches fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        # print(e.args[1])
        raise ValueError('Error getting category sketches.')