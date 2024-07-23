# SKETCHDB Schema

SKETCHDB is a MySQL database designed to manage users, categories, sketches, and pipeline configurations for a sketch dataset auto-expansion system. The database schema is divided into several tables to store user data, category information, sketches, baseline sketches, pipeline configurations, and pipeline results. The database also includes a set of stored procedures to manage user authentication, user and category management, baseline sketch management, pipeline configurations, and pipeline results.

- SKETCHDB_tables.sql: Contains the database SQL table creation statements.
- Auth_sp.sql, Sketch_sp.sql, Users_sp.sql, Dataset_expansion_sp.sql, and Pipeline_sp.sql: Contain the stored procedure creation statements.


## Database Tables

- USER table: Stores data about system users, including the user’s first and last name, username, hashed password, email, role, and status (active/inactive).
- CATEGORY table: Stores data about an object category that the system will use to expand the sketch dataset, including the category name, label, description, and status (active/inactive).
- SKETCH table: Stores data about a category sketch submitted by a user, including the sketch image binary file and sketch strokes binary file (.svg).
- BASELINE SKETCH table: Stores data about a synthetic baseline sketch from a baseline sketches group, including the baseline sketch image binary file, file name, and file extension.
- BASELINE GROUP table: Stores data about a baseline sketches group for a category, including the group name and description.
- PIPELINE CONFIGURATION table: Stores data about the category dataset auto-expansion pipeline configuration, including the baseline sketches group and similarity threshold.
- PIPELINE RESULT table: Stores data about results of the dataset auto-expansion pipeline configuration applied to the category’s user-generated sketches

## Database Stored Procedures:

### wrapper:
- sp_validate_user : used to validate user authentaion token with every REST API call

### authentaication:
- sp_validate_login : used to validate user login
- sp_register_user : used to register user
- sp_verify_email : used to verify user email

### admin user manegment: 
- sp_fetch_users : used to fetch all system users data
- sp_create_user : used to create new user in system 
- sp_update_user : used to update user data
- sp_reset_user_password : used to reset user password to temporary password
- sp_change_user_status : used to change user status to active or inactive
- sp_fetch_profile : used to fetch user profile data
- sp_update_profile : used to update user profile data 
- sp_deactivate_profile : used to deactivate user profile

### data admin category manegment:
- sp_fetch_categories : used to fetch all categories data
- sp_create_category : used to create new category
- sp_update_category : used to update category data
- sp_change_category_status : used to change category status to active or inactive

### data admin baseline manegment:
- sp_fetch_baselines_groups : used to fetch all baseline sketches groups data for a category
- sp_create_baseline_group : used to create new baseline group for a category
- sp_delete_baseline_group : used to delete baseline group
- sp_fetch_baseline_sketches : used to fetch all baseline sketches data for a baseline group
- sp_create_baseline_sketches : used to add new baseline sketch to a baseline sketches group
- sp_delete_baseline_sketch : used to delete baseline sketch from a baseline sketches group

### data admin pipline manegment:
- sp_fetch_pipline_configrations : used to fetch all pipline configrations data for a category
- sp_create_pipline_configration : used to create new pipline configration for a category
- sp_change_pipeline_configuration_status : used to change pipline configration status to active or inactive

### data admin pipline results manegment:
- sp_fetch_pipline_result : used to fetch all pipline results data for a category pipline configration

### pipline job:
- sp_get_categories_with_active_piplene : used to fetch all categories with active pipline configration
- sp_get_category_baselines : used to fetch all baseline sketches data baseline sketches group
- sp_get_category_sketch_withno_results : used to fetch all baseline sketches data with no pipline results for a pipline configration
- sp_insert_pipline_results : used to insert pipline results for a pipline configration

