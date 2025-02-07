import frappe

@frappe.whitelist()
def check_agent(user):
    agents = frappe.get_list("Agent Profile", filters = { "user": user })
    if(len(agents) > 0):
        return frappe.get_doc("Agent Profile", user)

    new_agent = frappe.new_doc("Agent Profile")
    new_agent.user = user
    new_agent.save()
    return new_agent

@frappe.whitelist()
def add_canned_messages(hot_word_and_messages):
    try:
        agent = frappe.get_doc("Agent Profile", frappe.session.user)
        if not agent:
            return []

        agent.canned_messages = []
        for row in hot_word_and_messages:
            agent.append("canned_messages", {
                "hot_word": row.get("hotWord"),
                "message": row.get("message")
            })
        agent.save()
        return 'success'
    
    except Exception as e:
        frappe.log_error(f"Error adding canned messages: {str(e)}", "add_canned_messages")
        return {"error": "Failed to add canned messages", "details": str(e)}


@frappe.whitelist()
def get_canned_messages():
    agent = check_agent(frappe.session.user)
    if(agent):
        return agent.canned_messages
    return []
