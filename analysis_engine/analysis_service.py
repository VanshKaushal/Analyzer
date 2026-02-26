"""
Analysis service — generates summary, complexity score, project type,
key features, and architecture diagram using template logic.
No external AI calls (no OpenAI).
"""

from typing import List, Dict, Any
from models import LanguageInfo, FileNode


# ──────────────────────────────────────────────
# Project Type Detection
# ──────────────────────────────────────────────

_PROJECT_TYPE_RULES = [
    (["TypeScript", "JavaScript", "CSS", "HTML"],         "Web Application"),
    (["Python", "Jupyter Notebook"],                       "Data Science / ML Project"),
    (["Python"],                                           "Python Application"),
    (["Java", "Kotlin"],                                   "Android / JVM Application"),
    (["Swift", "Objective-C"],                             "iOS Application"),
    (["C#"],                                               "C# / .NET Application"),
    (["Go"],                                               "Go Application"),
    (["Rust"],                                             "Rust Application"),
    (["Ruby"],                                             "Ruby Application"),
    (["PHP"],                                              "PHP Application"),
    (["C", "C++"],                                         "Systems / Native Application"),
]


def detect_project_type(languages: List[LanguageInfo]) -> str:
    """Infer project type from the language breakdown."""
    lang_names = {lang.name for lang in languages}

    for required_langs, project_type in _PROJECT_TYPE_RULES:
        if lang_names & set(required_langs):
            return project_type

    return "Software Project"


# ──────────────────────────────────────────────
# Complexity Score (1–10)
# ──────────────────────────────────────────────

def calculate_complexity(file_count: int, language_count: int) -> int:
    """
    Simple complexity score based on file count + language diversity.
    Returns integer 1–10.
    """
    # File-based component (0–6 points)
    if file_count < 10:
        file_score = 1
    elif file_count < 50:
        file_score = 2
    elif file_count < 150:
        file_score = 3
    elif file_count < 500:
        file_score = 4
    elif file_count < 1500:
        file_score = 5
    else:
        file_score = 6

    # Language diversity component (0–4 points)
    if language_count <= 1:
        lang_score = 1
    elif language_count <= 3:
        lang_score = 2
    elif language_count <= 6:
        lang_score = 3
    else:
        lang_score = 4

    return min(max(file_score + lang_score, 1), 10)


# ──────────────────────────────────────────────
# Summary Generation
# ──────────────────────────────────────────────

_COMPLEXITY_LABELS = {
    1: "very simple",  2: "simple",      3: "basic",
    4: "moderate",     5: "intermediate", 6: "substantial",
    7: "complex",      8: "highly complex", 9: "very complex",
    10: "extremely complex",
}


def generate_summary(
    project_type: str,
    top_language: str,
    file_count: int,
    complexity_score: int,
    description: str,
) -> str:
    """Generate a human-readable summary using templates (no AI)."""
    complexity_label = _COMPLEXITY_LABELS.get(complexity_score, "moderate")

    summary = (
        f"This project is a {project_type} primarily built using {top_language}. "
        f"It contains {file_count} files and demonstrates a {complexity_label} "
        f"level architecture."
    )

    if description:
        summary += f" {description}"

    return summary


# ──────────────────────────────────────────────
# Key Features Extraction
# ──────────────────────────────────────────────

_FEATURE_INDICATORS = {
    "README.md":           "Comprehensive documentation",
    "LICENSE":             "Open source licensing",
    "Dockerfile":          "Docker containerization support",
    "docker-compose.yml":  "Multi-container Docker orchestration",
    ".github":             "GitHub Actions CI/CD pipeline",
    "tests":               "Automated testing suite",
    "test":                "Automated testing suite",
    "docs":                "Documentation directory",
    "src":                 "Organized source code structure",
    "package.json":        "Node.js dependency management",
    "requirements.txt":    "Python dependency management",
    "setup.py":            "Python package distribution",
    "pyproject.toml":      "Modern Python project configuration",
    "Makefile":            "Build automation via Make",
    ".env.example":        "Environment configuration templates",
    "api":                 "API layer implementation",
    "config":              "Configuration management",
}


def extract_key_features(
    file_tree: List[FileNode],
    topics: List[str],
    description: str,
) -> List[str]:
    """Derive key features from file tree contents and repo metadata."""
    features: List[str] = []
    seen: set = set()

    # Check file names against known indicators
    root_names = {node.name for node in file_tree}
    for filename, feature in _FEATURE_INDICATORS.items():
        if filename in root_names and feature not in seen:
            features.append(feature)
            seen.add(feature)

    # Add topics as features
    for topic in topics[:5]:
        feature = topic.replace("-", " ").title()
        if feature not in seen:
            features.append(feature)
            seen.add(feature)

    # Ensure we always have at least one feature
    if not features:
        features.append("Software project with standard structure")

    return features[:10]  # Cap at 10


# ──────────────────────────────────────────────
# Architecture Diagram (Mermaid text)
# ──────────────────────────────────────────────

def generate_architecture_diagram(
    project_type: str,
    languages: List[LanguageInfo],
    file_tree: List[FileNode],
) -> str:
    """Generate a simple Mermaid-style architecture diagram as text."""
    top_langs = [l.name for l in languages[:3]]
    folders = [n.name for n in file_tree if n.type == "folder"][:6]

    lines = ["graph TD"]
    lines.append(f'    A["{project_type}"] --> B["Source Code"]')

    for i, lang in enumerate(top_langs):
        node_id = chr(67 + i)  # C, D, E
        lines.append(f'    B --> {node_id}["{lang}"]')

    if folders:
        lines.append(f'    A --> F["Project Structure"]')
        for j, folder in enumerate(folders):
            node_id = f"G{j}"
            lines.append(f'    F --> {node_id}["{folder}"]')

    return "\n".join(lines)
