# Angular and Flask Sketch Dataset Auto-expantion System web-app

## Overview
This project provides a web interface and backend API for managing user sketches, datasets, and user profiles. The system supports user authentication, administration of user accounts, and dataset management, including categories and pipelines. The project employs a three-tier architecture with an Angular front-end, a Flask API back-end, and a MySQL database, designed to accommodate three key user roles: Sketcher, Data Admin, and Admin.

## User Roles:
- Sketcher Role: Users can draw and submit sketches into specific categories.
- Data Admin Role: Users are responsible for maintaining system categories, baselines, and the dataset expansion pipeline.
- Admin Role: Users have responsibilities similar to Data Admins, in addition to managing other users.
## Technologies Used
### Front-end
- Angular
- Bootstrap
- NgRx for state management
### Back-end
- Flask
- Swagger for API documentation
- MySQL for database management
- APScheduler to run scheduled jobs


## Installation

1. clone this repo.


2. Set up the back-end:
- cd flaskBackend
- python -m venv venv
- source venv/bin/activate
- pip install -r requirements.txt

3. run flask back-end:
- python app.py

4. Create database Schema, Tables, and Stored Procedures using sql files in /flaskBackend/database_files.

5. Set up the front-end:
- cd sketch-app
- npm install

6. run angular front-end:
- npm start

## Backend APIs: 
- api/auth/authorization: has the login and register email verification endpoints
- api/admin/users: has the admin user management endpoints
- api/data_admin/dataset: has the data admin categories, baselines, and pipelines management endpoints
- api/user/profile: has the user profile management endpoints


