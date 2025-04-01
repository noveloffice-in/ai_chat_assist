# Copyright (c) 2025, Prabhudev Desai and team and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime

class SessionDetails(Document):
	
	def before_save(self):
		if len(self.messages) > 0:
			last_message = self.messages[-1]
			self.last_message_by = last_message.user
			self.last_message = last_message.message[:25]
			self.last_message_at = last_message.time_stamp
			user = last_message.user if last_message.user != "Guest" else None
			if not user and self.resolved and frappe.session.user == "nodeuser@noveloffice.in" and not self.ratings:
				self.resolved = 0
			
			session_user = frappe.get_list("Agent Profile", or_filters = { "agent_name": user, "agent_display_name": user })
			if len(session_user) > 0:
				session_user = session_user[0].name

				current_datetime = datetime.now()
				formatted_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

				if user:
					agent = frappe.get_list(
						"User",
						filters = {
							"name": session_user
						}, 
						fields = ["name", "full_name"]
					)
					if self.current_user:
						if self.current_user != session_user:
							self.current_user = session_user
							self.agent_name = agent[0].full_name
							row = self.append("multi_assign_agent_details", {})
							row.user = session_user
							row.took_control_on_at = formatted_datetime
					else:
						self.current_user = session_user
						self.agent_name = agent[0].full_name
						self.time_taken_for_first_response = formatted_datetime
						row = self.append("multi_assign_agent_details", {})
						row.user = session_user
						row.took_control_on_at = formatted_datetime
		
		if frappe.db.exists(self.doctype, self.name):
			previous_doc = frappe.get_doc(self.doctype, self.name)
			if previous_doc.ratings != self.ratings or previous_doc.feedback != self.feedback:
				self.ratings_given_to = self.current_user
