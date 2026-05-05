from flask import Blueprint, jsonify
from services.metrics import get_metrics

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health():
    uptime, avg = get_metrics()

    return jsonify({
        "status": "ok",
        "service": "ai-service",
        "model": "llama-3.3-70b-versatile",
        "uptime_seconds": uptime,
        "avg_response_time_ms": avg
    })