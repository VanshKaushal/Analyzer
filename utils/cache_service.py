"""
Cache service — stores and retrieves repo analysis results from Redis.

Key format:   analysis:{owner}:{repo}
TTL:          3600 seconds (1 hour)
Fallback:     If Redis is unavailable, every call safely returns None / no-ops.
"""

import json
import logging
from typing import Optional

from database import get_redis_client

logger = logging.getLogger(__name__)

# ── Configuration ─────────────────────────────
CACHE_TTL = 3600  # 1 hour in seconds
KEY_PREFIX = "analysis"


def _build_key(owner: str, repo: str) -> str:
    """Build the Redis key: analysis:{owner}:{repo}"""
    return f"{KEY_PREFIX}:{owner}:{repo}"


# ──────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────

def get_analysis(owner: str, repo: str) -> Optional[dict]:
    """
    Retrieve a cached analysis result.

    Args:
        owner: GitHub repository owner (e.g. "facebook")
        repo:  GitHub repository name  (e.g. "react")

    Returns:
        Deserialized analysis dict if cache hit, None otherwise.
    """
    client = get_redis_client()
    if client is None:
        return None

    key = _build_key(owner, repo)

    try:
        raw = client.get(key)
        if raw is not None:
            logger.info(f"🟢 Cache HIT  → {key}")
            return json.loads(raw)
        else:
            logger.info(f"⚪ Cache MISS → {key}")
            return None

    except Exception as e:
        logger.warning(f"Cache read error for {key}: {e}")
        return None


def set_analysis(owner: str, repo: str, data: dict) -> bool:
    """
    Store an analysis result in Redis with a 1-hour TTL.

    Args:
        owner: GitHub repository owner
        repo:  GitHub repository name
        data:  The full analysis dict (must be JSON-serializable)

    Returns:
        True if stored successfully, False otherwise.
    """
    client = get_redis_client()
    if client is None:
        return False

    key = _build_key(owner, repo)

    try:
        serialized = json.dumps(data, default=str)
        client.setex(key, CACHE_TTL, serialized)
        logger.info(f"💾 Cached     → {key}  (TTL={CACHE_TTL}s)")
        return True

    except Exception as e:
        logger.warning(f"Cache write error for {key}: {e}")
        return False


def delete_analysis(owner: str, repo: str) -> bool:
    """
    Remove a cached analysis result (useful for re-analysis).

    Returns:
        True if the key was deleted, False otherwise.
    """
    client = get_redis_client()
    if client is None:
        return False

    key = _build_key(owner, repo)

    try:
        deleted = client.delete(key)
        logger.info(f"🗑️  Deleted    → {key}  (keys removed: {deleted})")
        return deleted > 0

    except Exception as e:
        logger.warning(f"Cache delete error for {key}: {e}")
        return False


def get_cache_status() -> dict:
    """
    Return cache health info (for diagnostics / health endpoint).
    """
    client = get_redis_client()
    if client is None:
        return {"available": False, "message": "Redis not connected"}

    try:
        info = client.info(section="memory")
        db_size = client.dbsize()
        return {
            "available": True,
            "keys_stored": db_size,
            "memory_used": info.get("used_memory_human", "unknown"),
            "ttl_seconds": CACHE_TTL,
        }
    except Exception as e:
        return {"available": False, "message": str(e)}
