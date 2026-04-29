from flask import Flask, jsonify, request
from datetime import datetime
import os
import json
import requests
from dotenv import load_dotenv


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "ai-service"
    })


# Day 3 - Describe Route
@app.route("/describe", methods=["POST"])
def describe():
    data = request.get_json()

    # Validate input
    if not data or "penalty_text" not in data:
        return jsonify({
            "error": "penalty_text is required"
        }), 400

    penalty = data["penalty_text"]

    try:
        prompt_path = os.path.join(BASE_DIR, "prompts", "describe_prompt.txt")
        
        with open(prompt_path, "r", encoding="utf-8") as file:
            prompt_template = file.read()

        final_prompt = prompt_template.replace("{penalty_text}", penalty)

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "user",
                    "content": final_prompt
                }
            ],
            "temperature": 0.3
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        result = response.json()

        ai_text = result["choices"][0]["message"]["content"]

        parsed = json.loads(ai_text)

        parsed["generated_at"] = datetime.utcnow().isoformat()

        return jsonify(parsed)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# Day 4 - Recommend Route
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    # Validate input
    if not data or "penalty_text" not in data:
        return jsonify({
            "error": "penalty_text is required"
        }), 400

    penalty = data["penalty_text"]

    try:
        prompt_path = os.path.join(BASE_DIR, "prompts", "recommend_prompt.txt")

        with open(prompt_path, "r", encoding="utf-8") as file:
            prompt_template = file.read()

        final_prompt = prompt_template.replace("{penalty_text}", penalty)

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "user",
                    "content": final_prompt
                }
            ],
            "temperature": 0.3
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        result = response.json()

        ai_text = result["choices"][0]["message"]["content"]

        recommendations = json.loads(ai_text)

        return jsonify(recommendations)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# Run Flask App
if __name__ == "__main__":
    app.run(debug=True, port=5000)