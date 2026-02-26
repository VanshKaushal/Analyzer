"""
Pydantic v2 models for request validation and response serialization.
"""

from pydantic import BaseModel, field_validator
from typing import Optional, List
import re


# ──────────────────────────────────────────────
# Request Models
# ──────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    """Validates the incoming analyze request."""
    repo: str

    @field_validator("repo")
    @classmethod
    def validate_repo_format(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r"^[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+$", v):
            raise ValueError("Invalid repository format. Expected 'owner/repo'.")
        return v


# ──────────────────────────────────────────────
# Data Models (Analysis Object)
# ──────────────────────────────────────────────

class FileNode(BaseModel):
    """Represents a file or folder in the repo tree."""
    name: str
    path: str
    type: str  # "file" | "folder"
    children: Optional[List["FileNode"]] = []


class LanguageInfo(BaseModel):
    """Language breakdown entry."""
    name: str
    percentage: float


class CommitInfo(BaseModel):
    """Monthly commit count."""
    month: str
    count: int


class ProjectInfo(BaseModel):
    """Core project metadata."""
    name: str
    owner: str
    tech_stack: List[str]
    project_type: str
    complexity_score: int


class PreviewDetails(BaseModel):
    """Smart Repository Preview System data."""
    type: str  # "live" | "readme" | "none"
    url: Optional[str] = None
    readme_content: Optional[str] = None


class AnalysisData(BaseModel):
    """The full analysis object returned in the response."""
    project: ProjectInfo
    summary: str
    key_features: List[str]
    languages: List[LanguageInfo]
    commits: List[CommitInfo]
    file_tree: List[FileNode]
    architecture_diagram: str
    preview: PreviewDetails


# ──────────────────────────────────────────────
# API Response Envelope
# ──────────────────────────────────────────────

class ApiResponse(BaseModel):
    """Standard API response envelope."""
    success: bool
    status: str  # "processing" | "complete" | "failed"
    data: Optional[AnalysisData] = None
    error: Optional[str] = None


class DeepScanData(BaseModel):
    """The deep scan AI profile data."""
    vibe_check: str
    technical_debt: str
    trust_score: int
    security_severity: str
    key_strength: str
    key_weakness: str


class DeepScanResponse(BaseModel):
    """Response envelope for deep scan."""
    success: bool
    data: Optional[DeepScanData] = None
    error: Optional[str] = None
