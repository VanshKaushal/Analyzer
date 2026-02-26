"""
Redis client — centralized connection setup with safe fallback.

If Redis is not installed or not running, returns None.
The application continues to work without caching.
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)

# ── Safe import ───────────────────────────────
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.info("Redis package not installed. Caching disabled.")

# ── Singleton client ──────────────────────────
_client: Optional["redis.Redis"] = None
_connected: bool = False


def get_redis_client() -> Optional["redis.Redis"]:
    """
    Lazily create and return a Redis client singleton.

    Returns:
        redis.Redis instance if connected, None otherwise.

    Behavior:
        - First call: attempts connection, caches the result.
        - Subsequent calls: returns the cached client (or None).
        - If Redis is unreachable, logs a warning and returns None.
        - The rest of the app works normally without Redis.
    """
    global _client, _connected

    # If redis package isn't even installed
    if not REDIS_AVAILABLE:
        return None

    # Already attempted connection
    if _connected:
        return _client

    from config import settings

    # No URL configured
    if not settings.REDIS_URL:
        logger.info("REDIS_URL not configured. Caching disabled.")
        _connected = True
        return None

    try:
        _client = redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,         # Return strings, not bytes
            socket_connect_timeout=2,      # Fail fast if Redis is down
            socket_timeout=2,              # Don't hang on read/write
            retry_on_timeout=False,        # No retries for demo simplicity
        )

        # Verify the connection is alive
        _client.ping()
        logger.info(f"✅ Redis connected at {settings.REDIS_URL}")
        _connected = True
        return _client

    except redis.ConnectionError as e:
        logger.warning(f"⚠️  Redis not reachable: {e}. Caching disabled.")
        _client = None
        _connected = True
        return None

    except Exception as e:
        logger.warning(f"⚠️  Redis error: {e}. Caching disabled.")
        _client = None
        _connected = True
        return None


def is_redis_available() -> bool:
    """Check if Redis is connected and operational."""
    client = get_redis_client()
    if client is None:
        return False
    try:
        return client.ping()
    except Exception:
        return False


def reset_client() -> None:
    """Reset the client singleton (useful for testing)."""
    global _client, _connected
    _client = None
    _connected = False
