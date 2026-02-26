"""
GitHub service — fetches repository data using PyGithub.
All calls are synchronous as required.
"""

from github import Github, GithubException
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from typing import List, Dict, Any, Optional

from config import settings
from models import FileNode, LanguageInfo, CommitInfo


def _get_github_client() -> Github:
    """Create a PyGithub client, optionally authenticated."""
    if settings.GITHUB_TOKEN:
        return Github(settings.GITHUB_TOKEN)
    return Github()  # Unauthenticated (lower rate limit)


def fetch_repo_info(repo_full_name: str) -> Dict[str, Any]:
    """Fetch basic repository information."""
    g = _get_github_client()
    repo = g.get_repo(repo_full_name)
    return {
        "name": repo.name,
        "owner": repo.owner.login,
        "description": repo.description or "",
        "topics": repo.get_topics(),
        "stars": repo.stargazers_count,
        "forks": repo.forks_count,
        "default_branch": repo.default_branch,
    }


def fetch_languages(repo_full_name: str) -> List[LanguageInfo]:
    """Fetch language breakdown with percentages."""
    g = _get_github_client()
    repo = g.get_repo(repo_full_name)
    languages_raw = repo.get_languages()  # Dict[str, int] of bytes

    total_bytes = sum(languages_raw.values())
    if total_bytes == 0:
        return []

    return [
        LanguageInfo(
            name=lang,
            percentage=round((bytes_count / total_bytes) * 100, 1),
        )
        for lang, bytes_count in sorted(
            languages_raw.items(), key=lambda x: x[1], reverse=True
        )
    ]


def fetch_commits(repo_full_name: str) -> List[CommitInfo]:
    """Fetch commits from the last 6 months, grouped by month."""
    g = _get_github_client()
    repo = g.get_repo(repo_full_name)

    six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
    commits = repo.get_commits(since=six_months_ago)

    monthly_counts: Dict[str, int] = defaultdict(int)

    # Limit to 500 commits to avoid long waits on huge repos
    for i, commit in enumerate(commits):
        if i >= 500:
            break
        commit_date = commit.commit.author.date
        month_key = commit_date.strftime("%Y-%m")
        monthly_counts[month_key] += 1

    return [
        CommitInfo(month=month, count=count)
        for month, count in sorted(monthly_counts.items())
    ]


def fetch_file_tree(
    repo_full_name: str, max_depth: int = 3
) -> List[FileNode]:
    """
    Fetch repository file tree recursively up to max_depth.
    Uses the Git tree API for efficiency.
    """
    g = _get_github_client()
    repo = g.get_repo(repo_full_name)

    try:
        tree = repo.get_git_tree(sha=repo.default_branch, recursive=True)
    except GithubException:
        # Fallback: return root contents only
        return _fetch_root_contents(repo)

    return _build_tree_from_flat(tree.tree, max_depth)


def _fetch_root_contents(repo) -> List[FileNode]:
    """Fallback: fetch only root-level contents."""
    contents = repo.get_contents("")
    nodes = []
    for item in contents:
        nodes.append(
            FileNode(
                name=item.name,
                path=item.path,
                type="folder" if item.type == "dir" else "file",
                children=[],
            )
        )
    return nodes


def _build_tree_from_flat(
    tree_elements, max_depth: int
) -> List[FileNode]:
    """Build a nested tree structure from GitHub's flat tree list."""
    root_children: List[FileNode] = []
    folder_map: Dict[str, FileNode] = {}

    for element in tree_elements:
        parts = element.path.split("/")

        # Skip items deeper than max_depth
        if len(parts) > max_depth:
            continue

        node_type = "folder" if element.type == "tree" else "file"
        node = FileNode(
            name=parts[-1],
            path=element.path,
            type=node_type,
            children=[],
        )

        if node_type == "folder":
            folder_map[element.path] = node

        if len(parts) == 1:
            # Root-level item
            root_children.append(node)
        else:
            # Find parent folder
            parent_path = "/".join(parts[:-1])
            parent = folder_map.get(parent_path)
            if parent and parent.children is not None:
                parent.children.append(node)

    return root_children


def count_files_in_tree(nodes: List[FileNode]) -> int:
    """Recursively count all files in a tree."""
    count = 0
    for node in nodes:
        if node.type == "file":
            count += 1
        if node.children:
            count += count_files_in_tree(node.children)
    return count


def fetch_preview_data(repo_full_name: str) -> Dict[str, Any]:
    """Fetch smart repository preview data gracefully."""
    g = _get_github_client()
    try:
        repo = g.get_repo(repo_full_name)
    except Exception:
        return {"type": "none", "url": None, "readme_content": None}

    # Step 1: Detect Live Deployment
    if repo.homepage and str(repo.homepage).strip() and str(repo.homepage).strip().startswith("http"):
        return {"type": "live", "url": str(repo.homepage).strip(), "readme_content": None}

    # Step 2: Fallback to README
    try:
        readme = repo.get_readme()
        markdown_string = readme.decoded_content.decode("utf-8")
        return {"type": "readme", "url": None, "readme_content": markdown_string}
    except Exception:
        # Step 3: Neither live nor readme
        return {"type": "none", "url": None, "readme_content": None}


def fetch_pr_context(repo_full_name: str, pr_number: int) -> Dict[str, Any]:
    """
    Fetch comprehensive Pull Request context including diffs and file metadata.
    """
    import requests
    import time
    
    # 1. Fetch PR Details via PyGithub
    g = _get_github_client()
    try:
        repo = g.get_repo(repo_full_name)
        pr = repo.get_pull(pr_number)
    except Exception as e:
        raise Exception(f"Failed to fetch PR {pr_number} from {repo_full_name}: {e}")

    # 2. Fetch full unified diff using requests (PyGithub doesn't natively return raw diff strings easily)
    headers = {"Accept": "application/vnd.github.v3.diff"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"
        
    api_url = f"https://api.github.com/repos/{repo_full_name}/pulls/{pr_number}"
    
    try:
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        diff_text = response.text
    except Exception as e:
        diff_text = f"** Failed to fetch diff: {e} **"

    # 3. Fetch File-Level Metadata
    try:
        pr_files = pr.get_files()
        files_metadata = []
        for f in pr_files:
            files_metadata.append({
                "filename": f.filename,
                "additions": f.additions,
                "deletions": f.deletions,
                "status": f.status,
                "patch": getattr(f, "patch", "")
            })
    except Exception as e:
        files_metadata = []

    # 4. Construct Context Object
    context = {
        "pr_title": pr.title,
        "pr_body": pr.body or "",
        "diff": diff_text,
        "files": files_metadata,
        "author": pr.user.login if pr.user else "Unknown",
        "additions": pr.additions,
        "deletions": pr.deletions,
        "commit_count": pr.commits,
        "base_ref": pr.base.ref,
        "head_ref": pr.head.ref
    }
    
    return context


def post_pr_comment(repo_full_name: str, pr_number: int, body: str) -> bool:
    """
    Post a formatted markdown review comment back to the GitHub PR.
    """
    g = _get_github_client()
    try:
        repo = g.get_repo(repo_full_name)
        pr = repo.get_issue(pr_number)  # Comments belong to the Issue API in GitHub
        pr.create_comment(body)
        return True
    except Exception as e:
        print(f"Failed to post comment to PR #{pr_number}: {e}")
        return False

