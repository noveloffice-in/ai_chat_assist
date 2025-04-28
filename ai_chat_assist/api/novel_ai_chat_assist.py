import frappe

SESSION_DETAILS = "Session Details"
AGENT_PROFILE = "Agent Profile"
CLIENT_DETAILS = "Client Details"
WIDGET_SETTINGS = "Widget Settings"

def create_doc(os, ip, referrer):
    unique_id = frappe.utils.generate_hash(length=12)
    new_doc = frappe.new_doc(SESSION_DETAILS)
    new_doc.session_id = unique_id
    new_doc.save()
    client_doc = frappe.new_doc(CLIENT_DETAILS)
    client_doc.session_id = unique_id
    client_doc.ip_address = ip
    client_doc.operating_system = os
    client_doc.referrer = referrer
    client_doc.save()
    return { "message": "success", "id": unique_id }

def add_location_details(session_id, accuracy, longitude, latitude):
    client_doc = frappe.get_doc(CLIENT_DETAILS, session_id)
    if not client_doc.longitude:
        client_doc.accuracy = accuracy
        client_doc.longitude = longitude
        client_doc.latitude = latitude
        client_doc.save()
    return { "message": "success" }

def save_message(msg, session_id, user, message_type, agent_email, time_stamp):
    doc = frappe.get_doc(SESSION_DETAILS, session_id)
    child_record = doc.append("messages", {})
    child_record.message = msg
    child_record.user = user
    child_record.message_type = message_type if message_type else "Message"
    child_record.agent_email = agent_email
    child_record.time_stamp = time_stamp
    if user == "Guest" and doc.resolved:
        doc.resolved = 0
    doc.save()
    return 'success'

# New function to fetch messages for a specific session (room)
def fetch_messages(session_id):
    is_room_exist = frappe.get_list(SESSION_DETAILS, filters={"name": session_id})
    if len(is_room_exist) > 0:
        
        doc = frappe.get_doc(SESSION_DETAILS, session_id)
        
        messages = [{"user": msg.user, "message": msg.message, "message_type":  msg.message_type} for msg in doc.messages]
        return messages
    else:
        return []

def add_contact_details(session_id, name, email, phone):
    client_details = frappe.get_doc(CLIENT_DETAILS, session_id)
    client_details.name1 = name
    client_details.email_address = email
    client_details.contact_number = phone
    client_details.save()
    frappe.db.set_value(SESSION_DETAILS, session_id, "visitor_name", name)
    return 'success'

def get_assigned_users_and_online_agents():
    assigned_users_list = frappe.get_list(SESSION_DETAILS, fields = ["name", "current_user"])
    assigned_users = {}
    for assigned_user in assigned_users_list:
        assigned_users[assigned_user.name] = assigned_user.current_user if assigned_user.current_user else None
    
    online_agents = frappe.get_list(AGENT_PROFILE, filters = { "is_available": 1 }, pluck = "name")
    return { "assignedUsers": assigned_users, "onlineAgents": online_agents }

def utils():
    widget_settings = frappe.get_doc(WIDGET_SETTINGS, WIDGET_SETTINGS)
    response = {
        "welcome_message": widget_settings.welcome_message,
        "returning_message": widget_settings.returning_message,
        "allowed_origins": [obj.path for obj in widget_settings.allowed_origins],
        "restricted_paths": [obj.path for obj in widget_settings.restricted_paths]
    }
    return response

def update_feedback(session_id, ratings, feedback):
    if frappe.db.exists(SESSION_DETAILS, session_id):
        session_detail = frappe.get_doc(SESSION_DETAILS, session_id)
        session_detail.ratings = ratings
        session_detail.feedback = feedback
        # session_detail.resolved = 1 # Digital Marketing requested not to resolve it from guest side
        session_detail.save()
    else:
        return "error"

# Request handler
@frappe.whitelist()
def request_handler():
    data = frappe.request.json

    request = data.get("request")
    session_id = data.get("session_id")
    user = data.get("user")
    msg = data.get("msg")
    accuracy = data.get("accuracy")
    longitude = data.get("longitude")
    latitude = data.get("latitude")
    os = data.get("os")
    ip = data.get("ip")
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    agent_email = data.get("agent_email")
    message_type = data.get("message_type")
    time_stamp = data.get("time_stamp")
    referrer = data.get("referrer")
    ratings = data.get("ratings")
    feedback = data.get("feedback")

    if request == "create_doc":
        frappe.response['message'] = create_doc(os, ip, referrer)
    elif request == "save_message":
        frappe.response['message'] = save_message(msg, session_id, user, message_type, agent_email, time_stamp)
    elif request == "fetch_messages":  # Handling the fetch_messages request
        frappe.response['message'] = fetch_messages(session_id)
    elif request == "add_location_details":
        frappe.response['message'] = add_location_details(session_id, accuracy, longitude, latitude)
    elif request == "add_contact_details":
        frappe.response['message'] = add_contact_details(session_id, name, email, phone)
    elif request == "get_assigned_users_and_online_agents":
        frappe.response['message'] = get_assigned_users_and_online_agents()
    elif request == "utils":
        frappe.response['message'] = utils()
    elif request == "update_feedback":
        frappe.response['message'] = update_feedback(session_id, ratings, feedback)
