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