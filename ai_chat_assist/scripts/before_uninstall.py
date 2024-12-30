import subprocess

def delete_supervisor_file_for_node_app():
    subprocess.run("sudo rm -rf /etc/supervisor/conf.d/ai_chat_assist.conf", shell=True)