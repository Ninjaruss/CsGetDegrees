import mysql.connector
from flask import jsonify
from APIfolder import productsAPI
from APIfolder import departmentsAPI
from APIfolder import usersAPI
from APIfolder import classesAPI
from APIfolder import messagesAPI
from APIfolder import searchAPI
import json
import base64
import flask
from flask import Flask
from flask import request
import redis
import datetime


application = Flask(__name__)


def setupConnection():
    conn = mysql.connector.connect(
         user='aramis',
         password='CsGetDegrees648!',
         host='localhost',
         database='CsGetDegrees',
         auth_plugin='mysql_native_password')
    cursor = conn.cursor()
    return conn, cursor


@application.route("/createAcc", methods=['POST'])
def createAccount():
    connection, cursor = setupConnection()
    return structureIntoValidJson(usersAPI.new_user_creation(request, connection, cursor))


@application.route("/login", methods=['GET'])
def loginUser():
    conn, cursor = setupConnection()
    return structureIntoValidJson(usersAPI.validation_by_user_info_and_password(request, conn, cursor))


@application.route("/adminLogin", methods=['GET','OPTIONS'])
def adminLogin():
    print("Attempting to validate admin user")
    conn, cursor = setupConnection()
    return structureIntoValidJson(usersAPI.admin_validation_by_user_info_and_password(request, conn, cursor))


@application.route("/user/", methods=['GET'])
def user_management():
    with application.app_context():
        if 'getUserbyUserid' in request.args:
            conn, cursor = setupConnection()
            log, data = usersAPI.retrieveUsersByUid(request, conn, cursor)
            return jsonify(data=data, log=log)
        elif 'getUserbyProductid' in request.args:
            conn, cursor = setupConnection()
            log, data = usersAPI.retrieveUsersByPid(request, conn, cursor)
            return jsonify(data=data, log=log)


@application.route("/admin/getToApprovProduct", methods=['GET'])
def getNotApprovedProducts():
    conn, cursor = setupConnection()
    log, data = productsAPI.get_not_approved_products(request, conn, cursor)
    return jsonify(data=data, log=log)


@application.route('/admin', methods=['GET', 'POST'])
def approveProduct():
    with application.app_context():
        if 'removeUser' in request.args:
            conn, cursor = setupConnection()
            log, data = usersAPI.delete_users(request, conn, cursor)
            return jsonify(data=data, log=log)
        elif 'approveProduct' in request.args:
            conn, cursor = setupConnection()
            log, data, success  = productsAPI.approveProducts(request, conn, cursor)
            return jsonify(data=data, log=log, success=success)
        elif 'removeProduct' in request.args:
            conn, cursor = setupConnection()
            log, data = productsAPI.delete_products(request, conn, cursor)
            return jsonify(data=data, log=log)
        elif 'addDep' in request.args:
            conn, cursor = setupConnection()
            log, data, success = departmentsAPI.new_department_creation(request, conn, cursor)
            return jsonify(data=data, log=log, success=success)
        elif 'rmDep' in request.args:
            conn, cursor = setupConnection()
            log, data = departmentsAPI.delete_department(request, conn, cursor)
            return jsonify(data=data, log=log)
        elif 'addCou' in request.args:
            conn, cursor = setupConnection()
            log, data, success = classesAPI.new_class_creation(request, conn, cursor)
            return jsonify(data=data, log=log, success=success)
        elif 'addCat' in request.args:
            conn, cursor = setupConnection()
            log, data, success = productsAPI.new_category_creation(request, conn, cursor)
            return jsonify(data=data, log=log, success=success)
        elif 'rmCou' in request.args:
            conn, cursor = setupConnection()
            log, data = classesAPI.delete_class(request, conn, cursor)
            return jsonify(data=data, log=log)
        elif 'getSearchedProduct' in request.args:
            conn, cursor = setupConnection()
            log, data = productsAPI.get_product_by_name(request, conn, cursor)
            return jsonify(data=data, log=log)
        elif 'getSearchedUser' in request.args:
            conn, cursor = setupConnection()
            log, data = usersAPI.get_user_by_username(request, conn, cursor)
            return jsonify(data=data, log=log)
        elif 'getAllProductbyUserid' in request.args:
            conn, cursor = setupConnection()
            log, data, success = productsAPI.retrieveProductsByUid(request.args.get('getAllProductbyUserid'), conn, cursor)
            return jsonify(data=data, log=log, success=success)


@application.route("/search/", methods=['GET'])
def search():
    with application.app_context():
        conn, cursor = setupConnection()
        log, data = searchAPI.filter_and_search(request, conn, cursor)
        return jsonify(data=data, log=log)


@application.route("/list/", methods=['GET'])
def listItems():
    with application.app_context():
        if 'getCategory' in request.args:
            print("getCategories is in the arguments array")
            conn, cursor = setupConnection()
            return structureIntoValidJson(productsAPI.retrieveProductCategories(cursor))
        elif 'getDepartment' in request.args:
            print("getDepartments is in the arguments array")
            conn, cursor = setupConnection()
            return structureIntoValidJson(departmentsAPI.retrieveDepartmentNames(cursor))
        elif 'getCourse' in request.args:
            print("getCourse is in the arguments array")
            conn, cursor = setupConnection()
            return structureIntoValidJson(classesAPI.retrieveClassNames(cursor))
        elif 'getCourseByDepartment' in request.args:
            print("getCourseByDepartment is in the arguments array")
            departmentName = request.args.get('getCourseByDepartment')
            conn, cursor = setupConnection()
            return structureIntoValidJson(classesAPI.retrieveClassByDepartmentName(departmentName, cursor))


@application.route('/admin/createDepartment', methods=['POST'])
def createDepartment():
    with application.app_context():
        conn, cursor = setupConnection()
        log, data = departmentsAPI.new_department_creation(request, conn, cursor)
        return jsonify(log=log, data=data)


@application.route('/product/createProduct', methods=['POST'])
def createProduct():
    with application.app_context():
        conn, cursor = setupConnection()
        log, data, success = productsAPI.createProduct(request, conn, cursor)
        return jsonify(data=data, log=log, success=success)


@application.route('/product/', methods=['GET'])
def product_management():
    with application.app_context():
        if 'getProductbyProductid' in request.args:
            keyword = request.args.get("getProductbyProductid")
            conn, cursor = setupConnection()
            log, data, success = productsAPI.retrieveProductsByPid(keyword, conn, cursor)
            return jsonify(data=data, log=log, success=success)
        elif 'getAllProductbyUserid' in request.args:
            keyword = request.args.get("getAllProductbyUserid")
            conn, cursor = setupConnection()
            log, data, success = productsAPI.retrieveProductsByUid(keyword, conn, cursor)
            return jsonify(data=data, log=log, success=success)


@application.route('/message/sendMessage', methods=['POST'])
def sendMessage():
    with application.app_context():
        conn, cursor = setupConnection()
        log, data = messagesAPI.create_message(request, conn, cursor)
        return jsonify(data=data, log=log)


@application.route('/message/getContact', methods=['GET'])
def getContact():
    with application.app_context():
        conn, cursor = setupConnection()
        log, data = messagesAPI.get_contacts(request, conn, cursor)
        return jsonify(data=data, log=log)


@application.route('/category/getAllCategories', methods=['GET'])
def getAllCategories():
    with application.app_context():
        log, data = searchAPI.getAllCategories()
        return jsonify(data=data, log=log)


@application.route('/message/getChat', methods=['GET'])
def getChat():
    with application.app_context():
        conn, cursor = setupConnection()
        log, data = messagesAPI.get_chat(request, conn, cursor)
        return jsonify(data=data, log=log)


@application.route('/product/purchase', methods=['POST'])
def purchaseProduct():
    with application.app_context():
        conn, cursor = setupConnection()
        log, data, success = productsAPI.purchaseProduct(request.form.get('productId'), conn, cursor)
        return jsonify(data=data, log=log, success=success)

def structureIntoValidJson(jsonArray):
    jsonStructure = "{\n\"data\": ["
    for i in jsonArray:
        jsonStructure = jsonStructure + "\n"
        jsonStructure = jsonStructure + i + ", "
    jsonStructure = jsonStructure[:-2]
    jsonStructure = jsonStructure + "\n]\n}"
    return jsonStructure


# @application.route('/createAcc', methods=['GET', 'POST'])


# @application.route('/login', methods=['GET', 'POST'])

if __name__ == "__main__":
    application.run(host='0.0.0.0')

