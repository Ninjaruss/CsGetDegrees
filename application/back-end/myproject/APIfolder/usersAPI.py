import mysql.connector
from flask import jsonify
import json
import base64
from flask import Flask
from flask import request
application = Flask(__name__)


def validation_by_user_info_and_password(req, conn, cursor):
    if req.method == 'GET':
        print('Get request received')
        print(req.headers.get('authorization'))
        authHeader = req.headers.get('authorization')
        hashedData = authHeader[6:]
        userData = base64.b64decode(hashedData)
        userMatch, passMatch = userData.split(':')
        print(userMatch)
        print(passMatch)
        if "@" in userMatch:
            userTableEmailPassQuery = "select * from User where email = \'" + userMatch + "\' and password = MD5( \'" + passMatch + "\')"
            cursor.execute(userTableEmailPassQuery)
            emailpassmatches = cursor.fetchall()
            conn.close()
            if len(emailpassmatches) == 0:
                return [json.dumps({"auth_successful": False})]
            else:
                user_for_email = emailpassmatches[0]
                uid_for_email = user_for_email[0]
                return [json.dumps({'uid': uid_for_email, "auth_successful": True})]
        else:
            userTableUsernamepassQuery = "select * from User where username = \'" + userMatch + "\' and password = MD5( \'" + passMatch + "\')"
            cursor.execute(userTableUsernamepassQuery)
            usernamepassmatches = cursor.fetchall()
            conn.close()
            if len(usernamepassmatches) == 0:
                return [json.dumps({"auth_successful": False})]
            else:
                user = usernamepassmatches[0]
                uid = user[0]
                return [json.dumps({'uid': uid, "auth_successful": True})]
    else:
        pass


def admin_validation_by_user_info_and_password(req, conn, cursor):
    print('Get request received')
    for header in req.headers:
        print(header)
    authHeader = req.headers.get('authorization')
    hashedData = authHeader[6:]
    userData = base64.b64decode(hashedData)
    userMatch, passMatch = userData.split(':')
    print(userMatch)
    print(passMatch)
    if "@" in userMatch:
        userTableEmailPassQuery = "select * from User where email = \'" + userMatch + "\' and password = MD5( \'" + passMatch + "\') and isadmin = \'" + "1" + "\'"
        print(userTableEmailPassQuery)
        cursor.execute(userTableEmailPassQuery)
        emailpassmatches = cursor.fetchall()
        conn.close()
        if len(emailpassmatches) == 0:
            return [json.dumps({"auth_successful": False})]
        else:
            user_for_email = emailpassmatches[0]
            uid_for_email = user_for_email[0]
            return [json.dumps({'uid': uid_for_email, "auth_successful": True})]
    else:
        userTableUsernamepassQuery = "select * from User where username = \'" + userMatch + "\' and password = MD5( \'" + passMatch + "\') and isadmin = \'" + "1" + "\'"
        cursor.execute(userTableUsernamepassQuery)
        usernamepassmatches = cursor.fetchall()
        if len(usernamepassmatches) == 0:
            return [json.dumps({"auth_successful": False})]
        else:
            user = usernamepassmatches[0]
            uid = user[0]
            return [json.dumps({'uid': uid, "auth_successful": True})]


def new_user_creation(req, connection, cursor):
    authHeader = req.headers.get('authorization')
    hashedData = authHeader[6:]
    userData = base64.b64decode(hashedData)
    s_username, s_password = userData.split(':')
    n_email = req.form.get('email')
    print("Created email: " + n_email)
    n_username = s_username
    n_password = s_password
    new_user_insert_query = "INSERT INTO User (password, email, username) VALUES (MD5(%s), %s, %s)"
    new_user_values = (n_password, n_email, n_username)
    cursor.execute(new_user_insert_query, new_user_values)
    connection.commit()
    connection.close()
    return [json.dumps({"user_created": True})]


# Deletes multiple users in the database
def delete_users(req, conn, cursor):
    if req.method == 'POST':
        user_table = req.form.getlist('param')
        try:
            for uid in user_table:
                delete_user_query = "DELETE FROM User WHERE uid = \'" + uid + "\'"
                cursor.execute(delete_user_query)
                conn.commit()
            conn.close()

            if cursor.rowcount == 0:
                return "Did not find users to delete.", None
            else:
                return "Successfully deleted users. (uidTable: " + str(user_table) + ")", None
        except Exception as e:
            return "Failed to delete users. (" + str(e) + ")", None
    else:
        return "Failed to delete users. (POST Failed)", None


def get_user_by_username(req, conn, cursor):
    if req.method == 'GET':
        u_name = req.args.get("getSearchedUser")
        get_user_query = "SELECT * FROM User WHERE username LIKE \'" + "%" + u_name + "%" + "\'"
        try:
            if u_name == "all":
                get_user_query = "SELECT * FROM User"
            cursor.execute(get_user_query)
            user_matches = cursor.fetchall()
            conn.close()
            jsonArray = []
            for element in user_matches:
                jsonArray.append(
                    {'uid': element[0], 'email': element[2], 'username': element[2], 'isAdmin': element[3]})
            if len(jsonArray) == 0:
                return "Did not find any users with matching name. [u_name: " + u_name + "]", None
            else:
                return "Found users.", jsonArray
        except Exception as e:
            return "Failed to get users. (" + str(e) + ")"
    else:
        return "Failed to get users. (GET Failed)"


def retrieveUserssByUsername(usernameMatch, cursor):
    userTableUsernameQuery = "select * from User where username = \'" + usernameMatch + "\'"
    cursor.execute(userTableUsernameQuery)
    usernamematches = cursor.fetchall()
    jsonArray = []
    for element in usernamematches:
        jsonArray.append(json.dumps(
        {'uid': element[0], 'email': element[2], 'username': element[3]}))
    return jsonArray


# Get user from userID
def retrieveUsersByUid(req, conn, cursor):
    if req.method == "GET":
        uid = req.args.get("getUserbyUserid")
        user_search_by_uid_query = "SELECT * FROM User WHERE uid = \'" + uid + "\'"
        try:
            cursor.execute(user_search_by_uid_query )
            uid_matches = cursor.fetchall()
            conn.close()
            jsonArray = []
            for element in uid_matches:
                jsonArray.append({'uid': element[0], 'email': element[2], 'username': element[3]})
            if len(jsonArray) == 0:
                return "No user found. [uid: " + str(uid) + "]"
            else:
                return "User found from uid.", jsonArray
        except Exception as e:
            return "Failed to find user from uid. (" + str(e) + ")", None
    else:
        return "Failed to find user from uid. (GET Failed)", None


# Get user from productID by getting product's product_creator field
def retrieveUsersByPid(req, conn, cursor):
    if req.method == "GET":
        pid = req.args.get("getUserbyProductid")
        user_search_by_pid_query = "SELECT * FROM User WHERE uid IN (SELECT product_creator FROM Product WHERE pid = \'" + pid + "\')"
        try:
            cursor.execute(user_search_by_pid_query )
            uid_matches = cursor.fetchall()
            conn.close()
            jsonArray = []
            for element in uid_matches:
                jsonArray.append({'uid': element[0], 'email': element[2], 'username': element[3]})
            if len(jsonArray) == 0:
                return "No user found. [pid: " + str(pid) + "]"
            else:
                return "User found from pid.", jsonArray
        except Exception as e:
            return "Failed to find user from pid. (" + str(e) + ")", None
    else:
        return "Failed to find user from pid. (GET Failed)", None


def retrieveUsersbyPid(productcreatorid, cursor):
    #get the product creator of that product
    usertablecreatorQuery = "select * from User where uid in (select product_creator from Product where pid = \'" + productcreatorid + "\')"
    #search user table for uid that matches product creator id
    #return the info of that user
    cursor.execute(usertablecreatorQuery)
    usercreatorid = cursor.fetchall()
    jsonArray = []
    for element in usercreatorid:
        jsonArray.append(json.dumps(
        {'uid': element[0], 'email': element[2], 'username': element[3]}))
    return jsonArray
