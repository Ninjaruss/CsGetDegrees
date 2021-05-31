import json


def new_department_creation(req, conn, cursor):
    n_name = req.form.get('param')
    n_abbr = req.form.get('abbr')
    new_department_insert_query = "INSERT INTO Department (name, abbreviation) VALUES (%s, %s)"
    new_department_values = (n_name, n_abbr)

    try:
        cursor.execute(new_department_insert_query, new_department_values)
        conn.commit()
        conn.close()
        return "Successfully created department.", None, True
    except Exception as e:
        return "Failed to create department. (" + str(e) + ")", None, False


# Deletes an existing department from the database
def delete_department(req, conn, cursor):
    if req.method == "POST":
        d_name = req.form.get('param')
        delete_department_query = "DELETE FROM Department WHERE `name` = \'" + d_name + "\'"

        try:
            cursor.execute(delete_department_query)
            conn.commit()
            conn.close()
            if cursor.rowcount == 0:
                return "Did not find department to delete.", None
            else:
                return "Successfully deleted department. [d_name: " + d_name + "]", None
        except Exception as e:
            return "Failed to delete department. (" + str(e) + ")", None
    else:
        return "Failed to delete department. (POST Failed)", None


def retrieveDepartmentNames(cursor):
    departmentNameQuery = "SELECT DISTINCT name FROM Department"
    cursor.execute(departmentNameQuery)
    departmentNames = cursor.fetchall()
    jsonArray = []
    for element in departmentNames:
        jsonArray.append(json.dumps({'department': element[0]}))
    return jsonArray


# Find department with departmentID
def get_department(req, conn, cursor):
    if req.method == 'GET':
        did = req.args.get('departmentid')
        d_name = req.args.get('name')
        d_abbrev = req.args.get('abbreviation')

        get_department_by_id_query = "SELECT * FROM Department WHERE did = \'" + did + "\'"
        get_department_by_name_query = "SELECT * FROM Department WHERE name = \'" + d_name + "\'"
        get_department_by_abbrev_query = "SELECT * FROM Department WHERE name = \'" + d_abbrev + "\'"

        get_department_query = None
        if did:
            get_department_query = get_department_by_id_query
        elif d_name:
            get_department_query = get_department_by_name_query
        elif d_abbrev:
            get_department_query = get_department_by_abbrev_query

        try:
            cursor.execute(get_department_query)
            department_data = cursor.fetchall()
            conn.close()

            jsonArray = []
            for element in department_data:
                jsonArray.append(
                    {'did': element[0], 'name': element[1], 'abbreviation': element[2]})

            if department_data:
                return "Department found.", jsonArray
            else:
                return "Department not found.", None
        except Exception as e:
            return "Failed to find department. (" + str(e) + ")", None
    else:
        return "Failed to find department. (GET Failed)", None
