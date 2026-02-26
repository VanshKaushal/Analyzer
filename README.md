# SmartCode: GitHub Repo Analyzer & AI Reviewer

An end-to-end full-stack application that analyzes public GitHub repositories and provides structured insights, statistics, visualizations, and automated AI-driven Code Reviews for Pull Requests.

This project features a unified architecture where a fast React frontend is served seamlessly by a high-performance Python FastAPI backend, supported by an asynchronous Celery worker and Redis caching layer to handle webhooks and interface with Large Language Models (LLMs).

## 🚀 Features

- **Instant Analytics:** Enter any public `owner/repo` and get real-time statistics (stars, forks, languages).
- **Deep Scan Analysis (AI):** Provides deep-dive code quality insights powered by LLMs, detecting vulnerabilities and architectural improvements while calculating a dynamic repository score.
- **Smart Repository Preview:** Integrated preview system to instantly display the repository's README content and live deployment URLs right on the dashboard.
- **Automated PR Reviews (AI):** Listens to GitHub repository Webhooks for new Pull Requests, dynamically fetches the diff context, and uses an LLM (like OpenAI) to post in-depth code reviews as comments.
- **Data Visualizations:** Beautiful, responsive charts powered by Recharts on a React Dashboard.
- **Resilient Caching Layer:** Redis integration handles repetitive repository requests instantly without hitting GitHub's API rate limits. Gracefully degrades if Redis is unavailable.
- **Unified Full-Stack Deployment:** One single command builds the frontend assets and automatically mounts them onto the FastAPI server—no need to run separate dev servers.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Radix UI
- **Charts:** Recharts

### Backend
- **Framework:** FastAPI (Python 3)
- **Asynchronous Workers:** Celery
- **In-Memory Store:** Redis (via Docker)
- **AI Brain:** `openai` Python SDK

---

## 📦 Getting Started

### Prerequisites

1. **Python 3.9+** installed on your machine.
2. **Node.js (v18+)** and **npm** installed.
3. **Docker Desktop** installed (Required for the Celery task queue and caching).

### 1. Environment Setup

Create a `.env` file at the root of the project with your API keys:

```env
GITHUB_WEBHOOK_SECRET=your_secret_here
GITHUB_TOKEN=your_github_personal_access_token
REDIS_URL=redis://127.0.0.1:6379/0
LLM_PROVIDER=openai
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o
```

### 2. Start Redis (Required)

Start the Redis container which acts as the database cache and Celery message broker:

```bash
docker-compose up -d
```

### 3. Running the Unified Web Server

We provide a unified batch script that builds the React frontend, installs Python dependencies, and boots the FastAPI server (which also serves the frontend):

```cmd
run.bat
```

Wait a few seconds for the build to complete. The terminal will explicitly tell you when it's ready on `http://127.0.0.1:8000`.

### 4. Running the AI Worker (Optional - For PR Reviews)

To actively process GitHub Pull Request webhooks and generate AI code reviews, open a *new* terminal at the root of the project and run the Celery worker:

```bash
celery -A worker.celery_app worker --loglevel=info -P solo
```

*(Note: On Windows, the `-P solo` flag is required for Celery to route tasks properly).*

---

## 📂 Project Structure

```text
college-project/
├── main.py                   # FastAPI Application Gateway
├── worker.py                 # Celery Async Worker for Webhooks and LLM Calls
├── config.py                 # Environment Variable settings
├── database.py               # Redis Connection logic
├── requirements.txt          # Python dependencies
├── docker-compose.yml        # Redis container config
├── run.bat                   # Unified one-click startup script
│
├── routes/                   # API and Webhook endpoints
├── analysis_engine/          # Metrics calculation and LLM integration
├── github_integration/       # PyGithub client wrappers and Diff context extractors
├── utils/                    # Caching logic
├── frontend/                 # React frontend workspace (Vite)
└── README.md                 # Project documentation
```

## 🔌 API Endpoints

The backend exposes a well-documented REST API. When the server is running, you can view the interactive Swagger documentation at:

- `http://127.0.0.1:8000/docs`

---
*Created for college project.*
