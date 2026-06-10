import subprocess
import requests

repo_url = "https://api.github.com/repos/VanshKaushal/Analyzer/commits/main"
res = requests.get(repo_url)

if res.status_code == 200:
    print(res.json()["commit"]["message"])
else:
    print("API Error:", res.status_code)
