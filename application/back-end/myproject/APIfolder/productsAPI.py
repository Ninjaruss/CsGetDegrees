import json


def createProduct(req, conn, cursor):
    if req.method == 'POST':
        tag_array = []
        name = req.form.get('name')
        price = req.form.get('price')
        category = req.form.get('categories')
        description = req.form.get('description')
        product_creator = req.form.get('sellerid')
        product_course = req.form.get('course')
        quantity = req.form.get('quantity')
        tags = tag_array
        results = ["Nothing"]
        if product_course != '':
            cursor.execute("Select cid from Class where Class.name = '{}'".format(product_course))
            results = cursor.fetchall()
        if len(results) > 0:
            print("Results: " + results[0])
            product_course = results[0]
        else:
            print("No results found")
            product_course = 12

        if category == 'Select One':
            category = 'Misc'
        if price == '':
            price = 0
        if name == '':
            name = 'Default'
        if description == '':
            description = 'Default'

        new_product_insert_query1 = "INSERT INTO Product(name, price, category, description, product_creator, product_course, quantity, isapproved) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(name, price, category, description, product_creator, product_course, quantity, 0)
        print(new_product_insert_query1)

        try:
            cursor.execute(new_product_insert_query1)
            conn.commit()
            conn.close()
            return "Product successfully created.", None, True
        except Exception as e:
            return "Failed to create product. (" + str(e) + ")", None, False
    else:
        return "Failed to create product. (POST Failed)", None, False


# Deletes multiple products in the database
def delete_products(req, conn, cursor):
    if req.method == 'POST':
        product_table = req.form.getlist('param')
        try:
            for pid in product_table:
                delete_product_query = "DELETE FROM Product WHERE pid = \'" + pid + "\'"
                cursor.execute(delete_product_query)
                conn.commit()
            conn.close()

            if cursor.rowcount == 0:
                return "Did not find products to delete.", None
            else:
                return "Successfully deleted products. (pidTable: " + str(product_table) + ")", None
        except Exception as e:
            return "Failed to delete products. (" + str(e) + ")", None
    else:
        return "Failed to delete products. (POST Failed)", None


def get_product_by_name(req, conn, cursor):
    if req.method == 'GET':
        p_name = req.args.get("getSearchedProduct")
        get_product_query = "SELECT * FROM Product WHERE name LIKE \'" + "%" + p_name + "%" + "\'"
        try:
            if p_name == "all":
                get_product_query = "SELECT * FROM Product"
            cursor.execute(get_product_query)
            product_matches = cursor.fetchall()
            conn.close()
            jsonArray = []
            for element in product_matches:
                jsonArray.append(
                    {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]})
            if len(jsonArray) == 0:
                return "Did not find any products with matching name. [p_name: " + p_name + "]", None
            else:
                return "Found products.", jsonArray
        except Exception as e:
            return "Failed to get products. (" + str(e) + ")"
    else:
        return "Failed to get products. (GET Failed)"


def get_not_approved_products(req, conn, cursor):
    if req.method == 'GET':
        product_not_approved_query = "SELECT * FROM Product WHERE isapproved = \'" + "0" + "\'"
        try:
            cursor.execute(product_not_approved_query)
            product_matches = cursor.fetchall()
            conn.close()
            jsonArray = []
            for element in product_matches:
                jsonArray.append(
                    {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]})
            if len(jsonArray) == 0:
                return "Did not find any unapproved products.", None
            else:
                return "Found unapproved products.", jsonArray
        except Exception as e:
            return "Failed to get unapproved products. (" + str(e) + ")"
    else:
        return "Failed to get unapproved products. (GET Failed)"


def approveProducts(req, conn, cursor):
    if req.method == 'POST':
        list_of_id = req.form.get('param').split(',')
        print(list_of_id)
        try:
            for i in list_of_id:
                print(i)
                if i != ',':
                    approvalQuery = "UPDATE Product SET isapproved = '1' WHERE pid = '{}'".format(i)
                    print(approvalQuery)
                    cursor.execute(approvalQuery)
            conn.commit()
            conn.close()
            print("Did I get here?")
            return "Successfully approved products.", None, True
        except Exception as e:
            return "Failed to approve products. (" + str(e) + ")", None, True
    else:
        return "Failed to approve products. (GET Failed)"


# Return all products matching specified productID
def retrieveProductsByPid(pid, conn, cursor):
    product_table_pid_query = "SELECT * FROM Product WHERE pid = \'" + pid + "\'"
    try:
        cursor.execute(product_table_pid_query)
        product_matches = cursor.fetchall()
        conn.close()
        jsonArray = []
        for element in product_matches:
            jsonArray.append(
                {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]})
        if len(jsonArray) == 0:
            return "no product associated with requested pid", None, True
        else:
            return "Found products.", jsonArray, True
    except Exception as e:
        return "Failed to retrieve products by pid. (" + str(e) + ")", None, False


# Return all products created by given userID
def retrieveProductsByUid(uid, conn, cursor):
    product_table_uid_query = "SELECT * FROM Product WHERE product_creator = \'" + uid + "\'"
    try:
        cursor.execute(product_table_uid_query)
        product_matches = cursor.fetchall()
        conn.close()
        jsonArray = []
        for element in product_matches:
            jsonArray.append(
                {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]})
        if len(jsonArray) == 0:
            return "user has no product", None, True
        else:
            return "Found products.", jsonArray, True
    except Exception as e:
        return "Failed to retrieve products by uid. (" + str(e) + ")", None, False


def retrieveNineMostRecent(req, conn, cursor):
    if req.method == "GET":
        product_table_query = "SELECT * FROM Product ORDER BY Product.pid DESC LIMIT 6"
        try:
            cursor.execute(product_table_query)
            recent_products = cursor.fetchall()
            conn.close()
            jsonArray = []
            for element in recent_products:
                jsonArray.append(
                    {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]})
            if len(jsonArray):
                return "Could not find 9 most recent products.", None
            else:
                return "Got 9 most recent products.", jsonArray
        except Exception as e:
            return "Failed to retrieve 9 most recent products. (" + str(e) + ")", None
    else:
        return "Failed to retrieve 9 most recent products. (GET Failed)", None


def retrieveProductsByName(productName, cursor):
    print("Retrieving products")
    productTableNameQuery = "select * from Product where name = \'" + productName + "\'"
    cursor.execute(productTableNameQuery)
    productmatches = cursor.fetchall()
    jsonArray = []
    for element in productmatches:
        jsonArray.append(json.dumps({'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray


def retrieveAllProducts(cursor):
    productTableQuery = "select * from Product"
    cursor.execute(productTableQuery)
    productmatches = cursor.fetchall()
    jsonArray = []
    for element in productmatches:
        jsonArray.append(json.dumps({'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray


def retrieveProductsByPrice(productPrice, cursor):
    productTablePriceQuery = "select * from Product where price = \'" + productPrice + "\'"
    cursor.execute(productTablePriceQuery)
    productmatches = cursor.fetchall()
    jsonArray = []
    for element in productmatches:
        jsonArray.append(json.dumps(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray


def retrieveProductCategories(cursor):
    productTableCategories = "select distinct category from Product"
    cursor.execute(productTableCategories)
    categoryMatches = cursor.fetchall()
    print(categoryMatches)
    jsonArray = []
    for element in categoryMatches:
        jsonArray.append(json.dumps({'category': element[0]}))
    return jsonArray


def retrieveProductsByAbbreviation(abbreviation, cursor):
    productTableAbbrevQuery = "select * from Product where Product.product_course in (select cid from Class where Class.department_id in (select did from Department where Department.abbreviation = '{}'))".format(abbreviation)
    cursor.execute(productTableAbbrevQuery)
    productAbbrevMatches = cursor.fetchall()
    print(productAbbrevMatches)
    jsonArray = []
    for element in productAbbrevMatches:
        jsonArray.append(json.dumps(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray


def retrieveProductsByClassNumber(number, dep_name, cursor):
    formattedName = dep_name.replace('+', ' ')
    productTableClassQuery = "select * from Product where Product.product_course in (select cid from Class where Class.course_number = '{}' and Class.department_id in (select did from Department where Department.name = '{}'))".format(number, formattedName)
    cursor.execute(productTableClassQuery)
    productTableClassMatches = cursor.fetchall()
    print(productTableClassMatches)
    jsonArray = []
    for element in productTableClassMatches:
        jsonArray.append(json.dumps(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray


def retrieveProductsByCategory(productCategory, cursor):
    productTablePriceQuery = "select * from Product where category = \'" + productCategory + "\'"
    cursor.execute(productTablePriceQuery)
    productmatches = cursor.fetchall()
    jsonArray = []
    for element in productmatches:
        jsonArray.append(json.dumps(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray


def retrieveProductsByPrice(productPrice, cursor):
    productTablePriceQuery = "select * from Product where price = \'" + productPrice + "\'"
    cursor.execute(productTablePriceQuery)
    productmatches = cursor.fetchall()
    jsonArray = []
    for element in productmatches:
        jsonArray.append(json.dumps(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray


def retrieveProductsByCategory(productCategory, cursor):
    productTablePriceQuery = "select * from Product where category = \'" + productCategory + "\'"
    cursor.execute(productTablePriceQuery)
    productmatches = cursor.fetchall()
    jsonArray = []
    for element in productmatches:
        jsonArray.append(json.dumps(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]}))
    return jsonArray

def retrieveNineMostRecent(cursor):
    productTableQuery = "select * from Product where isApproved = '1' order by Product.pid desc limit 6"
    print("9Recent getting called")
    cursor.execute(productTableQuery)
    recentProducts = cursor.fetchall()
    jsonArray = []
    for element in recentProducts:
        jsonArray.append(
            {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3], 'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7], 'course': element[8], 'quantity': element[9]})
    return jsonArray

def purchaseProduct(productId, connection, cursor):
    productReference = "select quantity from Product where pid = '{}'".format(productId)
    cursor.execute(productReference)
    matchingProductQuantity = cursor.fetchall()
    quantity = matchingProductQuantity[0][0]
    if quantity == -1:
        print("There is an infinite supply of this product")
        return "Product successfully purchased", None, True
    elif quantity == 1:
        print("Last product in stock sold")
        purchaseQuery = "delete from Product where pid = '{}'".format(productId)
        cursor.execute(purchaseQuery)
        connection.commit()
        connection.close()
        return "Product successfully purchased", None, True
    else:
        print("Greater than one of this product in stock")
        updateQuantityQuery = "update Product set quantity = '{}' where pid = '{}'".format(quantity - 1, productId)
        cursor.execute(updateQuantityQuery)
        connection.commit()
        connection.close()
        return "Product successfully purchased", None, True
    return "Product was not successfully purchased", None, False

def new_category_creation(request, connection, cursor):
    newCategory = request.form.get('param')
    newCategoryQuery = "insert into Product (category, isApproved) values ('{}', '0')".format(newCategory)
    cursor.execute(newCategoryQuery)
    connection.commit()
    connection.close()
    return "Category successfully added", None, True

def structureIntoValidJson(jsonArray, cursor):
    jsonStructure = "{\n\"data\": ["
    for i in jsonArray:
        jsonStructure = jsonStructure + "\n"
        jsonStructure = jsonStructure + i + ", "
    jsonStructure = jsonStructure[:-2]
    jsonStructure = jsonStructure + "\n]\n}"
    return jsonStructure
