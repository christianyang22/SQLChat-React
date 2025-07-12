from typing import Any
from cachetools import TTLCache

_TTL_SECONDS = 3600
_cache: TTLCache[int, Any] = TTLCache(maxsize=100, ttl=_TTL_SECONDS)


def get(key: int) -> Any | None:
    return _cache.get(key)


def set(key: int, value: Any) -> None:
    _cache[key] = value