import logging
logging.basicConfig(level=logging.DEBUG)
from analysis_engine.deep_scanner import run_deep_scan
from dotenv import load_dotenv

load_dotenv()
try:
    print("Running fake node trace")
    result = run_deep_scan({'name':'x'}, [], [], '')
    print(result)
except Exception as e:
    print(f"FAILED: {e}")
