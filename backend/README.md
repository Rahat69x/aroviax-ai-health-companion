# Aroviax — Python FastAPI AI Health Companion Backend

The server-side AI health companion and clinical triage service for **Aroviax — AI Health Companion**.

## 🏥 Architecture & Clinical Governance

Aroviax adheres to strict clinical communication governance:
1. **Emergency Interception:** Automatically screens acute red-flag symptoms (cardiac symptoms, stroke signs FAST, severe breathing difficulty, anaphylaxis) before any heuristic or LLM processing, emitting immediate emergency guidance.
2. **Strictly Non-Diagnostic:** Helps patients structure concerns, understand clinical timelines, and formulate clinician questions without calculating diagnostic probabilities or guessing diseases.
3. **Strictly Non-Prescriptive:** Validates user-entered medication lists for safety considerations (duplicate drug classes, concurrent NSAID layering, antibiotic course reminders) without recommending dosage alterations.
4. **Transparent Limitations:** Explicitly enumerates clinical exams, vital signs, and diagnostic laboratory tests that cannot be performed through digital text.
5. **Server-Side Security:** AI provider keys remain strictly on the backend and are never sent to the client browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status, version, and clinical disclaimer |
| `POST` | `/api/chat` | Conversational clinical support with conversation history & emergency safety check |
| `GET` | `/health` / `/api/v1/health` | Extended health check with uptime |
| `POST` | `/api/v1/triage` | Structured symptom organizer and urgency tiering |
| `GET`/`POST` | `/api/v1/terms` | Plain-language medical jargon translator (English & Bangla) |
| `POST` | `/api/v1/medications/validate` | Medication safety checks and pharmacist prompt generator |

Interactive Swagger documentation is served at `http://127.0.0.1:8000/docs`.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Python 3.10 or higher
- `pip` (Python package installer)

### 2. Create Virtual Environment
```bash
# In the repository root:
python -m venv .venv

# Activate on Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Activate on Windows (Command Prompt):
.venv\Scripts\activate.bat

# Activate on macOS / Linux:
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` in the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Runtime environment (`development`, `production`). | `development` |
| `HOST` | Backend bind address. | `127.0.0.1` |
| `PORT` | Backend port. | `8000` |
| `FRONTEND_ORIGIN` | Allowed CORS origin for Next.js web client. | `http://localhost:3000` |
| `AI_API_KEY` | *(Optional)* OpenAI / Gemini API key for live LLM responses. | None (Deterministic Mode) |
| `AI_MODEL` | AI model name. | `gpt-4o-mini` |
| `AI_TIMEOUT_SECONDS` | Safety timeout before falling back to local heuristic. | `8.0` |

### 5. Run FastAPI Server
You can launch the server using either command:

**Standard Uvicorn command:**
```bash
uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

**Convenience runner:**
```bash
python backend/run.py
```

---

## 🧪 Automated Testing

Backend tests use FastAPI's `TestClient` and mock AI provider responses so they run instantly without consuming external API credits:

```bash
# Run all backend tests
python -m unittest discover -s backend/tests -v

# Run health data export validation tool tests
python -m unittest tools/test_validate_health_data.py
```

### Test Coverage Includes:
- `test_health.py`: Verifies `/api/health` success, service metadata, and secret leakage prevention.
- `test_chat.py`: Tests valid requests, multi-turn history, whitespace rejection, message length limits, emergency interception, live provider parsing, and timeout fallbacks.
- `test_emergency_detector.py`: Cardiac, neurological, and respiratory red-flag tests.
- `test_triage.py`: Severity tiering and doctor discussion question formulation.
- `test_terms.py`: Bilingual medical term explanations (English and Bangla).
- `test_medications.py`: NSAID and anticoagulant safety checks.

---

## 🔧 Frontend Connection & Troubleshooting

### Connecting to Next.js
In the Next.js `.env.local` file, configure:
```env
PYTHON_BACKEND_URL=http://localhost:8000
```
When configured, Next.js routes chat requests through the Python FastAPI backend. If the Python backend is stopped, Next.js automatically and gracefully falls back to deterministic local mode without crashing.

### Troubleshooting

- **Connection Refused (`ECONNREFUSED`):**
  Ensure the FastAPI server is running on `http://127.0.0.1:8000`. Test directly in your browser at `http://127.0.0.1:8000/api/health`.
- **CORS Errors:**
  Ensure `FRONTEND_ORIGIN` matches your Next.js frontend port (e.g., `http://localhost:3000`).
- **Missing AI Key:**
  If `AI_API_KEY` is omitted, the service safely starts and provides deterministic structured guidance. Add a valid key from [OpenAI](https://platform.openai.com) to enable live LLM synthesis.
- **Provider Timeout:**
  If an upstream provider exceeds `AI_TIMEOUT_SECONDS`, Aroviax automatically serves structured safety heuristics without exposing stack traces to the user.
