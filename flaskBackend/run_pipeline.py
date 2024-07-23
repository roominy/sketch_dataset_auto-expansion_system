

from database.models import mysql
from flask import jsonify
import json
import logging
import numpy as np
import os
import pandas as pd
from PIL import Image
import pymysql
from resnet.datasets import SketchDataset
from resnet.models import ResNet18WithDropout
import settings
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms



log = logging.getLogger("run_pipeline")



def get_catgories_with_active_pipeline():
    log.info("Fetching categories with active pipeline")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_get_categories_with_active_piplene')
        data = cursor.fetchall()
        print("data", data)
        log.info("Categories fetched successfully.")
        return data
    except pymysql.Error as e:
        log.error(e.args[1])
        print(e.args[1])
        raise ValueError('Error getting categories with active pipeline.')
    
def get_category_baselines(baseline_group_id):
    log.info("Fetching category baselines")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    # cursor = conn.cursor()
    try:
        cursor.callproc('sp_get_category_baselines', (baseline_group_id,))
        data = cursor.fetchall()
        
        data = pd.DataFrame(data) 
        
        baselines = data['sketch'].values
        ids = data['id'].values
        log.info("Category baselines fetched successfully.")
        return baselines, ids
    except pymysql.Error as e:
        log.error(e.args[1])
        print(e.args[1])
        raise ValueError('Error getting baselines.')
    
def sp_get_category_sketch_withno_results(category_id, configuration_id):
    log.info("Fetching category sketches")
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.callproc('sp_get_category_sketch_withno_results', (category_id, configuration_id))
        data = cursor.fetchall()

        data = pd.DataFrame(data)

        sketches = data['sketch'].values
        ids = data['id'].values
        log.info("Category sketches fetched successfully.")
        return sketches, ids
    except pymysql.Error as e:
        log.error(e.args[1])
        print(e.args[1])
        raise ValueError('Error getting category sketches.')
    
def add_pipeline_results(results):
    log.info("Adding pipeline results")
    conn = mysql.connect()
    cursor = conn.cursor()
    print("results", results, type(results))
    _results_json = json.dumps(results)
    print("Formatted JSON:", _results_json)
    try:
        cursor.callproc('sp_insert_pipline_results', (_results_json,))
        conn.commit()
        log.info("Pipeline results added successfully.")
    except pymysql.Error as e:
        log.error(e.args[1])
        print(e.args[1])
        raise ValueError('Error adding pipeline results.')
    
def load_model(model_path, device):
    log.info("Loading model")
    model = ResNet18WithDropout(pretrained=True)
    loaded_checkpoint = torch.load(model_path, map_location=device)
    # Assume you have a method to load your trained model weights
    model.load_state_dict(loaded_checkpoint["state_dict"])
    model.eval()
    log.info("Model loaded successfully.")
    return model.to(device)

# def encode_skeches(model, sketches, sketches_ids, global_transform, device):
def encode_skeches(model, sketches, sketches_ids, device):
    log.info("Encoding sketches")   
    # sketch_dataset = SketchDataset(sketches, sketches_ids, settings.GLOBAL_DATASET_MEAN, settings.GLOBAL_DATASET_STD ,global_transform)
    sketch_dataset = SketchDataset(sketches, sketches_ids, settings.GLOBAL_DATASET_MEAN, settings.GLOBAL_DATASET_STD )
    dataloader =  DataLoader(sketch_dataset, batch_size=32, shuffle=False, num_workers=4)

    encodings = []    
    sketch_ids = []
    with torch.no_grad():
        for images , ids in iter(dataloader):
            images = images.to(device)
            features = model(images)
            encodings.append(features.cpu().numpy())
            sketch_ids.append(ids.cpu().numpy())
    log.info("Sketches encoded successfully.")
    return np.concatenate(encodings, axis=0) , np.concatenate(sketch_ids, axis=0)

def run_pipeline():
    log.info("Running pipeline")

    device = torch.device('cuda:'+settings.GPU if torch.cuda.is_available() else 'cpu')

    # global_transform = transforms.Compose([
    #     transforms.Resize((180, 180)),
    #     transforms.Grayscale(),
    #     transforms.Lambda(lambda img: Image.fromarray(255 - np.array(img))),  # Invert colors
    #     transforms.ToTensor()
    # ])

    try:
        model = load_model(settings.MODEL_PATH, device)
        cos = nn.CosineSimilarity(dim=0, eps=1e-8)
        categories = get_catgories_with_active_pipeline()
        for category in categories:
            print("category", category)
            category_id = category['category_id']
            configuration_id = category['configuration_id']
            theshold = category['threshold']
            print("category_id", category['category_id'])
            print("configuration_id", category['configuration_id'])
            baselines, baselines_ids = get_category_baselines(category_id)
            print
            # encoded_baselines, _ = encode_skeches(model, baselines, baselines_ids, global_transform, device)
            encoded_baselines, _ = encode_skeches(model, baselines, baselines_ids, device)
            sketches, skatches_ids = sp_get_category_sketch_withno_results(category_id, configuration_id)
            # encoded_sketches, sketch_ids = encode_skeches(model, sketches, skatches_ids, global_transform, device)
            encoded_sketches, sketch_ids = encode_skeches(model, sketches, skatches_ids, device)
            sketches_results = []
            for sketch, sketch_id in zip(encoded_sketches, sketch_ids):
                baselines_scores = []
                for baseline in encoded_baselines:
                    similarity = cos(torch.from_numpy(sketch), torch.from_numpy(baseline))
                    baselines_scores.append(similarity.item())
                result = 'positive' if max(baselines_scores) >= theshold  else 'negative'
                sketch_result = { "sketch_id": int(sketch_id),
                                "configuration_id": int(configuration_id),
                                "result": result }
                sketches_results.append(sketch_result)

            print("sketches_results", sketches_results)
            add_pipeline_results(sketches_results)

        log.info("Pipeline run successfully.")

    except Exception as e:
        log.error(e)
        print(e)


