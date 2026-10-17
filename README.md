# Aroviax — AI Health Companion

> **A Patient-Centric, Non-Diagnostic Healthcare Communication Assistant**  
> Built for the AI Healthcare Support Hackathon using Next.js 16 (Turbopack), React 19, TypeScript, and Tailwind CSS.

---

## 🏥 Overview & Purpose

**Aroviax** is designed to bridge the communication gap between patients, caregivers, and licensed healthcare professionals. It empowers users to articulate symptoms clearly, organize clinical timelines, deconstruct complex medical terminology, redact sensitive personal health identifiers, and prepare actionable questions for clinical consultations.

### Core Non-Diagnostic Invariants
1. **Never Diagnoses:** The system strictly refuses to speculate on definitive clinical conditions or calculate diagnostic probabilities.
2. **Emergency Detection:** Employs a conservative real-time keyword safety engine (`EMERGENCY_PHRASE_LIST`) that detects acute cardiac, neurological, respiratory, and pediatric warning signs, displaying prominent emergency dispatch notices (e.g., 911 / 999).
3. **Transparent Uncertainty:** AI responses explicitly itemize what is unknown or what requires physical in-person examination.
4. **Privacy-First (Device-Side Processing):** PHI/PII inspection, redaction, and sensitive health journals operate entirely on the user's local device without external transmission.

---

## 🎨 Design System & Color Palette

Aroviax adheres to a modern, calm, accessible healthcare aesthetic:

| Role | Color Name | Hex Code |
| :--- | :--- | :--- |
| **Primary Accent** | Primary Teal | `#0D817C` |
| **Active / Hover** | Dark Teal | `#086B67` |
| **Surface** | White | `#FFFFFF` |
| **Headings & Brand** | Deep Navy | `#172554` |
| **Body Text** | Slate | `#334155` |
| **Muted Text** | Cool Grey | `#64748B` |
| **Page Background** | Off-White Slate | `#F8FAFC` |
| **Panels & Accents** | Pale Teal | `#E8F6F4` |
| **Borders** | Slate Border | `#E2E8F0` |
| **Warning** | Amber | `#B45309` |
| **Error / Emergency** | Crimson Red | `#B91C1C` |

---

## 🚀 Key Features

Aroviax includes 10 integrated healthcare communication tools accessible via the unified `/assistant` workspace and homepage:

1. **Guided Symptom Organizer (`/assistant?tab=symptom-organizer`)**
   - 6-step structured questionnaire capturing onset, duration, user-rated severity (0–10), qualities, bodily location, triggers, relieving factors, and doctor questions.
   - Outputs a clean, non-diagnostic printable summary.

2. **Doctor Visit Preparation Kit (`/assistant?tab=prepkit`)**
   - Pre-appointment planner generating structured 1-page summaries for clinicians.
   - Features caregiver attribution, medication checklists, and "What to Bring" items.

3. **Medical Term Explainer (`/assistant?tab=translator`)**
   - Demystifies medical jargon across three distinct literacy levels: *Simple*, *Standard*, and *Detailed*.
   - Includes mandatory *"What this does NOT tell you"* limitations and physician discussion questions.

4. **Document Explainer (`/assistant?tab=document`)**
   - Scans uploaded lab reports or discharge summaries.
   - Redacts PII/PHI client-side, extracts physiological concepts (CBC, lipid panel, renal function, glucose), and flags laboratory reference range ambiguities.

5. **Personal Health Notes & Timeline (`/assistant?tab=notes`)**
   - Device-side journal for tracking blood pressure, blood glucose, and daily health milestones.
   - Tagging, search, and JSON export.

6. **Medication Information Organizer (`/assistant?tab=medication`)**
   - Tracks active prescriptions, instructions, and start dates without automated dosage interpretation.
   - Provides ready-to-ask pharmacist questions.

7. **Trusted Health Sources Finder (`/assistant?tab=sources`)**
   - Curated directory of verified public health institutions (NIH, MedlinePlus, CDC, WHO, NHS, DGHS Bangladesh).
   - Zero hallucinated citations; links directly to primary authoritative sources.

8. **After-Visit Notes Clarifier (`/assistant?tab=aftervisit`)**
   - Organizes post-appointment clinician instructions, new prescriptions, and follow-up milestones into actionable checklists.

9. **Symptom Journal & Trends (`/assistant?tab=journal`)**
   - Multi-day symptom tracking with subjective severity graphs and history review.

10. **Interactive AI Consultation Chat (`/assistant?tab=chat`)**
    - Empathetic conversational interface supporting standard chat, caregiver mode, and local-only mode.
    - Full transparency accordion detailing model confidence, limitations, and physician questions.

---

## ♿ Accessibility & Usability Suite

- **Bilingual Support:** Full English (EN) and Bengali (BN — বাংলা) localization with cultural sensitivity notices.
- **Visual Adjustments:** Font scaling (Normal, Large, Extra Large), High Contrast toggle, and Dyslexia-Friendly typography support.
- **Reduced Motion:** Fully honors `prefers-reduced-motion` settings.
- **ARIA & Keyboard Navigation:** Comprehensive keyboard focus rings, role descriptors, and screen reader labels.

---

## 🔌 Backend REST API Interfaces

Aroviax provides comprehensive Next.js server-side API endpoints:

- `POST /api/chat` — Conservative non-diagnostic conversational responses with emergency interception.
- `POST /api/symptom-summary` — Formats structured symptom summaries and verifies safety signals.
- `POST /api/appointment-checklist` — Generates 1-page clinician appointment summaries.
- `POST /api/medical-terms/explain` — Deconstructs medical terminology into 3 reading levels.
- `POST /api/documents/analyze` — Redacts PHI/PII, extracts clinical concepts, and flags lab ambiguities.
- `GET /api/health-notes` & `POST /api/health-notes` — Lists and creates personal health notes.
- `GET /api/health-notes/[id]`, `PUT /api/health-notes/[id]`, `DELETE /api/health-notes/[id]` — CRUD operations for individual notes.
- `GET /api/medications` & `POST /api/medications` — Retrieves and records user-entered medications.
- `GET /api/medical-sources/search` — Queries and filters verified medical knowledge repositories.

---

## 🧪 Testing & Verification

## 🛠️ Technology Stack & Multi-Language Architecture

Aroviax is built using a clean, enterprise-grade multi-tier architecture:

- **Frontend & Web Client:** Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **AI Backend Service:** Python 3 (FastAPI, Uvicorn, Pydantic) for AI health triage, emergency detection, and medication safety validation.
- **Relational Data Layer:** PostgreSQL / SQL schemas (`db/schema.sql`, `db/seed.sql`) defining structured health journals, medications, symptom reports, and audit trails.
- **Automation & DevOps:** Shell (`.sh`) and PowerShell (`.ps1`) development automation scripts (`scripts/`), multi-stage `Dockerfile`, and Docker Compose compatibility.
- **Offline Client Utilities:** Standalone clinical visit summary HTML template (`public/health-report-template.html`) for offline access and printing.

---

## 🧪 Comprehensive Automated Testing (83 Tests)

The project includes **83 automated unit and integration tests** verifying safety invariants, privacy inspection, visit summary generation, backend services, multilingual i18n, AI provider integration, and Python FastAPI endpoints:

```bash
# Run all tests across the entire project (83 tests)
npm run test:all

# Run Node.js / TypeScript test suite (42 tests)
npm test

# Run Python FastAPI backend & validation tools test suite (41 tests)
npm run test:python

# Run ESLint validation (0 errors, 0 warnings)
npm run lint

# Build production bundle with Next.js 16 Turbopack
npm run build
```

### Verification Results
- **Node.js Test Suites:** 42 passing across 9 test suites, 0 failing (100% pass rate)
  - `tests/aiProvider.test.mjs` (5 tests): Pluggable AI provider configuration, deterministic offline fallback, non-diagnostic boundaries, emergency signal pre-emption, and mode specialization.
  - `tests/backendServices.test.mjs` (6 tests): Symptom summary formatting, safety verification, medical terms lookup, trusted sources search, health notes store, and medication management.
  - `tests/documentProcessing.test.mjs` (3 tests): PII/PHI detection and client-side redaction from clinical reports, physiological concept extraction, and 50 KB file threshold enforcement.
  - `tests/healthNotesExtended.test.mjs` (4 tests): Dated note lifecycle, timestamp calculation, deletion by ID, and case-insensitive multi-attribute search across titles, bodies, and tags.
  - `tests/i18n.test.mjs` (4 tests): Dual English (EN) and Bangla (BN — বাংলা) dictionaries, navigation key parity, translation coverage, and medical terminology preservation.
  - `tests/medicationValidation.test.mjs` (3 tests): Self-reported medication validation, pharmacist question prompt templates, and non-diagnostic disclaimers.
  - `tests/privacyInspector.test.mjs` (6 tests): Detection of email, phone, SSN / MRN, DOB, clean text verification, and multi-identifier redaction.
  - `tests/safetySignals.test.mjs` (7 tests): Emergency phrase catalog validation, acute cardiac indicators, stroke warning signs, case-insensitivity, non-emergency baseline, and non-reassurance safety invariant.
  - `tests/visitSummary.test.mjs` (4 tests): 1-page structured printable clinician summary, strict non-diagnostic boundary enforcement, caregiver attribution handling, and graceful empty field handling.
- **Python Test Suites:** 41 passing across backend and validation tools (100% pass rate)
  - `backend/tests/test_health.py` (3 tests): Health check, uptime calculation, root metadata, and governance disclaimers.
  - `backend/tests/test_emergency_detector.py` (5 tests): Acute cardiac, neurological (FAST), respiratory distress indicators, and clean input pass-through.
  - `backend/tests/test_triage.py` (2 tests): Urgency tiering (emergency vs routine), specialty routing, and clinician question formulations.
  - `backend/tests/test_terms.py` (3 tests): Plain-language medical terms translation and bilingual Bangla dictionary verification.
  - `backend/tests/test_medications.py` (2 tests): Multi-NSAID detection, blood thinner interaction cautions, and pharmacist prompt generation.
  - `backend/tests/test_chat.py` (3 tests): Conversational clinical support with automated emergency pre-emption.
  - `tools/test_validate_health_data.py` (23 tests): ISO date validation, PII redaction scanner, health notes, medications, and full JSON health dossier validation.
- **ESLint:** 0 errors, 0 warnings.
- **Production Build:** All 17 static and dynamic Next.js routes compiled successfully in Turbopack with zero warnings or type errors.

---

## ⚙️ Environment Configuration

Aroviax works **out-of-the-box with zero configuration**. If no API keys are provided, it operates seamlessly in 100% deterministic, private, non-diagnostic local mode with zero external network dependencies.

To optionally connect external AI providers or the Python FastAPI backend, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PYTHON_BACKEND_URL` | *(Optional)* Python FastAPI AI Backend endpoint. | `http://localhost:8000` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for cloud-assisted completions. | None (Deterministic Fallback) |
| `OPENAI_API_KEY` | *(Optional)* OpenAI API key for cloud-assisted completions. | None (Deterministic Fallback) |

---

## 💻 Getting Started Locally

### 1. Frontend Development (Next.js)
```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
# Accessible at http://localhost:3000
```

### 2. Python FastAPI Backend Service (Optional / Complementary)
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI backend
python backend/run.py
# API docs at http://localhost:8000/docs
```

### 3. Database Setup (PostgreSQL)
```bash
# Run schema and seed scripts
psql -d aroviax -f db/schema.sql
psql -d aroviax -f db/seed.sql
```

