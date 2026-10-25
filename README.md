# ECHO — Multimodal Evidence Intelligence Engine

> **ECHO** is an AI-assisted investigation workspace that converts fragmented multimodal evidence (incident logs, surveillance frames, electronic keycard audits, eyewitness statements, and status updates) into a source-linked chronological timeline, rigorous contradiction analysis, and a verified intelligence report powered by **Google Gemma 4**.

---

## Architecture Overview

```
                      ┌─────────────────────────────────────────┐
                      │          ECHO React Frontend            │
                      │  (Vite + TypeScript + Tailwind CSS)     │
                      │  - Editorial Intelligence UI            │
                      │  - Evidence Locker & CCTV Inspector     │
                      │  - Timeline & Contradiction Matrix      │
                      │  - Human-in-the-Loop Task Approval      │
                      └────────────────────┬────────────────────┘
                                           │ HTTP/JSON
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │          FastAPI Backend Engine         │
                      │  (Python 3.11 + Pydantic v2 + Uvicorn)  │
                      │  - Multimodal Evidence Dispatcher       │
                      │  - Agentic Tool Action Executor         │
                      │  - Audit Log & State Persistence        │
                      └────────────────────┬────────────────────┘
                                           │ Official Google GenAI SDK
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │      Google Gemma 4 Architecture        │
                      │      Model: gemma-4-26b-a4b-it          │
                      │  - Multimodal Vision & Text Encoding    │
                      │  - Structured JSON Synthesis            │
                      │  - Source Grounding & Contradictions    │
                      └─────────────────────────────────────────┘
```

---

## Implemented Gemma 4 Capabilities

1. **Multimodal Encoding (`gemma-4-26b-a4b-it`)**:
   - Ingests native image bytes directly alongside formatted textual evidence using `google.genai.types.Part.from_bytes(data, mime_type)`.
   - Synthesizes visual clues (e.g. subject in fluorescent high-vis vest and cap carrying a Pelican 1510 storm case with camera HUD timestamp) with textual incident logs and audit trails.

2. **Source Grounding & Anti-Hallucination Constraints**:
   - Strict persona rules enforce that every observation, claim, contradiction, and event is anchored to specific Evidence IDs (e.g., `EVD-001`, `EVD-003`).
   - Distinctly labels device logs as **Explicit** timestamps and eyewitness sightings or transit intervals as **Inferred**.
   - Explicitly flags uncorroborated assertions as `unverified`.

3. **Factual Contradiction Engine**:
   - Distinguishes **Genuine Contradictions** (factually irreconcilable claims) from incomplete information.
   - Discovered the synthetic inconsistency in the demo case:
     - **Statement A:** IT Director Vikram Malhotra asserted that Server Room B was locked all evening with zero badge swipes after 20:00 UTC and an HVAC alert at 23:00 UTC.
     - **Statement B:** Lenel Reader 202-B recorded an access denial for Marcus Reed at 22:15 UTC, Master Override Key bypass at 22:28 UTC and exit at 22:39 UTC; Officer Daniels logged acoustic sensor 4A trip at 22:42 UTC with door ajar and lock scratches.

4. **Agentic Tool Workflows with Human-in-the-Loop Approval**:
   - Declared function interface:
     - `get_evidence_details(evidence_id: str)`
     - `search_evidence(query: str)`
     - `create_investigation_task(title: str, description: str, evidence_ids: list[str])`
   - Executes tools in application code.
   - When Gemma 4 proposes an investigative task, it enters a `pending_approval` state. The lead investigator must explicitly review the supporting evidence, provide operational directives, and approve the task, creating an immutable audit log.

5. **Transparent Operational Fallback**:
   - If the Gemini API key is missing or encounters a network/quota failure, the UI displays a visible error banner and offers retry or deterministic fixture mode. No synthetic AI results are fabricated.

---

## Exact Windows PowerShell Setup Commands

### 1. Prerequisites
Ensure Python (3.10+) and Node.js (v18+) are available on your system:
```powershell
python --version
node --version
npm --version
```

### 2. Configure Backend Environment
Copy the example environment file and configure your Gemini API key:
```powershell
cd c:\Users\jeeva\ECHO\backend
Copy-Item .env.example .env
```

Edit `backend\.env` with your editor or in PowerShell:
```powershell
Set-Content -Path .env -Value @"
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMMA_MODEL_ID=gemma-4-26b-a4b-it
ENVIRONMENT=development
PORT=8000
HOST=127.0.0.1
"@
```

### 3. Install Backend Dependencies & Start FastAPI Server
In your first PowerShell window:
```powershell
cd c:\Users\jeeva\ECHO\backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --host 127.0.0.1 --reload
```
*The backend API will be available at `http://127.0.0.1:8000/api/health` and Swagger docs at `http://127.0.0.1:8000/docs`.*

### 4. Install Frontend Dependencies & Start Vite Dev Server
In a second PowerShell window:
```powershell
cd c:\Users\jeeva\ECHO\frontend
npm install
npm run dev
```
*The frontend interface will open at `http://localhost:5173/`.*

---

## Complete Sample Investigation: Operation Apex Glass

ECHO comes pre-configured with a fictional workplace security incident comprising 5 multimodal evidence items:

| Evidence ID | Type | Source | Timestamp | Key Observation |
|---|---|---|---|---|
| **EVD-001** | Text | Site Security Desk (Officer Daniels) | 2026-10-24 22:42 UTC | Acoustic sensor 4A trip; door ajar 4 inches; auxiliary pin lock cylinder micro-scratched; Server Rack 04 thumb screws unscrewed. |
| **EVD-002** | Visual Image | CCTV Cam-04 Hallway Feed | 2026-10-24 22:18:14 UTC | Individual in high-vis vest and cap carrying black Pelican 1510 storm case approaching Server Room B. |
| **EVD-003** | CSV Tabular | Lenel Reader 202-B Audit Log | 2026-10-24 20:00 to 22:50 UTC | HVAC contractor Marcus Reed denied at 22:15:30 UTC; Emergency Master Override Key (B-9999) entered at 22:28:44 UTC, exited at 22:39:10 UTC. |
| **EVD-004** | Text | Eyewitness Dr. Evelyn Chen | 2026-10-24 22:25:00 UTC | Encountered individual in high-vis vest and vendor lanyard carrying heavy Pelican case exiting Stairwell B toward loading bay. |
| **EVD-005** | Text | IT Director Vikram Malhotra Memo | 2026-10-25 06:15:00 UTC | **Contradictory Claim:** Asserts zero badge swipes occurred after 20:00 UTC and attributes incident to an automated HVAC thermal sensor trip at 23:00 UTC. |

### Discovered Discrepancy Matrix
1. **Contradiction CON-01 (Critical):** Director Malhotra's assertion of zero badge activity after 20:00 UTC is directly refuted by Reader 202-B logging 3 transactions between 22:15 and 22:39 UTC.
2. **Contradiction CON-02 (High):** Director Malhotra claims alert occurred at 23:00 UTC due to HVAC sensor; first responder report establishes acoustic alarm tripped at 22:42 UTC with door physically ajar.
3. **Contradiction CON-03 (Critical):** Unbroken perimeter lock status claimed by IT executive is refuted by physical lock cylinder scratching and unlatched cold-storage arrays in Server Rack 04.

---

## API Endpoints Reference

- `GET  /api/health` — Service health, active model ID (`gemma-4-26b-a4b-it`), API key configuration status, case name.
- `GET  /api/demo-case` — Reloads the prepared synthetic 5-item investigation scenario.
- `GET  /api/evidence` — Lists all evidence in the locker.
- `POST /api/evidence` — Ingests a new text/document evidence piece.
- `POST /api/evidence/upload` — Multipart file upload supporting images (JPEG/PNG) and CSV audit logs.
- `DELETE /api/evidence/{id}` — Removes an evidence item.
- `POST /api/evidence/analyze?force_fixture=false` — Executes live Gemma 4 multimodal reasoning and structured synthesis.
- `POST /api/investigation/report` — Formulates comprehensive intelligence assessment document with evidence citations.
- `GET  /api/investigation/tasks` — Lists all proposed and approved agentic actions.
- `POST /api/investigation/tasks/action` — Records explicit investigator approval/rejection with timestamped audit logs.
- `POST /api/tools/execute` — Direct tool calling execution endpoint for testing agentic workflows.
