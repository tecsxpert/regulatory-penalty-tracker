🤖 AI Service — Regulatory Penalty Tracker

📌 Overview

The **AI Service** is a Flask-based microservice built for the *Regulatory Penalty Tracker* project.
It uses the Groq API to analyze regulatory penalty text and generate structured insights.

This service helps users:

* Quickly understand regulatory penalties
* Extract key information from unstructured text
* Get actionable compliance recommendations
* Generate structured reports

---

✨ Features

* 🧠 AI-powered penalty descriptions
* 📊 Structured report generation
* 📌 Actionable recommendations
* ⚡ Redis caching for faster responses
* 🛡️ Security headers enabled
* 🔁 Fallback responses during API failures
* ❤️ Health monitoring endpoint

---

🛠️ Tech Stack

| Category    | Technology              |
| ----------- | ----------------------- |
| Language    | Python 3.x              |
| Framework   | Flask                   |
| AI Provider | Groq API                |
| Caching     | Redis / Memurai         |
| Libraries   | requests, python-dotenv |

---

📂 Project Structure

```text
ai-service/
│── app.py                # Main Flask application
│── test_routes.py        # Endpoint testing script
│── requirements.txt      # Dependencies
│── .env                  # Environment variables
│── README.md             # Documentation
└── prompts/
    ├── describe_prompt.txt
    ├── recommend_prompt.txt
    └── report_prompt.txt
```

---

🚀 Getting Started

1️⃣ Clone the Repository

```bash
git clone https://github.com/KottuPrasad/regulatory-penalty-tracker.git
cd regulatory-penalty-tracker/ai-service
```

2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

3️⃣ Activate Environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

4️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

⚙️ Environment Variables

Create a `.env` file inside `ai-service/`:

```env
GROQ_API_KEY=your_api_key_here
```

> 🔐 Keep your API key secure and never commit it to version control.

---

## ▶️ Running the Service

```bash
python app.py
```

📍 Service will run at:

```
http://127.0.0.1:5000
```

---

# 📡 API Reference

---

## ❤️ Health Check

**Endpoint**

```http
GET /health
```

**Response**

```json
{
  "status": "ok",
  "service": "ai-service",
  "model": "llama-3.3-70b-versatile",
  "uptime_seconds": 120,
  "avg_response_time_ms": 220
}
```

---

## 🧾 Describe Penalty

**Endpoint**

```http
POST /describe
```

**Request**

```json
{
  "penalty_text": "RBI imposed penalty on XYZ Bank for KYC violations."
}
```

**Response**

```json
{
  "description": "The penalty was imposed due to non-compliance with KYC rules.",
  "impact": "The bank may face financial and reputational impact.",
  "generated_at": "2026-04-29T14:00:00"
}
```

---

## 💡 Recommendations

**Endpoint**

```http
POST /recommend
```

**Request**

```json
{
  "penalty_text": "SEBI fined ABC Ltd for delayed filings."
}
```

**Response**

```json
[
  {
    "action_type": "Immediate",
    "description": "Complete all pending filings immediately.",
    "priority": "High"
  }
]
```

---

## 📄 Generate Report

**Endpoint**

```http
POST /generate-report
```

**Request**

```json
{
  "penalty_text": "IRDAI penalized DEF Insurance for claim settlement violations."
}
```

**Response**

```json
{
  "title": "Penalty Report",
  "summary": "Penalty issued due to claim settlement violations.",
  "overview": "Operational gaps were identified in claim processing.",
  "generated_at": "2026-04-29T14:00:00"
}
```
🧪 Testing

Run the test script:

```bash
python test_routes.py
```

✔️ Verifies all endpoints
⏱️ Displays response times

---

📝 Notes

* ⚡ Redis caching improves repeated request speed
* 🔁 Fallback responses handle API downtime gracefully
* 🛡️ Security headers are applied to all responses

---

👨‍💻 Author

**CampusPe Internship Project**
**Role:** AI Developer 1

---

📄 License

For educational and internal use only.
