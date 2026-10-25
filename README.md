# ECHO — Multimodal Evidence Intelligence Engine

[![Gemma 4 Powered](https://img.shields.io/badge/Model-Gemma%204%20(26B--A4B--IT)-315EFB?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![SDK](https://img.shields.io/badge/SDK-Google%20Gen%20AI%20v2.18-10B981?style=for-the-badge)](https://github.com/googleapis/python-genai)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Pydantic%20v2-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Styling](https://img.shields.io/badge/Design-Enterprise%20Editorial%20Intelligence-172033?style=for-the-badge)](https://tailwindcss.com/)

> **ECHO** is an AI-assisted investigation workspace designed for corporate forensic investigators, security analysts, and compliance teams. It transforms fragmented multimodal evidence—surveillance frames, badge card audit logs, physical incident logs, witness depositions, and conflicting executive memos—into a verifiable, source-linked chronological timeline, deep contradiction analysis, and a publication-ready intelligence briefing powered by **Google Gemma 4**.

---

## The Problem: The Fragmented Evidence Bottleneck

In real-world security breaches and corporate compliance investigations, evidence is messy, scattered, and multi-modal:
- **Visual Evidence:** High-definition CCTV stills with camera HUD timestamps and unidentified subjects.
- **Audit Trails:** Raw CSV records from physical access control readers.
- **Field Reports:** Unstructured physical incident logs from security officers.
- **Eyewitness Testimony:** Qualitative human interviews with approximate timestamps.
- **Contradictory Narratives:** Misleading or erroneous status updates from internal stakeholders.

Human investigators spend hours manually cross-referencing timestamps, verifying claims, and spotting discrepancies. Traditional AI chatbots hallucinate dates, confuse causality, and cannot provide source-grounded evidence citations.

**ECHO solves this.** It applies **Google Gemma 4's Mixture-of-Experts multimodal architecture** (`gemma-4-26b-a4b-it`) to cross-correlate disparate evidence streams with zero hallucination tolerance, discovering inconsistencies and proposing verifiable investigative actions.

---

## Key Capabilities

### 1. Multimodal Evidence Locker & Visual Inspection
- Ingest raw image bytes (CCTV video stills, physical lock damage photos) alongside structured CSV access logs and unstructured narrative text.
- Full forensic metadata tracking (Evidence IDs, source origins, timestamps, SHA hashes, and tags).
- Built-in high-resolution inspection viewer displaying camera HUD overlays, telemetry timestamps, and original raw transcripts.

### 2. Rigorous Contradiction Matrix
- Performs deep cross-examination of assertions against physical telemetry and digital audit logs.
- Distinguishes **Genuine Contradictions** (factually irreconcilable statements) from merely incomplete information gaps.
- Renders side-by-side comparative split cards contrasting **Claim A** vs **Claim B**, accompanied by severity indicators and concrete reconciliation directives.

### 3. Chronological Reconstruction (Explicit vs Inferred)
- Automatically aligns fragmented timestamps into a unified chronological sequence.
- Strictly labels timestamps as **Explicit Device Logs** (machine-authenticated records) or **Inferred Sequences** (eyewitness approximations and transit intervals), preventing false precision.
- Every event is anchored to primary and corroborating Evidence IDs.

### 4. Human-in-the-Loop Agentic Tool Authorization
- Implements real tool-calling workflows:
  - `get_evidence_details(evidence_id)`
  - `search_evidence(query)`
  - `create_investigation_task(title, description, evidence_ids)`
- When Gemma 4 identifies investigative gaps, it proposes operational tasks. Tasks remain in a `pending_approval` state until a lead investigator explicitly reviews the supporting evidence, supplies operational directives, and authorizes dispatch, generating an immutable audit record.

### 5. Publication-Ready Intelligence Briefing
- One-click synthesis of an executive investigation report conforming to enterprise legal and law enforcement briefing standards.
- Includes executive summary, key findings matrix, chronological sequence table, identified contradictions, limitations, and recommended next steps.
- Clean print/PDF layout (hiding all navigation and UI chrome) and Copy Markdown export.

---

## Architecture Overview

```
                      ┌─────────────────────────────────────────┐
                      │          ECHO React Frontend            │
                      │  (Vite + TypeScript + Tailwind CSS)     │
                      │  - Enterprise Editorial Workspace       │
                      │  - Collapsible Sidebar Navigation       │
                      │  - Evidence Locker & High-Res Inspector │
                      │  - Timeline & Split Contradiction Cards │
                      │  - Human-in-the-Loop Task Approval      │
                      └────────────────────┬────────────────────┘
                                           │ HTTP/JSON (Port 8000 Proxy)
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │          FastAPI Backend Engine         │
                      │  (Python 3.11 + Pydantic v2 + Uvicorn)  │
                      │  - Multimodal Multipart File Ingestion  │
                      │  - Declared Agentic Tool Dispatcher     │
                      │  - Immutable Task Audit Logger          │
                      │  - Deterministic Verified Fixture Cache │
                      └────────────────────┬────────────────────┘
                                           │ Official Google Gen AI SDK
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │      Google Gemma 4 Architecture        │
                      │       Model: gemma-4-26b-a4b-it         │
                      │  - Mixture-of-Experts Multimodal Vision │
                      │  - Native Structured JSON Generation    │
                      │  - Source Grounding & Anti-Hallucination│
                      └─────────────────────────────────────────┘
```

---

## Live Investigation Showcase: *Operation Apex Glass*

ECHO includes a pre-configured synthetic workplace security incident featuring 5 multimodal evidence items:

| Evidence ID | Modality | Source Origin | Timestamp | Key Forensic Finding |
|---|---|---|---|---|
| **EVD-001** | Text | Site Security Desk (Officer Daniels) | 2026-10-24 22:42 UTC | Acoustic sensor 4A trip; door ajar 4 inches; auxiliary pin lock cylinder micro-scratched; Server Rack 04 thumb screws unscrewed. |
| **EVD-002** | Visual Still | CCTV Cam-04 Hallway Feed | 2026-10-24 22:18:14 UTC | Individual in high-vis technician vest and cap carrying black Pelican 1510 storm case approaching Server Room B. |
| **EVD-003** | CSV Audit | Lenel Reader 202-B Access Control | 2026-10-24 20:00 to 22:50 UTC | HVAC contractor Marcus Reed denied at 22:15:30 UTC; Emergency Master Override Key (B-9999) entered at 22:28:44 UTC, exited at 22:39:10 UTC. |
| **EVD-004** | Text | Eyewitness Dr. Evelyn Chen | 2026-10-24 22:25:00 UTC | Encountered individual in high-vis vest and orange visitor lanyard carrying heavy Pelican case exiting Stairwell B toward loading bay. |
| **EVD-005** | Text | IT Director Vikram Malhotra Memo | 2026-10-25 06:15:00 UTC | **Critical Contradiction:** Asserts zero badge swipes occurred after 20:00 UTC, room remained locked all night, and alert was an HVAC sensor trip at 23:00 UTC. |

### Discovered Contradiction Matrix
1. **Contradiction CON-01 (Critical):** IT Director's assertion of zero activity after 20:00 UTC is directly refuted by Reader 202-B logging Marcus Reed's attempt at 22:15 UTC and Master Override Key entry/exit between 22:28 and 22:39 UTC.
2. **Contradiction CON-02 (High):** IT Director's claim of a 23:00 UTC automated HVAC alert contradicts security officer logs proving an acoustic sensor 4A alarm tripped at 22:42 UTC with door physically ajar.
3. **Contradiction CON-03 (Critical):** Claim of unbroken perimeter security contradicts physical first-responder findings of auxiliary lock tool scratching and removed cold-storage array fasteners.

---

## Getting Started (Windows PowerShell)

### 1. Prerequisites
Ensure you have Python 3.11+ and Node.js v18+ installed:
```powershell
python --version
node --version
npm --version
```

### 2. Backend Setup
```powershell
cd c:\Users\jeeva\ECHO\backend

# Copy environment template
Copy-Item .env.example .env

# Set your Gemini API key in backend\.env
# GEMINI_API_KEY=your_api_key_here
# GEMMA_MODEL_ID=gemma-4-26b-a4b-it

# Install dependencies & launch FastAPI backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --host 127.0.0.1 --reload
```
*Backend runs on `http://127.0.0.1:8000` (Swagger interactive docs at `/docs`).*

### 3. Frontend Setup
In a new PowerShell window:
```powershell
cd c:\Users\jeeva\ECHO\frontend

# Install dependencies & start Vite dev server
npm install
npm run dev
```
*Frontend workspace opens at `http://localhost:5173`.*

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status, active model ID (`gemma-4-26b-a4b-it`), and API key configuration status without leaking secrets. |
| `POST` | `/api/test-gemma` | Sends a prompt to the real Gemma 4 model via Google GenAI SDK and returns latency and response. |
| `GET` | `/api/demo-case` | Resets and loads the prepared 5-item multimodal security incident case. |
| `GET` | `/api/evidence` | Lists all evidence items in the locker. |
| `POST` | `/api/evidence` | Ingests a new text/document evidence piece. |
| `POST` | `/api/evidence/upload` | Multipart file upload supporting JPEG/PNG images and CSV logs. |
| `DELETE` | `/api/evidence/{id}` | Deletes an evidence item. |
| `POST` | `/api/evidence/analyze` | Executes live Gemma 4 multimodal reasoning and structured synthesis. |
| `POST` | `/api/investigation/report` | Generates a publication-grade intelligence assessment document. |
| `GET` | `/api/investigation/tasks` | Lists all proposed, approved, and rejected agentic tasks. |
| `POST` | `/api/investigation/tasks/action` | Authorizes or rejects a task with explicit reviewer identity and audit notes. |
| `POST` | `/api/tools/execute` | Direct tool execution endpoint for testing agentic function calls. |

---

## Security & Anti-Hallucination Principles

1. **Zero Exposure of Secrets:** API keys are read exclusively in the backend environment (`backend/.env`) and ignored via `.gitignore`. No frontend code or network responses ever transmit secrets.
2. **Source-Linked Findings:** Every finding, claim, observation, and timeline event is strictly mapped to explicit Evidence IDs (`EVD-001` through `EVD-005`). Claims without evidence are tagged `unverified`.
3. **No Fabricated AI Outputs:** If the Gemma 4 API key is missing or encounters rate limits, the workspace displays clear error banners with retry options, or offers the verified deterministic fixture mode.
4. **Human Authorization Safeguard:** No agentic tool action can be dispatched without explicit human sign-off.

---

## License

MIT License. Developed for advanced multimodal evidence intelligence and forensic research.
