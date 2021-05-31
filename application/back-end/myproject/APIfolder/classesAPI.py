import mysql.connector
from flask import jsonify
import json
from flask import Flask
from flask import request
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


# Adds a new class into the database table
def new_class_creation(req, conn, cursor):
    if req.method == 'POST':
        n_course_number = req.form.get('num')
        n_name = req.form.get('param')
        n_desc = req.form.get('desc')
        n_department_abbr = request.form.get('deptAbbr')
        department_id_query = "SELECT did FROM Department WHERE abbreviation = \'" + n_department_abbr + "\'"

        try:
            cursor.execute(department_id_query)
            n_department_id = cursor.fetchone()[0]
            new_class_insert_query = "INSERT INTO Class (course_number, `name`, `desc`, department_id) VALUES (%s, %s, %s, %s)"
            new_class_values = (n_course_number, n_name, n_desc, n_department_id)
            cursor.execute(new_class_insert_query, new_class_values)
            conn.commit()
            conn.close()
            return "Successfully created class.", None, True
        except Exception as e:
            return "Failed to create class. (" + str(e) + ") couQ: " + str(new_class_values), None, False
    else:
        return "Failed to create class. (POST Failed)", None, False


# Deletes an existing message in the database
def delete_class(req, conn, cursor):
    if req.method == 'POST':
        c_name = req.form.get('param')
        delete_class_query = "DELETE FROM Class WHERE `name` = \'" + c_name + "\'"
        try:
            cursor.execute(delete_class_query)
            conn.commit()
            conn.close()
            if cursor.rowcount == 0:
                return "Did not find class to delete.", None
            else:
                return "Successfully deleted class. [c_name:" + c_name + "]", None
        except Exception as e:
            return "Failed to delete class. (" + str(e) + ")", None
    else:
        return "Failed to delete class. (POST Failed)", None


# Deletes an existing class from the database table
def RemoveClassByID(cid):
    class_removal_query = "DELETE FROM Class WHERE cid = \'" + cid + "\'"
    conn, cursor = setupConnection()
    cursor.execute(class_removal_query)
    conn.commit()
    conn.close
    return {"class_removed": True}


def retrieveClassNames(cursor):
    classNameQuery = "SELECT DISTINCT name FROM Class"
    cursor.execute(classNameQuery)
    classNames = cursor.fetchall()
    jsonArray = []
    for element in classNames:
        jsonArray.append(json.dumps({'class': element[0]}))
    return jsonArray


# Fetch all classes that are under a specific Department
def FetchAllClassesByDeptID(did):
    class_from_dept_query = "SELECT * FROM Class USE INDEX(department_id) WHERE did = \'" + did + "\'"
    conn, cursor = setupConnection()
    cursor.execute(class_from_dept_query)
    classes_data = cursor.fetchall()
    jsonArray = []
    for element in classes_data:
        jsonArray.append(json.dumps({'cid': element[0], 'course_number': element[1], 'name': element[2], 'desc': element[3], 'department_id': element[4]}))
    return structureIntoValidJson(jsonArray)


def FetchClassByID(cid):
    class_by_id_query = "SELECT * FROM Class WHERE cid = \'" + cid + "\'"
    conn, cursor = setupConnection()
    cursor.execute(class_by_id_query)
    class_data = cursor.fetchall()
    jsonArray = []
    for element in class_data:
        jsonArray.append(json.dumps(
            {'cid': element[0], 'course_number': element[1], 'name': element[2], 'desc': element[3],
             'department_id': element[4]}))
    return structureIntoValidJson(jsonArray)


def FetchClassByCourseNum(course_number):
    class_by_coursenum_query = "SELECT * FROM Class WHERE course_number = \'" + course_number + "\'"
    conn, cursor = setupConnection()
    cursor.execute(class_by_coursenum_query)
    class_data = cursor.fetchall()
    jsonArray = []
    for element in class_data:
        jsonArray.append(json.dumps(
            {'cid': element[0], 'course_number': element[1], 'name': element[2], 'desc': element[3],
             'department_id': element[4]}))
    return structureIntoValidJson(jsonArray)


def FetchClassByCourseName(name):
    class_by_name_query = "SELECT * FROM Class WHERE name = \'" + name + "\'"
    conn, cursor = setupConnection()
    cursor.execute(class_by_name_query)
    class_data = cursor.fetchall()
    jsonArray = []
    for element in class_data:
        jsonArray.append(json.dumps(
            {'cid': element[0], 'course_number': element[1], 'name': element[2], 'desc': element[3],
             'department_id': element[4]}))
    return structureIntoValidJson(jsonArray)


def retrieveClassByDepartmentName(departmentName, cursor):
    classByDepartmentQuery = "SELECT did from Department where Department.name='{}'".format(departmentName)
    print(classByDepartmentQuery)
    cursor.execute(classByDepartmentQuery)
    departmentArray = cursor.fetchall()
    print(departmentArray[0])
    did = departmentArray[0][0]
    classQuery = "SELECT * from Class where Class.department_id='{}'".format(did)
    cursor.execute(classQuery)
    classArray = cursor.fetchall()
    print("Class array contents: ", classArray)
    jsonArray = []
    for element in classArray:
        jsonArray.append(json.dumps(
            {'course': element[1]}))
    return jsonArray


def structureIntoValidJson(jsonArray):
    jsonStructure = "{\n\"data\": ["
    for i in jsonArray:
        jsonStructure = jsonStructure + "\n"
        jsonStructure = jsonStructure + i + ", "
    jsonStructure = jsonStructure[:-2]
    jsonStructure = jsonStructure + "\n]\n}"
    return jsonStructure
