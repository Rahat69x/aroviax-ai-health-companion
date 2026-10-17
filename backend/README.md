# Aroviax — Python FastAPI AI Health Companion Backend

The server-side AI health companion and clinical triage service for **Aroviax**.

## Architecture & Governance

The backend implements Aroviax's core clinical communication governance principles:
1. **Emergency Interception:** Proactively screens acute red flags (e.g. chest pain, stroke symptoms, respiratory distress, anaphylaxis) before heuristic or LLM processing.
2. **Non-Diagnostic:** Categorizes symptom urgency (emergency, prompt-care, routine-consultation, self-monitoring) and formulates structured doctor visit questions without speculating on clinical diagnoses.
3. **Non-Prescriptive:** Validates medication schedules, flags duplicate classes (e.g. overlapping NSAIDs) or anticoagulation interactions, and generates questions for pharmacists.
4. **Bilingual Clinical Support:** Delivers plain-language medical translations and analogies in both English and Bengali (Bangla).

## API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/health` / `/api/v1/health` | Service health status, uptime, and clinical disclaimer |
| `POST` | `/api/v1/triage` | Symptom organization, urgency tiering, and doctor questions |
| `GET`/`POST` | `/api/v1/terms` | Plain-language medical terminology translator |
| `POST` | `/api/v1/medications/validate` | Medication safety checks, duplication warnings & pharmacist prompts |
| `POST` | `/api/v1/chat` | Conversational clinical support with automated emergency pre-emption |

## Getting Started

### Prerequisites
- Python 3.10+

### Installation
```bash
pip install -r backend/requirements.txt
```

### Running Locally
```bash
python backend/run.py
```
The interactive Swagger API documentation will be available at `http://localhost:8000/docs`.

### Running Tests
```bash
python -m unittest discover -s backend/tests -v
```
