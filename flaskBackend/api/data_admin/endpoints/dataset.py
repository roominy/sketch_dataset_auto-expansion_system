
import logging

from flask import request
from flask_restx import Resource

# from api.admin.endpoints.parsers import add_args
from api.data_admin.endpoints.serializers import add_category, category, baseline_group, baseline_sketches, pipeline_configuration
from api.data_admin.endpoints.parsers import category_arg, baseline_group_arg, baseline_arg, pipeline_configuration_arg, category_pipeline_configuration_arg
from api.utils import token_required, data_admin_required
from flask import g 
from api.data_admin.business.db_calls import create_category, get_categories, edit_category, change_category_status
from api.data_admin.business.db_calls import create_baseline_group, get_baseline_groups, get_baseline_sketches
from api.data_admin.business.db_calls import create_baseline_sketches , delete_baseline_sketch, delete_baseline_group
from api.data_admin.business.db_calls import get_pipeline_configurations, create_pipeline_configuration, change_pipeline_configuration_status
from api.data_admin.business.db_calls import get_pipeline_result
from run_pipeline import run_pipeline, get_catgories_with_active_pipeline
from api.restx import  data_admin_api as api



from api.data_admin.business.cron_db_calls import get_catgories_with_active_pipeline, get_category_baselines, sp_get_category_sketch_withno_results 

log = logging.getLogger('api_data_admin')

ns = api.namespace('dataset', description='dataset admin operations', path='/dataset')

# Categories Calls

@ns.route('/addCategory')
class AddCategory(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(add_category)
    @ns.doc(security='Bearer')
    @data_admin_required
    def post(self):
        """
        add category
        """
        log.info("add category called")
        data = request.json
        username = g.user.get('username')
        result = create_category(data, username)
        log.info("category added")
        return {'message': result }, 200
    
@ns.route('/editCategory')
class EditCategory(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(category)
    @ns.doc(security='Bearer')
    @data_admin_required
    def post(self):
        """
        edit category
        """
        log.info("edit category called")
        data = request.json
        username = g.user.get('username')
        result = edit_category(data, username)
        log.info("category edited")
        return {'message': result }, 200
    
@ns.route('/changeCategoryStatus')
class ChangeCategoryStatus(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(category)
    @ns.doc(security='Bearer')
    @data_admin_required
    def post(self):
        """
        change category status
        """
        log.info("change category status called")
        data = request.json
        username = g.user.get('username')
        result = change_category_status(data, username)
        log.info("category status changed")
        return {'message': result }, 200


@ns.route('/getCategories')
class GetCategory(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @token_required
    def get(self):
        """
        get categories
        """
        log.info("get categories called")
        # print(g.user, "user")
        
        username = g.user.get('username')  # todo: add username check
        result = get_categories(username)
        log.info("categories fetched")
        return  result, 200 

# Baselines Groups Calls

@ns.route('/addBaselineGroup')
class AddCategory(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(baseline_group)
    @ns.doc(security='Bearer')
    @data_admin_required
    def post(self):
        """
        add category
        """
        log.info("add baseline group called")
        data = request.json
        username = g.user.get('username')
        result = create_baseline_group(data, username)
        log.info("baseline group added")
        return {'message': result }, 200 


@ns.route('/getBaselineGroups')
class GetBaselinesGroups(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.doc(parser=category_arg)
    @token_required
    def get(self):
        """
        get baselines groups
        """
        log.info("get baseline groups called")
        args = category_arg.parse_args()
        category_id =  args.get('categoryId')
        # print(g.user, "user")
        

        username = g.user.get('username')  # todo: add username check
        result = get_baseline_groups(category_id, username)
        log.info("baseline groups fetched")
        return  result, 200 


@ns.route('/deleteBaselineGroup')
class DeleteBaselinesGroup(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.doc(parser=baseline_group_arg)
    @token_required
    def get(self):
        """
        delete baselines group
        """
        log.info("delete baseline group called")
        args = baseline_group_arg.parse_args()
        beseline_group_id = args.get('groupId')
        # print(g.user, "user")
        username = g.user.get('username')

        result = delete_baseline_group(beseline_group_id, username)
        log.info("baseline group deleted")
        return {'message': result }, 200
 

# Baselines Sketches Calls 
@ns.route('/addBaslineGroupSketches')
class AddBaslinesSketches(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.expect(baseline_sketches)
    @ns.doc(security='Bearer')
    @token_required
    def post(self):
        """
        add baselines sketches
        """
        log.info("add baseline sketches called")
        data = request.json
        # print(data)
        # print("baseline_group_id =", data['baseline_group_id'])
        # print(g.user, "user")
        username = g.user.get('username')

        result = create_baseline_sketches(data, username)
        log.info("baseline sketches added")
        return {'message': result }, 200 


@ns.route('/getBaselineGroupSketches')
class GetCategory(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.doc(parser=baseline_group_arg)
    @token_required
    def get(self):
        """
        get categories
        """
        log.info("get baseline sketches called")
        args = baseline_group_arg.parse_args()
        baseline_group_id = args.get('groupId')
        # print(g.user, "user")
        

        username = g.user.get('username')  # todo: add username check
        result = get_baseline_sketches(baseline_group_id, username)
        log.info("baseline sketches fetched")
        return  result, 200 


@ns.route('/deleteBaselineGroupSketch')
class DeleteBaselinesSketch(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.doc(parser=baseline_arg)
    @token_required
    def get(self):
        """
        delete baselines sketches
        """
        log.info("delete baseline sketch called")
        args = baseline_arg.parse_args()
        baseline_id = args.get('baselineId')
        # print(g.user, "user")
        username = g.user.get('username')

        result = delete_baseline_sketch(baseline_id, username)
        log.info("baseline sketch deleted")
        return {'message': result }, 200
    
# Pipeline configuration Calls
@ns.route('/addPipelineConfiguration')
class AddPipelineConfiguration(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.expect(pipeline_configuration)
    @token_required
    def post(self):
        """
        add pipeline configuration
        """
        log.info("add pipeline configuration called")
        data = request.json
        # print(data)
        # print(g.user, "user")
        username = g.user.get('username')

        result = create_pipeline_configuration( data, username)


        log.info("pipeline configuration added")
        return {'message': result }, 200
    
@ns.route('/getPipelineConfigurations')
class GetPipelineConfigurations(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.doc(parser=category_arg)
    @token_required
    def get(self):
        """
        get pipeline configurations
        """
        log.info("get pipeline configurations called")  
        # print(g.user, "user")
        
        args = category_arg.parse_args()
        category_id =  args.get('categoryId')
        username = g.user.get('username')
        result = get_pipeline_configurations(category_id,username)
        log.info("pipeline configurations fetched")
        return  result, 200
    
@ns.route('/changePipelineConfigurationStatus')
class ChangePipelineConfigurationStatus(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.doc(parser=category_pipeline_configuration_arg)
    @token_required
    def get(self):
        """
        change pipeline configuration status
        """
        log.info("change pipeline configuration status called")
        args = category_pipeline_configuration_arg.parse_args()
        category_id = args.get('categoryId')
        configuration_id = args.get('configurationId')
        # print(g.user, "user")
        username = g.user.get('username')

        result = change_pipeline_configuration_status(configuration_id,category_id, username)
        log.info("pipeline configuration status changed")
        return {'message': result }, 200
    
# Pipeline result Calls
@ns.route('/getPipelineResult')
class GetPipelineResult(Resource):
    @ns.response(200, 'Success')
    @ns.response(400, 'Error')
    @ns.doc(security='Bearer')
    @ns.doc(parser=pipeline_configuration_arg)
    @token_required
    def get(self):
        """
        get pipeline result
        """
        log.info("get pipeline result called")
        args = pipeline_configuration_arg.parse_args()
        configuration_id = args.get('configurationId')
        # print(g.user, "user")
        username = g.user.get('username')

        result = get_pipeline_result(configuration_id, username)
        log.info("pipeline result fetched")
        return  result, 200
    
# # cron job calls
# @ns.route('/getCatgoriesWithActivePipeline')
# class GetCatgoriesWithActivePipeline(Resource):
#     @ns.response(200, 'Success')
#     @ns.response(400, 'Error')
#     def get(self):
#         """
#         get categories with active pipeline
#         """
#         log.info("get categories with active pipeline called")
#         result = get_catgories_with_active_pipeline()
#         log.info("categories with active pipeline fetched")
#         return  result, 200
    
# @ns.route('/getCategoryBaselines')
# class GetCategoryBaselines(Resource):
#     @ns.response(200, 'Success')
#     @ns.response(400, 'Error')
#     @ns.doc(parser=baseline_group_arg)
#     def get(self):
#         """
#         get category baselines
#         """
#         log.info("get category baselines called")
#         args = baseline_group_arg.parse_args()
#         baseline_group_id = args.get('groupId')

#         result = get_category_baselines(baseline_group_id)
#         log.info("category baselines fetched")
#         return  result, 200
    
# @ns.route('/getCategorySketchWithNoResults')
# class GetCategorySketchWithNoResults(Resource):
#     @ns.response(200, 'Success')
#     @ns.response(400, 'Error')
#     @ns.doc(parser=category_pipeline_configuration_arg)
#     def get(self):
#         """
#         get category sketch with no results
#         """
#         log.info("get category sketch with no results called")
#         args = category_pipeline_configuration_arg.parse_args()
#         category_id = args.get('categoryId')
#         configuration_id = args.get('configurationId')

#         result = sp_get_category_sketch_withno_results(category_id, configuration_id)
#         log.info("category sketch with no results fetched")
#         return  result, 200
    
# @ns.route('/runPipeline')
# class RunPipeline(Resource):
#     @ns.response(200, 'Success')
#     @ns.response(400, 'Error')
#     def get(self):
#         """
#         run pipeline
#         """
#         log.info("run pipeline called")
#         # print('run pipeline')

#         result = run_pipeline()

#         log.info("pipeline run")
#         return  result, 200
    

    


    



    

    

