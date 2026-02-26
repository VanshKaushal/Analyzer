"""
GitHub Repo Analyzer — FastAPI application entry point.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from fastapi.responses import JSONResponse

from config import settings
from routes.api import router as api_router
from routes.webhook import router as webhook_router
from utils.cache_service import get_cache_status

# ── Logging ───────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ── FastAPI App ───────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Analyze any public GitHub repository and get structured insights.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routes ──────────────────────────
app.include_router(api_router, prefix="/api/v1")
app.include_router(webhook_router, prefix="/api/v1/webhook")


# ── Global Validation Error Handlers ─────────
@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "status": "failed",
            "data": None,
            "error": "Invalid repository format. Expected 'owner/repo'.",
        },
    )


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "status": "failed",
            "data": None,
            "error": f"Invalid repository format. Expected 'owner/repo'.",
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "status": "failed",
            "data": None,
            "error": "Internal server error.",
        },
    )


import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ── Health Check ──────────────────────────────
@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "cache": get_cache_status(),
    }

# ── Serve React Frontend ───────────────────────
frontend_dist = os.path.join(os.path.dirname(__file__), "frontend", "dist")

if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        index_path = os.path.join(frontend_dist, "index.html")
        requested_path = os.path.join(frontend_dist, full_path)
        
        if os.path.isfile(requested_path):
            return FileResponse(requested_path)
        return FileResponse(index_path)
else:
    @app.get("/")
    async def root():
        return {
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "running",
            "docs": "/docs",
            "note": "Frontend not built. Run 'npm run build' in frontend folder."
        }
