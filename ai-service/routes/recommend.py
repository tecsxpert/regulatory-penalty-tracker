from flask import Blueprint, request, jsonify
import os, json, time, hashlib

from services.groq_client import call_groq
from services.metrics import update_metrics
from services.logger import logger
from services.cache import get_cache, set_cache

recommend_bp = Blueprint("recommend", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def generate_cache_key(prefix, text):
    return hashlib.sha256((prefix + text).encode()).hexdigest()


@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    start = time.time()
    logger.info("Processing /recommend")

    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({"error": "penalty_text is required"}), 400

    penalty = data["penalty_text"]

    try:
        cache_key = generate_cache_key("recommend:", penalty)
        cached = get_cache(cache_key)

        if cached:
            update_metrics(start)
            return jsonify(json.loads(cached))

        prompt_path = os.path.join(BASE_DIR, "prompts", "recommend_prompt.txt")

        with open(prompt_path, "r", encoding="utf-8") as f:
            template = f.read()

        final_prompt = template.replace("{penalty_text}", penalty)

        ai_text = call_groq(final_prompt)
        result = json.loads(ai_text)

        set_cache(cache_key, json.dumps(result))

        update_metrics(start)
        return jsonify(result)

    except Exception:
        logger.error("Error in /recommend", exc_info=True)
        return jsonify([
            {"action_type": "Review", "description": "Manual review required", "priority": "High"}
        ])