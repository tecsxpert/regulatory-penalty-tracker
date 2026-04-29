from flask import Flask, jsonify, request
from datetime import datetime
import time
import os
import json
import hashlib
import requests
from dotenv import load_dotenv

# Optional Redis import
try:
    import redis
except ImportError:
    redis = None

   # Load Environment Variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)

# Day 7 - App Metrics
start_time = time.time()
total_requests = 0
total_response_time = 0.0

# Day 7 - Redis Setup
redis_client = None

if redis:
    try:
        redis_client = redis.Redis(
            host="localhost",
            port=6379,
            db=0,
            decode_responses=True
        )
        redis_client.ping()
        print("Redis connected successfully.")
    except Exception as e:
        print("Redis not available:", e)
        redis_client = None


# Day 8 - Security Headers
@app.after_request
def add_security_headers(response):
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Cache-Control"] = "no-store"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# Helper - Groq API Call
def call_groq(prompt_text):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "user",
                "content": prompt_text
            }
        ],
        "temperature": 0.3
    }

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=8
    )

    result = response.json()
    return result["choices"][0]["message"]["content"]


# Helper - Metrics
def update_metrics(start):
    global total_requests, total_response_time

    elapsed = (time.time() - start) * 1000
    total_requests += 1
    total_response_time += elapsed


# Helper - Cache Key
def generate_cache_key(prefix, text):
    raw = prefix + text
    return hashlib.sha256(raw.encode()).hexdigest()


# Day 7 - Enhanced Health Route
@app.route("/health", methods=["GET"])
def health():
    uptime = int(time.time() - start_time)

    avg = 0
    if total_requests > 0:
        avg = round(total_response_time / total_requests, 2)

    return jsonify({
        "status": "ok",
        "service": "ai-service",
        "model": "llama-3.3-70b-versatile",
        "uptime_seconds": uptime,
        "avg_response_time_ms": avg
    })


# Day 3 - Describe Route
@app.route("/describe", methods=["POST"])
def describe():
    start = time.time()

    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({
            "error": "penalty_text is required"
        }), 400

    penalty = data["penalty_text"]

    try:
        # Redis Cache Check
        cache_key = generate_cache_key("describe:", penalty)

        if redis_client:
            cached = redis_client.get(cache_key)
            if cached:
                update_metrics(start)
                return jsonify(json.loads(cached))

        prompt_path = os.path.join(BASE_DIR, "prompts", "describe_prompt.txt")

        with open(prompt_path, "r", encoding="utf-8") as file:
            prompt_template = file.read()

        final_prompt = prompt_template.replace("{penalty_text}", penalty)

        ai_text = call_groq(final_prompt)

        parsed = json.loads(ai_text)
        parsed["generated_at"] = datetime.utcnow().isoformat()

        # Save Cache 15 min
        if redis_client:
            redis_client.setex(cache_key, 900, json.dumps(parsed))

        update_metrics(start)
        return jsonify(parsed)

    except Exception:
        return jsonify({
            "description": "AI description unavailable currently.",
            "impact": "Unable to assess impact currently.",
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": True
        })


# Day 4 - Recommend Route
@app.route("/recommend", methods=["POST"])
def recommend():
    start = time.time()

    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({
            "error": "penalty_text is required"
        }), 400

    penalty = data["penalty_text"]

    try:
        cache_key = generate_cache_key("recommend:", penalty)

        if redis_client:
            cached = redis_client.get(cache_key)
            if cached:
                update_metrics(start)
                return jsonify(json.loads(cached))

        prompt_path = os.path.join(BASE_DIR, "prompts", "recommend_prompt.txt")

        with open(prompt_path, "r", encoding="utf-8") as file:
            prompt_template = file.read()

        final_prompt = prompt_template.replace("{penalty_text}", penalty)

        ai_text = call_groq(final_prompt)

        recommendations = json.loads(ai_text)

        if redis_client:
            redis_client.setex(
                cache_key,
                900,
                json.dumps(recommendations)
            )

        update_metrics(start)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify([
            {
                "action_type": "Review",
                "description": "Manually review this penalty notice.",
                "priority": "High"
            },
            {
                "action_type": "Compliance",
                "description": "Check internal compliance processes.",
                "priority": "Medium"
            },
            {
                "action_type": "Escalate",
                "description": "Escalate to concerned team if required.",
                "priority": "Medium"
            }
        ])


# Day 6 - Generate Report Route
@app.route("/generate-report", methods=["POST"])
def generate_report():
    start = time.time()

    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({
            "error": "penalty_text is required"
        }), 400

    penalty = data["penalty_text"]

    try:
        prompt_path = os.path.join(BASE_DIR, "prompts", "report_prompt.txt")

        with open(prompt_path, "r", encoding="utf-8") as file:
            prompt_template = file.read()

        final_prompt = prompt_template.replace("{penalty_text}", penalty)

        ai_text = call_groq(final_prompt)

        report = json.loads(ai_text)
        report["generated_at"] = datetime.utcnow().isoformat()

        update_metrics(start)
        return jsonify(report)

    except Exception as e:
        return jsonify({
            "title": "Penalty Report",
            "summary": "AI report unavailable currently.",
            "overview": "Please review penalty manually.",
            "key_items": [],
            "recommendations": [],
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": True
        })


# Run Flask App
if __name__ == "__main__":
    app.run(debug=True, port=5000)