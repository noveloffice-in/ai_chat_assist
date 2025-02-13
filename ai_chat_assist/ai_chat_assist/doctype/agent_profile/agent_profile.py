# Copyright (c) 2025, Prabhudev Desai and team and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class AgentProfile(Document):
	
	def on_update(self):
		user = frappe.get_doc("User", self.user)
		if self.enabled and not user.enabled:
			user.enabled = 1
			user.save()
		elif not self.enabled and user.enabled:
			user.enabled = 0
			user.save()
