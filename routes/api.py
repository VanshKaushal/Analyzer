"""
API routes — POST /analyze endpoint.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import ValidationError
from github import GithubException

import traceback

from models import (
    AnalyzeRequest,
    ApiResponse,
    AnalysisData,
    ProjectInfo,
)
from github_integration import github_service
from analysis_engine import analysis_service
from analysis_engine.deep_scanner import run_deep_scan
from utils import cache_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/analyze", response_model=ApiResponse)
async def analyze_repo(request: AnalyzeRequest):
    """
    Analyze a GitHub repository and return structured data.

    - Validates repo format (owner/repo)
    - Checks Redis cache first
    - Fetches data from GitHub API
    - Builds analysis object with summary, features, complexity
    - Caches result for 1 hour
    """
    owner, repo_name = request.repo.split("/")

    # ── Check cache ───────────────────────────
    cached = cache_service.get_analysis(owner, repo_name)
    if cached:
        return ApiResponse(
            success=True,
            status="complete",
            data=AnalysisData(**cached),
            error=None,
        )

    # ── Fetch from GitHub ─────────────────────
    try:
        repo_info = github_service.fetch_repo_info(request.repo)
        languages = github_service.fetch_languages(request.repo)
        commits = github_service.fetch_commits(request.repo)
        file_tree = github_service.fetch_file_tree(request.repo)
        preview_data = github_service.fetch_preview_data(request.repo)
    except GithubException as e:
        status_code = e.status if hasattr(e, "status") else 500
        if status_code == 404:
            return ApiResponse(
                success=False,
                status="failed",
                data=None,
                error=f"Repository '{request.repo}' not found on GitHub.",
            )
        return ApiResponse(
            success=False,
            status="failed",
            data=None,
            error=f"GitHub API error: {str(e)}",
        )
    except Exception as e:
        logger.exception("Unexpected error during GitHub fetch")
        return ApiResponse(
            success=False,
            status="failed",
            data=None,
            error=f"An unexpected error occurred: {str(e)}",
        )

    # ── Build analysis ────────────────────────
    file_count = github_service.count_files_in_tree(file_tree)
    language_count = len(languages)
    top_language = languages[0].name if languages else "Unknown"

    project_type = analysis_service.detect_project_type(languages)
    complexity_score = analysis_service.calculate_complexity(file_count, language_count)

    summary = analysis_service.generate_summary(
        project_type=project_type,
        top_language=top_language,
        file_count=file_count,
        complexity_score=complexity_score,
        description=repo_info.get("description", ""),
    )

    key_features = analysis_service.extract_key_features(
        file_tree=file_tree,
        topics=repo_info.get("topics", []),
        description=repo_info.get("description", ""),
    )

    architecture_diagram = analysis_service.generate_architecture_diagram(
        project_type=project_type,
        languages=languages,
        file_tree=file_tree,
    )

    tech_stack = [lang.name for lang in languages[:5]]

    # ── Assemble response ─────────────────────
    analysis_data = AnalysisData(
        project=ProjectInfo(
            name=repo_info["name"],
            owner=repo_info["owner"],
            tech_stack=tech_stack,
            project_type=project_type,
            complexity_score=complexity_score,
        ),
        summary=summary,
        key_features=key_features,
        languages=languages,
        commits=commits,
        file_tree=file_tree,
        architecture_diagram=architecture_diagram,
        preview=preview_data,
    )

    # ── Cache result ──────────────────────────
    cache_service.set_analysis(owner, repo_name, analysis_data.model_dump())

    return ApiResponse(
        success=True,
        status="complete",
        data=analysis_data,
        error=None,
    )

@router.get("/analyze/deep")
async def analyze_repo_deep(repo: str):
    """
    Perform a deep AI scan of the repository.
    """
    try:
        # Validate quickly
        if not "/" in repo:
            raise ValueError("Invalid repo format")
            
        repo_info = github_service.fetch_repo_info(repo)
        languages = github_service.fetch_languages(repo)
        file_tree = github_service.fetch_file_tree(repo, max_depth=3)
        preview_data = github_service.fetch_preview_data(repo)
        
        # We need the readme
        readme = preview_data.get("readme_content") or "No README found."
        
        # Run deep scan
        scan_result = run_deep_scan(repo_info, [l.name for l in languages], file_tree, readme)
        
        return {
            "success": True,
            "data": scan_result,
            "error": None
        }
        
    except GithubException as e:
        logger.error(f"GitHub Error during deep scan: {e}")
        return {
            "success": False,
            "data": None,
            "error": f"GitHub Data Fetch Failed:\n{str(e)}"
        }
    except Exception as e:
        logger.error(f"Unexpected error during deep scan: {e}")
        tb_str = traceback.format_exc()
        return {
            "success": False,
            "data": None,
            "error": f"Deep scan failed. Server Traceback:\n{tb_str}"
        }
