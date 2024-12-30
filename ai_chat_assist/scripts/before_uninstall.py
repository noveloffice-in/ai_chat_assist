import subprocess
import os

def delete_supervisor_file_for_node_app():
    subprocess.run("cd /etc/supervisor/conf.d")
    subprocess.run("sudo rm -rf ai_chat_assist.conf")