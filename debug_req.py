import urllib.request
import json
import traceback

try:
    url = "http://127.0.0.1:8000/api/v1/analyze/deep?repo=facebook/react"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        print("HTTP Status:", response.getcode())
        data = response.read().decode('utf-8')
        print("Response JSON:")
        print(json.dumps(json.loads(data), indent=2))
except Exception as e:
    print(f"Error fetching URL: {e}")
    traceback.print_exc()
