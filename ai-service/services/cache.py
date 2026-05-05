try:
    import redis
except ImportError:
    redis = None

client = None

if redis:
    try:
        client = redis.Redis(
            host="localhost",
            port=6379,
            db=0,
            decode_responses=True
        )
        client.ping()
    except Exception:
        client = None


def get_cache(key):
    if client:
        return client.get(key)
    return None


def set_cache(key, value):
    if client:
        client.setex(key, 900, value)