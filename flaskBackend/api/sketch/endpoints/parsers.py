from flask_restx import reqparse

add_args = reqparse.RequestParser()
add_args.add_argument('number1', type=int, help='number 1', default=0)
add_args.add_argument('number2', type=int, help='number 2', default=0)