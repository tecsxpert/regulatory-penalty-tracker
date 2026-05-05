from flask import Flask, jsonify, request
from datetime import datetime
import time
import os
import json
import hashlib
import requests
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# -------------------------
# Day 11 - Load Embedding Model
# -------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")
# print("Embedding loaded successfully:", len(model.encode("test sentence")))

# -------------------------
# Day 12 - ChromaDB Setup
# -------------------------
chroma_client = chromadb.Client(Settings())
collection = chroma_client.get_or_create_collection(name="penalties")


def seed_data():
    documents = [
        "RBI fined bank for KYC violation",
        "SEBI penalized company for insider trading",
        "IRDAI penalty for claim settlement delay",
        "Bank fined for AML non-compliance",
        "Penalty for delayed regulatory filings"
    ]

    embeddings = model.encode(documents).tolist()

    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=[str(i) for i in range(len(documents))]
    )


seed_data()


def search_similar(query):
    query_embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )

    return results["documents"]


# -------------------------
# Optional Redis
# -------------------------
try:
    import redis
except ImportError:
    redis = None

# -------------------------
# Env Setup
# -------------------------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)

# -------------------------
# Metrics
# -------------------------
start_time = time.time()
total_requests = 0
total_response_time = 0.0

# -------------------------
# Redis Setup
# -------------------------
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


# -------------------------
# Day 8 - Security Headers
# -------------------------
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


# -------------------------
# Helper - Groq API
# -------------------------
def call_groq(prompt_text):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt_text}
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


# -------------------------
# Helper - Metrics
# -------------------------
def update_metrics(start):
    global total_requests, total_response_time
    elapsed = (time.time() - start) * 1000
    total_requests += 1
    total_response_time += elapsed


# -------------------------
# Helper - Cache Key
# -------------------------
def generate_cache_key(prefix, text):
    raw = prefix + text
    return hashlib.sha256(raw.encode()).hexdigest()


# -------------------------
# Health Route
# -------------------------
@app.route("/health", methods=["GET"])
def health():
    uptime = int(time.time() - start_time)
    avg = round(total_response_time / total_requests, 2) if total_requests else 0

    return jsonify({
        "status": "ok",
        "service": "ai-service",
        "model": "llama-3.3-70b-versatile",
        "uptime_seconds": uptime,
        "avg_response_time_ms": avg
    })


# -------------------------
# Day 3 - Describe
# -------------------------
@app.route("/describe", methods=["POST"])
def describe():
    start = time.time()
    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({"error": "penalty_text is required"}), 400

    penalty = data["penalty_text"]

    try:
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

        if redis_client:
            redis_client.setex(cache_key, 900, json.dumps(parsed))

        update_metrics(start)
        return jsonify(parsed)

    except Exception:
        return jsonify({
            "description": "AI description unavailable.",
            "impact": "Unable to assess impact.",
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": True
        })


# -------------------------
# Day 4 - Recommend
# -------------------------
@app.route("/recommend", methods=["POST"])
def recommend():
    start = time.time()
    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({"error": "penalty_text is required"}), 400

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
            redis_client.setex(cache_key, 900, json.dumps(recommendations))

        update_metrics(start)
        return jsonify(recommendations)

    except Exception:
        return jsonify([{
            "action_type": "Review",
            "description": "Manual review required",
            "priority": "High"
        }])


# -------------------------
# Day 6 - Generate Report
# -------------------------
@app.route("/generate-report", methods=["POST"])
def generate_report():
    start = time.time()
    data = request.get_json()

    if not data or "penalty_text" not in data:
        return jsonify({"error": "penalty_text is required"}), 400

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

    except Exception:
        return jsonify({
            "title": "Penalty Report",
            "summary": "AI unavailable",
            "overview": "Manual review required",
            "key_items": [],
            "recommendations": [],
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": True
        })


# -------------------------
# Day 12 - Search Route
# -------------------------
@app.route("/search", methods=["GET", "POST"])
def search():
    if request.method == "GET":
        query = request.args.get("query")
    else:
        data = request.get_json()
        query = data.get("query")

    results = search_similar(query)

    return jsonify({
        "results": results
    })

# -------------------------
# Run App
# -------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)