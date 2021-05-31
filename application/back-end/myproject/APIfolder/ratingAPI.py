import json


# Create a new rating in the database
def create_rating(req, conn, cursor):
    if req.method == 'POST':
        n_score = req.form.get('score')
        n_message = req.form.get('message')
        n_rating_user = req.form.get('userid')
        create_rating_query = "INSERT INTO Rating (score, message, rating_user) " \
                              "VALUES (%s, %s, %s)"
        new_user_values = (n_score, n_message, n_rating_user)
        try:
            cursor.execute(create_rating_query, new_user_values)
            conn.commit()
            conn.close()
            return "Successfully added rating. [uid:" + n_rating_user + "]", None
        except Exception as e:
            return "Failed to add rating. (" + str(e) + ")", None
    else:
        return "Failed to add rating. (POST Failed)", None


# Delete an existing rating in the database
def delete_rating(req, conn, cursor):
    if req.method == 'POST':
        rid = req.form.get('ratingid')
        delete_rating_query = "DELETE FROM Rating WHERE rid = \'" + rid + "\'"
        try:
            cursor.execute(delete_rating_query)
            conn.commit()
            conn.close()
            return "Successfully removed rating. [rid:" + rid + "]", None
        except Exception as e:
            return "Failed to remove rating. (" + str(e) + ")", None
    else:
        return "Failed to delete message. (POST Failed)", None


# Find rating with ratingID
def get_rating(req, conn, cursor):
    if req.method == 'GET':
        rid = req.args.get('ratingid')
        get_rating_query = "SELECT * FROM Rating WHERE rid = \'" + rid + "\'"
        try:
            cursor.execute(get_rating_query)
            rating_data = cursor.fetchall()
            conn.close()

            jsonArray = []
            for element in rating_data:
                jsonArray.append(json.dumps(
                    {'rid': element[0], 'score': element[1], 'message': element[2], 'rating_user': element[3]}))
            if rating_data:
                return "Rating found. [rid:" + rid + "]", jsonArray
            else:
                return "Rating not found.", None
        except Exception as e:
            return "Failed to find rating. (" + str(e) + ")", None
    else:
        return "Failed to find rating. (GET Failed)", None


def get_user_ratings(req, conn, cursor):
    if req.method == 'GET':
        uid = req.args.get('userid')
        get_user_ratings_query = "SELECT * FROM Rating WHERE rating_user = \'" + uid + "\'"
        try:
            cursor.execute(get_user_ratings_query)
            rating_data = cursor.fetchall()
            conn.close()

            jsonArray = []
            for element in rating_data:
                jsonArray.append(json.dumps(
                    {'rid': element[0], 'score': element[1], 'message': element[2], 'rating_user': element[3]}))
            if rating_data:
                return "User's ratings found. [uid:" + uid + "]", jsonArray
            else:
                return "User's ratings not found.", None
        except Exception as e:
            return "Failed to find user's ratings. (" + str(e) + ")"
    else:
        return "Failed to find user's ratings. (GET Failed)"
