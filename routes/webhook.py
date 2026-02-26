"""
API routes — Webhook handling for GitHub Pull Requests.
"""

import hmac
import hashlib
import logging
from fastapi import APIRouter, Request, HTTPException, Header

from config import settings
from worker import process_pr_task

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("")
async def github_webhook(
    request: Request,
    x_github_event: str = Header(None),
    x_hub_signature_256: str = Header(None),
):
    """
    Handle GitHub webhooks. Processes 'pull_request' events asynchronously.
    """
    body = await request.body()
    
    # Verify signature if secret is set
    if settings.GITHUB_WEBHOOK_SECRET:
        if not x_hub_signature_256:
            logger.warning("Missing signature on webhook request.")
            raise HTTPException(status_code=401, detail="Missing signature")
            
        mac = hmac.new(
            settings.GITHUB_WEBHOOK_SECRET.encode("utf-8"),
            msg=body,
            digestmod=hashlib.sha256
        )
        expected_signature = "sha256=" + mac.hexdigest()
        if not hmac.compare_digest(expected_signature, x_hub_signature_256):
            logger.warning("Invalid signature on webhook request.")
            raise HTTPException(status_code=401, detail="Invalid signature")

    # If it's a ping event, just return ok
    if x_github_event == "ping":
        return {"status": "ok", "message": "Pong"}

    if x_github_event == "pull_request":
        try:
            payload = await request.json()
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
            
        action = payload.get("action")
        
        # We only process opened or synchronized PRs
        if action in ["opened", "synchronize", "reopened"]:
            repo_full_name = payload["repository"]["full_name"]
            pr_number = payload["pull_request"]["number"]
            installation_id = payload.get("installation", {}).get("id")
            
            # Queue background task
            logger.info(f"Queueing PR #{pr_number} for {repo_full_name}")
            process_pr_task.delay(repo_full_name, pr_number, installation_id)
            
            return {"status": "accepted", "message": "PR queued for analysis"}
            
        return {"status": "ignored", "message": f"PR action '{action}' ignored"}

    return {"status": "ignored", "message": "Unhandled event type"}
