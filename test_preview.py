import urllib.request
import json
import time

def test_repo(repo_name):
    url = "http://localhost:8000/api/v1/analyze"
    data = json.dumps({"repo": repo_name}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"[{repo_name}] Success: {result['success']}")
            preview = result['data']['preview']
            print(f"[{repo_name}] Preview Type: {preview['type']}")
            if preview['type'] == 'live':
                print(f"[{repo_name}] URL: {preview['url']}")
            elif preview['type'] == 'readme':
                print(f"[{repo_name}] Readme snippet: {preview['readme_content'][:50]}...")
            print("-" * 40)
    except Exception as e:
        print(f"[{repo_name}] Error: {str(e)}")

if __name__ == "__main__":
    time.sleep(2) # wait for server
    test_repo("vercel/next.js") # has live homepage
    test_repo("torvalds/linux") # has readme, no live homepage
    test_repo("invalid/repo-for-testing") # should return appropriate response
