# 🤖 AI Service — Regulatory Penalty Tracker

## 📌 Overview

The **AI Service** is a Flask-based microservice built for the *Regulatory Penalty Tracker* project.  
It leverages the Groq API to analyze regulatory penalty text and generate structured insights.

This service enables users to:

- Understand regulatory penalties quickly  
- Extract key insights from unstructured text  
- Generate actionable compliance recommendations  
- Produce structured reports  
- Perform semantic search on past penalties  

---

## ✨ Features

- 🧠 AI-powered penalty descriptions  
- 📊 Structured report generation  
- 📌 Actionable recommendations  
- 🔍 Semantic search using embeddings (ChromaDB)  
- ⚡ Optional Redis caching for performance optimization  
- 🛡️ Security headers for API protection  
- 🔁 Fallback responses during API failures  
- ❤️ Health monitoring with metrics  

---

## 🛠️ Tech Stack

| Category    | Technology                        |
|------------|----------------------------------|
| Language    | Python 3.x                       |
| Framework   | Flask                            |
| AI Provider | Groq API                         |
| Embeddings  | Sentence Transformers            |
| Vector DB   | ChromaDB                         |
| Caching     | Redis (optional)                 |
| Utilities   | requests, python-dotenv          |

---

## 📂 Project Structure

```text
ai-service/
│
├── routes/           # API endpoint definitions
├── services/         # Core logic (Groq, cache, metrics, logger)
├── prompts/          # Prompt templates
│
├── app.py            # Entry point
├── test_routes.py    # API testing script
├── Dockerfile
├── requirements.txt
└── README.md



You don’t want this to look like plain text dumped into GitHub — you want it to look **clean, structured, and professional Markdown**.

Here’s your **properly formatted version** (copy-paste directly into README.md):

---

````markdown
## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/KottuPrasad/regulatory-penalty-tracker.git
cd regulatory-penalty-tracker/ai-service
````

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

### 3️⃣ Activate Environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### 4️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

> 🔐 Never commit your API key.

---

## ▶️ Running the Service

```bash
python app.py
```

Service runs at:

```
http://127.0.0.1:5000
```

---

# 📡 API Reference

---

## ❤️ Health Check

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

```http
POST /describe
```

**Response**

```json
{
  "description": "Explanation of the penalty",
  "impact": "Business or compliance impact",
  "generated_at": "timestamp"
}
```

---

## 💡 Recommendations

```http
POST /recommend
```

**Response**

```json
[
  {
    "action_type": "Immediate",
    "description": "Action to take",
    "priority": "High"
  },
  {
    "action_type": "Corrective",
    "description": "Fix root cause",
    "priority": "Medium"
  },
  {
    "action_type": "Preventive",
    "description": "Avoid future issues",
    "priority": "Low"
  }
]
```

---

## 📄 Generate Report

```http
POST /generate-report
```

**Response**

```json
{
  "title": "Penalty Title",
  "summary": "Short summary",
  "overview": "Detailed explanation",
  "key_items": ["Key point 1", "Key point 2"],
  "recommendations": ["Action 1", "Action 2"],
  "generated_at": "timestamp"
}
```

---

## 🔍 Search

```http
GET /search?query=KYC
```

**Response**

```json
{
  "results": [
    ["similar penalty 1", "similar penalty 2"]
  ]
}
```

---

## 🧪 Testing

```bash
python test_routes.py
```

✔ Verifies all endpoints
⏱ Displays response time

---

## 📝 Notes

* ⚡ Redis improves performance for repeated requests
* 🔁 Fallback ensures system reliability
* 🛡️ Security headers protect against common vulnerabilities
* 📊 Metrics track response time and uptime

---

## 👨‍💻 Author

CampusPe Internship
**Role:** AI Developer 1

---

## 📄 License

For educational and internal use only.
