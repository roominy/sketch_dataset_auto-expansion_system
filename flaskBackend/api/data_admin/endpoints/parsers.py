from flask_restx import reqparse

category_arg = reqparse.RequestParser()
category_arg.add_argument('categoryId', type=int, help='Category Id', required=True)

baseline_group_arg = reqparse.RequestParser()
baseline_group_arg.add_argument('groupId', type=int, help='Baseline group Id', required=True)


baseline_arg = reqparse.RequestParser()
baseline_arg.add_argument('baselineId', type=int, help='Baseline Id', required=True)

pipeline_configuration_arg = reqparse.RequestParser()
pipeline_configuration_arg.add_argument('configurationId', type=int, help='Pipeline configuration Id', required=True)

category_pipeline_configuration_arg = reqparse.RequestParser()
category_pipeline_configuration_arg.add_argument('categoryId', type=int, help='Category Id', required=True)
category_pipeline_configuration_arg.add_argument('configurationId', type=int, help='Pipeline configuration Id', required=True)



