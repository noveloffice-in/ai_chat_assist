import subprocess
import os

def install_node_app():
    # Path to your Bench directory
    bench_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    # Git URL of the Node.js app (replace with your actual Git repo URL)
    node_app_git_url = "https://github.com/noveloffice-in/node_file_backend.git"
    
    # Clone the Node.js app repo if it doesn't exist
    node_app_path = os.path.join(bench_path, "node_file_backend")  # Example path
    if not os.path.exists(node_app_path):
        subprocess.run(["git", "clone", node_app_git_url, node_app_path], check=True)
    
    # Navigate to the node app directory
    os.chdir(node_app_path)

    # Install dependencies using npm or yarn
    subprocess.run(["npm", "install"], check=True)
    
    print("Node.js app installed successfully.")
