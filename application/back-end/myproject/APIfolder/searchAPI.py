from APIfolder import productsAPI


def filter_and_search(req, conn, cursor):
    # Get recent
    keyword = req.args.get("queries")
    if keyword == "9Recent":
        return "9 recent products.", productsAPI.retrieveNineMostRecent(cursor)

    # Trigger filter search
    else:
        full_search_query = "SELECT * FROM Product WHERE"
        pos = 0
        minPrice = -1
        maxPrice = -1
        quantity = -1
        department_name = ""
        course_number = -1

        # Get all pairs of parameter and key from the arg list
        for c, v in req.values.items():
            category_name = c
            category_value = v

            # Handle special cases; normal query otherwise
            checked_category_queries = False
            if category_name == "queries":
                pos -= 1
            elif category_name == "minPrice":
                minPrice = category_value
            elif category_name == "maxPrice":
                maxPrice = category_value
            elif category_name == "quantity":
                quantity = category_value
            elif category_name == "department":
                department_name = category_value
            elif category_name == "course":
                course_number = category_value
            elif category_name == "categories":
                category_name = "category"
                new_category_query = category_name + " = \'" + str(category_value) + "\'"
                if pos <= 2:
                    full_search_query = full_search_query + " " + new_category_query
                else:
                    full_search_query = full_search_query + " AND " + new_category_query
            else:
                new_category_query = category_name + " = \'" + str(category_value) + "\'"
                if pos <= 0:
                    full_search_query = full_search_query + " " + new_category_query
                else:
                    full_search_query = full_search_query + " AND " + new_category_query
            print(full_search_query)
            pos += 1

        if department_name is not "":
            if course_number >= 0:
                if pos <= 2:
                    new_department_query = "product_course IN (SELECT cid FROM Class WHERE Class.course_number = '{}') AND Class.department_id IN (SELECT did FROM Department WHERE Department.name = '{}')".format(course_number, department_name)
                else:
                    new_department_query = "AND product_course IN (SELECT cid FROM Class WHERE Class.course_number = '{}') AND Class.department_id IN (SELECT did FROM Department WHERE Department.name = '{})'".format(course_number, department_name)
            else:
                if pos <= 1:
                    new_department_query = "product_course IN (SELECT cid FROM Class WHERE Class.department_id) IN (SELECT did FROM Department WHERE Department.name = '{}')".format(department_name)
                else:
                    new_department_query = "AND product_course IN (SELECT cid FROM Class WHERE Class.department_id) IN (SELECT did FROM Department WHERE Department.name = '{}')".format(department_name)
            full_search_query = full_search_query + " " + new_department_query

        if quantity > 0:
            if pos <= 1:
                new_quantity_query = "quantity >= \'" + str(quantity) + "\'"
            else:
                new_quantity_query = "AND quantity >= \'" + str(quantity) + "\'"
            full_search_query = full_search_query + " " + new_quantity_query

        # If a minPrice and/or a maxPrice exists, create appropriate query
        if minPrice >= 0 and maxPrice >= 0:
            if pos <= 2:
                new_between_query = "price BETWEEN \'" + str(minPrice) + "\' AND \'" + str(maxPrice) + "\'"
            else:
                new_between_query = "AND price BETWEEN \'" + str(minPrice) + "\' AND \'" + str(maxPrice) + "\'"
            full_search_query = full_search_query + " " + new_between_query
        elif maxPrice >= 0:
            if pos <= 1:
                new_max_query = "price <= \'" + str(maxPrice) + "\'"
            else:
                new_max_query = "AND price <= \'" + str(maxPrice) + "\'"
            full_search_query = full_search_query + " " + new_max_query
        elif minPrice >= 0:
            if pos <= 1:
                new_min_query = "price >= \'" + str(minPrice) + "\'"
            else:
                new_min_query = "AND price >= \'" + str(minPrice) + "\'"
            full_search_query = full_search_query + " " + new_min_query

        # Check if name query exists
        if keyword == "all":
            print()
        elif keyword == "":
            full_search_query = "select * from Product"
        else:
            if pos <= 0:
                name_search_query = "name LIKE \'" + "%" + keyword + "%" + "\'"
            else:
                name_search_query = "AND name LIKE \'" + "%" + keyword + "%" + "\'"
            full_search_query = full_search_query + " " + name_search_query

        try:
            print("Final query: " + full_search_query)
            if full_search_query == "SELECT * FROM Product WHERE":
                full_search_query = "SELECT * FROM Product"
            cursor.execute(full_search_query)
            all_products_data = cursor.fetchall()
            conn.close()
            jsonArray = []
            for element in all_products_data:
                jsonArray.append(
                    {'pid': element[0], 'name': element[1], 'price': element[2], 'tags': element[3],
                     'category': element[4],
                     'description': element[5], 'product_creator': element[6], 'product_buyer': element[7],
                     'product_course': element[8], 'quantity': element[9], 'isapproved': element[10]})
            if len(jsonArray) < 1:
                return "No products found with provided filters.", None
            else:
                # debug: full_search_query + " min:" + str(minPrice) + " max:" + str(maxPrice) + " catList: " + str(
                # categoryList)
                return "Products found.", jsonArray

        except Exception as e:
            return "Failed to search through database. " + "[" + str(pos) + "]" + "(" + str(e) + ") query: " + full_search_query, None


categories = ["Misc", "Books", "Electronics", "Furniture", "Tutoring"]


def getAllCategories():
    if categories:
        jsonArray = []
        for c in categories:
            jsonArray.append({"category": c})
        return 'Got all categories.', jsonArray
    else:
        return "Missing categories table.", None
