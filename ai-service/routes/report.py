from flask import Blueprint, request, jsonify
from datetime import datetime
import os, json, time

from services.groq_client import call_groq
from services.metrics import update_metrics
from services.logger import logger

report_bp = Blueprint("report", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@report_bp.route("/generate-report", methods=["POST"])
def generate_report():
    start = time.time()
    logger.info("Processing /generate-report")

    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({"error": "penalty_text is required"}), 400

    penalty = data["penalty_text"]

    try:
        prompt_path = os.path.join(BASE_DIR, "prompts", "report_prompt.txt")

        with open(prompt_path, "r", encoding="utf-8") as f:
            template = f.read()

        final_prompt = template.replace("{penalty_text}", penalty)

        ai_text = call_groq(final_prompt)
        report = json.loads(ai_text)

        report["generated_at"] = datetime.utcnow().isoformat()

        update_metrics(start)
        return jsonify(report)

    except Exception:
        logger.error("Error in /generate-report", exc_info=True)
        return jsonify({
            "title": "Penalty Report",
            "summary": "AI unavailable",
            "overview": "Manual review required",
            "key_items": [],
            "recommendations": [],
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": True
        })