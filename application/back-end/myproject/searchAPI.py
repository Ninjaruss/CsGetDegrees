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


def search(q):
    conn, cursor = setupConnection()
    cursor.execute("select * from Product")
    allproducts = cursor.fetchall()
    jsonArray = []
    for element in allproducts:
        jsonArray.append(json.dumps(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
             'description': element[5], 'product_creator': element[6], 'product_buyer': element[7]}))
    return structureIntoValidJson(jsonArray)

def retrieveProductsByName(productName):
    productTableNameQuery = "select * from Product where name = \'" + productName + "\'"
    conn, cursor = setupConnection()
    cursor.execute(productTableNameQuery)
    productmatches = cursor.fetchall()
    conn.close()
    jsonArray = []
    for element in productmatches:
        jsonArray.append(json.dumps({'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4], 'description': element[5], 'product_creator': element[6], 'product_buyer': element[7]}))
    return structureIntoValidJson(jsonArray)

def structureIntoValidJson(jsonArray):
    jsonStructure = "{\n\"data\": ["
    for i in jsonArray:
        jsonStructure = jsonStructure + "\n"
        jsonStructure = jsonStructure + i + ", "
    jsonStructure = jsonStructure[:-2]
    jsonStructure = jsonStructure + "\n]\n}"
    return jsonStructure
