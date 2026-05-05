from flask import Blueprint, request, jsonify
from datetime import datetime
import os, json, time, hashlib

from services.groq_client import call_groq
from services.metrics import update_metrics
from services.logger import logger
from services.cache import get_cache, set_cache

describe_bp = Blueprint("describe", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def generate_cache_key(prefix, text):
    return hashlib.sha256((prefix + text).encode()).hexdigest()


@describe_bp.route("/describe", methods=["POST"])
def describe():
    start = time.time()
    logger.info("Processing /describe")

    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({"error": "penalty_text is required"}), 400

    penalty = data["penalty_text"]

    try:
        cache_key = generate_cache_key("describe:", penalty)
        cached = get_cache(cache_key)

        if cached:
            update_metrics(start)
            return jsonify(json.loads(cached))

        prompt_path = os.path.join(BASE_DIR, "prompts", "describe_prompt.txt")

        with open(prompt_path, "r", encoding="utf-8") as f:
            template = f.read()

        final_prompt = template.replace("{penalty_text}", penalty)

        ai_text = call_groq(final_prompt)
        parsed = json.loads(ai_text)

        parsed["generated_at"] = datetime.utcnow().isoformat()

        set_cache(cache_key, json.dumps(parsed))

        update_metrics(start)
        return jsonify(parsed)

    except Exception:
        logger.error("Error in /describe", exc_info=True)
        return jsonify({
            "description": "AI unavailable",
            "impact": "Unable to assess",
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": True
        })