import json
import datetime


# Creates a new message in the database
def create_message(req, conn, cursor):
    if req.method == 'POST':
        n_date = datetime.datetime.now()
        n_body = req.form.get('message')
        n_sender = req.form.get('userid')
        n_receiver = req.form.get('contactid')
        create_message_query = "INSERT INTO Message (date, body, message_sender, message_receiver) " \
                               "VALUES (%s, %s, %s, %s)"
        new_user_values = (n_date, n_body, n_sender, n_receiver)
        try:
            cursor.execute(create_message_query, new_user_values)
            conn.commit()
            conn.close()
            return "Successfully created message. [Sender:" + str(n_sender) + "]" + "[Receiver:" + str(n_receiver) + "]", None
        except Exception as e:
            return "Failed to create message. (" + str(e) + ") req:" + str(req.form), None
    else:
        return "Failed to create message. (POST Failed)", None


# Deletes an existing message in the database
def delete_message(req, conn, cursor):
    if req.method == 'POST':
        mid = req.form.get('messageid')
        delete_message_query = "DELETE FROM Message WHERE mid = \'" + mid + "\'"
        try:
            cursor.execute(delete_message_query)
            conn.commit()
            conn.close()
            return "Successfully deleted message. [mid:" + mid + "]", None
        except Exception as e:
            return "Failed to delete message. (" + str(e) + ")", None
    else:
        return "Failed to delete message. (POST Failed)", None


# Find message with messageID
def get_message(req, conn, cursor):
    if req.method == 'GET':
        mid = req.args.get('messageid')
        get_message_query = "SELECT * FROM Message WHERE mid = \'" + mid + "\'"
        try:
            cursor.execute(get_message_query)
            message_data = cursor.fetchall()
            conn.close()

            jsonArray = []
            for element in message_data:
                jsonArray.append(
                    {'mid': element[0], 'date': element[1].isoformat(), 'body': element[2],
                     'message_sender': element[3],
                     'message_receiver': element[4]})

            if message_data:
                return "Message found.", jsonArray
            else:
                return "Message not found.", None
        except Exception as e:
            return "Failed to find message. (" + str(e) + ")", None
    else:
        return "Failed to find message. (GET Failed)", None


# Get contacts of user with userID
def get_contacts(req, conn, cursor):
    if req.method == 'GET':
        uid = req.args.get('userid')
        get_receiver_contact_query = "SELECT message_receiver FROM Message WHERE message_sender = \'" + uid + "\'"
        get_sender_contact_query = "SELECT message_sender FROM Message WHERE message_receiver = \'" + uid + "\'"
        combine_contact_query = get_receiver_contact_query + " UNION " + get_sender_contact_query
        try:
            cursor.execute(combine_contact_query)
            combined_data = cursor.fetchall()

            jsonArray = []
            for element in combined_data:
                contactid = element[0]
                get_username_query = "SELECT username FROM User WHERE uid = \'" + str(contactid) + "\'"
                try:
                    cursor.execute(get_username_query)
                    username_data = cursor.fetchall()
                    jsonArray.append(
                        {'contactid': contactid, 'contactName': username_data[0]})
                except Exception as e:
                    return "Failed to collect contacts. (" + str(e) + ")"

            conn.close()

            if len(jsonArray) < 1:
                return "No contacts found.", None
            else:
                return "Contacts found.", jsonArray
        except Exception as e:
            return "Failed to get contacts. (" + str(e) + ") | " + str(combined_data), None
    else:
        return "Failed to get contacts. (GET Failed)", None


# Get all messages with both userID and contact userID
def get_chat(req, conn, cursor):
    if req.method == 'GET':
        uid = req.args.get('userid')
        cuid = req.args.get('contactid')
        get_sent_messages_query = "SELECT * FROM Message WHERE message_sender = \'" + uid + "\'" " AND " + \
                                  "message_receiver = \'" + cuid + "\'"
        get_received_messages_query = "SELECT * FROM Message WHERE message_sender = \'" + cuid + "\'" " AND " + \
                                      "message_receiver = \'" + uid + "\'"
        order_by_date_query = "ORDER BY date ASC"
        combined_message_query = get_sent_messages_query + " UNION " + get_received_messages_query + " " + order_by_date_query

        try:
            cursor.execute(combined_message_query)
            messages_data = cursor.fetchall()
            conn.close()

            # sorted(messages_data)

            jsonArray = []
            for message in messages_data:
                isReceiver = False
                if int(message[4]) == int(uid):
                    isReceiver = True
                date = '{0:%m-%d-%y %H:%M}'.format(message[1])
                jsonArray.append({'userIsReceiver': isReceiver, 'date': date,
                                  'message': message[2]})
            if len(jsonArray) < 1:
                return "No chat found.", None
            else:
                return "Successfully got chat.", jsonArray
        except Exception as e:
            return "Failed to get chat. (" + str(e) + ")", None
    else:
        return "Failed to get chat. (GET Failed)", None


# Find message with userID as sender
def GetMessagesBySender(conn, cursor, uid):
    query = "SELECT * FROM Message WHERE message_sender = \'" + uid + "\'"
    try:
        cursor.execute(query)
        messages_data = cursor.fetchall()
        conn.close()
        jsonArray = []
        for element in messages_data:
            jsonArray.append(json.dumps(
                {'mid': element[0], 'date': element[1].isoformat(), 'body': element[2], 'message_sender': element[3],
                 'message_receiver': element[4]}))
        return jsonArray
    except Exception as e:
        return None


# Find message with userID as receiver
def GetMessagesByReceiver(conn, cursor, uid):
    query = "SELECT * FROM Message WHERE message_receiver = \'" + uid + "\'"
    try:
        cursor.execute(query)
        messages_data = cursor.fetchall()
        conn.close()
        jsonArray = []
        for element in messages_data:
            jsonArray.append(json.dumps(
                {'mid': element[0], 'date': element[1].isoformat(), 'body': element[2], 'message_sender': element[3],
                 'message_receiver': element[4]}))
        return jsonArray
    except Exception as e:
        return None
