import requests

try:
    print("Testing API fetch...")
    res = requests.get('http://127.0.0.1:8000/api/v1/analyze/deep?repo=facebook/react', timeout=20)
    print(res.status_code)
    print(res.text)
except Exception as e:
    print("Fetch Failed:", e)
