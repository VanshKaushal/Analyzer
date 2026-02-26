import asyncio
from github_integration.github_service import fetch_preview_data
from models import PreviewDetails

def main():
    print("Testing vercel/next.js")
    data_live = fetch_preview_data("vercel/next.js")
    print(data_live)
    print("Testing torvalds/linux")
    data_readme = fetch_preview_data("torvalds/linux")
    print(data_readme)

if __name__ == "__main__":
    main()
