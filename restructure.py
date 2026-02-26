import shutil
import os
import sys

base_dir = r"c:\Users\Vansh Kaushal\OneDrive\Desktop\CODE\college project"
backend_dir = os.path.join(base_dir, "backend")

# make dirs
for d in ["github_integration", "routes", "data_pipeline", "ui", "utils", "static"]:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

# Define moves (src, dest)
moves = [
    (r"backend\app\analysis_engine", r"analysis_engine"),
    (r"backend\app\api\routes.py", r"routes\api.py"),
    (r"backend\app\api\webhook.py", r"routes\webhook.py"),
    (r"backend\app\services\github_service.py", r"github_integration\github_service.py"),
    (r"backend\app\services\analysis_service.py", r"analysis_engine\analysis_service.py"),
    (r"backend\app\services\cache_service.py", r"utils\cache_service.py"),
    (r"backend\app\core\config.py", r"config.py"),
    (r"backend\app\core\redis_client.py", r"database.py"),
    (r"backend\app\schemas\models.py", r"models.py"),
    (r"backend\app\main.py", r"main.py"),
    (r"backend\app\worker.py", r"worker.py"),
    (r"backend\requirements.txt", r"requirements.txt"),
    (r"backend\docker-compose.yml", r"docker-compose.yml"),
    (r"backend\.env.example", r".env.example"),
    (r"backend\test_preview.py", r"test_preview.py"),
    (r"backend\test_service.py", r"test_service.py"),
]

for src, dest in moves:
    src_path = os.path.join(base_dir, src)
    dest_path = os.path.join(base_dir, dest)
    if os.path.exists(src_path):
        print(f"Moving {src_path} -> {dest_path}")
        try:
            shutil.move(src_path, dest_path)
        except Exception as e:
            print(f"Failed to move {src_path}: {e}")

try:
    print(f"Deleting backend folder")
    shutil.rmtree(backend_dir)
except Exception as e:
    print(f"Failed to delete backend folder: {e}")
