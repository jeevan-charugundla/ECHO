import base64
import logging
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from schemas import (
    EvidenceItem,
    CreateEvidenceRequest,
    EvidenceAnalysisResult,
    InvestigationReport,
    InvestigationTask,
    TaskApprovalRequest
)
from storage import case_store
from gemini_service import (
    gemini_service,
    tool_get_evidence_details,
    tool_search_evidence,
    tool_create_investigation_task
)
from demo_data import get_deterministic_analysis_result, get_deterministic_report

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("echo.api")

app = FastAPI(
    title="ECHO — Multimodal Evidence Intelligence Engine",
    description="Investigation workspace that converts fragmented multimodal evidence into source-linked timelines, contradiction matrices, and reports using Gemma 4.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def get_health():
    import google.genai as genai
    return {
        "status": "healthy",
        "service": "ECHO Multimodal Intelligence Engine",
        "model_configured": settings.GEMMA_MODEL_ID,
        "api_key_configured": gemini_service.is_api_key_configured(),
        "sdk_version": f"google-genai {getattr(genai, '__version__', '2.18.1')}",
        "evidence_count": len(case_store.get_all_evidence()),
        "tasks_count": len(case_store.get_all_tasks()),
        "case_name": case_store.case_name,
        "investigation_status": case_store.status,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/test-gemma")
def test_gemma_connection(payload: Optional[dict] = None):
    """
    Direct verification endpoint for Gemma 4 using official Google Gen AI SDK.
    Sends a test prompt to gemma-4-26b-a4b-it, verifies availability, and returns real model response.
    Catches invalid keys, unavailable models, rate limits, network errors, and malformed responses.
    """
    import time
    import google.genai as genai
    from google.genai import errors

    if not gemini_service.is_api_key_configured():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error_type": "missing_api_key",
                "message": "GEMINI_API_KEY is not configured in backend/.env",
                "resolution": "Set GEMINI_API_KEY in backend/.env before running live Gemma 4 inference."
            }
        )

    test_prompt = (payload or {}).get(
        "prompt", 
        "State in one concise sentence your model identity and readiness for the ECHO investigation engine."
    )

    start_time = time.time()
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # Verify model list from API
        available_gemma = []
        try:
            for m in client.models.list():
                if "gemma" in m.name.lower():
                    available_gemma.append(m.name)
        except Exception as list_err:
            logger.warning(f"Could not list models: {list_err}")

        # Send actual prompt to the requested model
        response = client.models.generate_content(
            model=settings.GEMMA_MODEL_ID,
            contents=test_prompt
        )

        latency_ms = round((time.time() - start_time) * 1000, 2)
        model_text = response.text or ""
        
        if not model_text.strip():
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error_type": "malformed_response",
                    "message": "Gemma 4 model returned an empty text response."
                }
            )

        return {
            "status": "connected",
            "model": settings.GEMMA_MODEL_ID,
            "sdk_version": f"google-genai {getattr(genai, '__version__', '2.18.1')}",
            "prompt_sent": test_prompt,
            "model_response": model_text.strip(),
            "available_gemma_models": available_gemma,
            "latency_ms": latency_ms,
            "timestamp": datetime.utcnow().isoformat()
        }

    except errors.APIError as api_err:
        latency_ms = round((time.time() - start_time) * 1000, 2)
        code = getattr(api_err, "code", 500)
        err_msg = str(api_err)
        # Scrub any potential key leak
        if settings.GEMINI_API_KEY:
            err_msg = err_msg.replace(settings.GEMINI_API_KEY, "[REDACTED_API_KEY]")

        logger.error(f"Google GenAI APIError [{code}]: {err_msg}")

        if code in (401, 403) or "API_KEY_INVALID" in err_msg or "PERMISSION_DENIED" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "error_type": "invalid_api_key",
                    "message": "The provided Gemini API key was rejected by Google GenAI.",
                    "code": code,
                    "latency_ms": latency_ms
                }
            )
        elif code == 404 or "NOT_FOUND" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error_type": "model_unavailable",
                    "message": f"Requested model '{settings.GEMMA_MODEL_ID}' is not available in the current API project.",
                    "code": code,
                    "available_gemma_models": available_gemma,
                    "latency_ms": latency_ms
                }
            )
        elif code == 429 or "RESOURCE_EXHAUSTED" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error_type": "rate_limit_or_quota",
                    "message": "Rate limit or quota threshold reached on the Gemini API.",
                    "code": code,
                    "latency_ms": latency_ms
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error_type": "api_error",
                    "message": f"Google GenAI API responded with error: {err_msg}",
                    "code": code,
                    "latency_ms": latency_ms
                }
            )

    except HTTPException:
        raise

    except Exception as exc:
        latency_ms = round((time.time() - start_time) * 1000, 2)
        exc_str = str(exc)
        if settings.GEMINI_API_KEY:
            exc_str = exc_str.replace(settings.GEMINI_API_KEY, "[REDACTED_API_KEY]")

        logger.error(f"Unexpected connection error: {exc_str}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error_type": "network_or_system_error",
                "message": f"Failed to connect to Gemma 4 endpoint: {exc_str}",
                "latency_ms": latency_ms
            }
        )


@app.get("/api/demo-case")
def load_demo_case():
    """Reset locker and load the synthetic workplace security incident demo case."""
    case_store.reset_to_demo()
    return {
        "message": "Demo case 'Operation Apex Glass' loaded successfully.",
        "case_name": case_store.case_name,
        "evidence": case_store.get_all_evidence(),
        "analysis": case_store.latest_analysis,
        "report": case_store.latest_report,
        "tasks": case_store.get_all_tasks()
    }

@app.get("/api/evidence", response_model=List[EvidenceItem])
def list_evidence():
    return case_store.get_all_evidence()

@app.get("/api/evidence/{evidence_id}", response_model=EvidenceItem)
def get_evidence_item(evidence_id: str):
    item = case_store.get_evidence(evidence_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Evidence item {evidence_id} not found.")
    return item

@app.post("/api/evidence", response_model=EvidenceItem)
def create_evidence(payload: CreateEvidenceRequest):
    evidence_id = f"EVD-{len(case_store.get_all_evidence()) + 1:03d}"
    item = EvidenceItem(
        id=evidence_id,
        title=payload.title,
        source_name=payload.source_name,
        evidence_type=payload.evidence_type,
        timestamp_raw=payload.timestamp_raw,
        content_text=payload.content_text,
        image_base64=payload.image_base64,
        image_mime_type=payload.image_mime_type,
        description=payload.description,
        tags=payload.tags
    )
    case_store.add_evidence(item)
    return item

@app.post("/api/evidence/upload", response_model=EvidenceItem)
async def upload_evidence_file(
    title: str = Form(...),
    source_name: str = Form(...),
    timestamp_raw: str = Form(...),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(""),
    file: UploadFile = File(...)
):
    content_bytes = await file.read()
    mime = file.content_type or "application/octet-stream"
    
    tag_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else []
    evidence_id = f"EVD-{len(case_store.get_all_evidence()) + 1:03d}"
    
    if mime.startswith("image/"):
        ev_type = "image"
        img_b64 = base64.b64encode(content_bytes).decode("utf-8")
        item = EvidenceItem(
            id=evidence_id,
            title=title,
            source_name=source_name,
            evidence_type=ev_type,
            timestamp_raw=timestamp_raw,
            image_base64=img_b64,
            image_mime_type=mime,
            description=description,
            tags=tag_list
        )
    else:
        ev_type = "text" if "csv" not in file.filename.lower() else "csv"
        try:
            text_str = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text_str = content_bytes.decode("latin-1", errors="replace")
        
        item = EvidenceItem(
            id=evidence_id,
            title=title,
            source_name=source_name,
            evidence_type=ev_type,
            timestamp_raw=timestamp_raw,
            content_text=text_str,
            description=description,
            tags=tag_list
        )
        
    case_store.add_evidence(item)
    return item

@app.delete("/api/evidence/{evidence_id}")
def delete_evidence(evidence_id: str):
    if evidence_id in case_store.evidence:
        del case_store.evidence[evidence_id]
        return {"message": f"Evidence {evidence_id} removed."}
    raise HTTPException(status_code=404, detail="Evidence not found.")

@app.post("/api/evidence/analyze", response_model=EvidenceAnalysisResult)
def analyze_case_evidence(force_fixture: bool = False):
    """
    Run Gemma 4 multimodal analysis over all evidence in the locker.
    Returns structured JSON with direct observations, verified claims,
    contradictions, chronological timeline, and unresolved questions.
    """
    items = case_store.get_all_evidence()
    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Evidence locker is empty. Please upload evidence items or load the demo case."
        )

    try:
        analysis = gemini_service.analyze_evidence(items, force_fixture=force_fixture)
        case_store.latest_analysis = analysis
        
        # Merge proposed tasks into case tasks
        for task in analysis.proposed_tasks:
            if task.id not in case_store.tasks:
                case_store.add_task(task)
                
        return analysis
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemma 4 Analysis Failure: {str(e)}"
        )

@app.post("/api/investigation/report", response_model=InvestigationReport)
def generate_investigation_report(force_fixture: bool = False):
    """
    Synthesize an executive intelligence report anchored strictly to validated evidence.
    """
    if not case_store.latest_analysis:
        items = case_store.get_all_evidence()
        if not items:
            raise HTTPException(status_code=400, detail="Cannot generate report: no evidence available.")
        case_store.latest_analysis = gemini_service.analyze_evidence(items, force_fixture=force_fixture)

    try:
        report = gemini_service.generate_report(case_store.latest_analysis, force_fixture=force_fixture)
        case_store.latest_report = report
        return report
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Report Generation Error: {str(e)}"
        )

@app.get("/api/investigation/tasks", response_model=List[InvestigationTask])
def get_tasks():
    return case_store.get_all_tasks()

@app.post("/api/investigation/tasks", response_model=InvestigationTask)
def create_task(payload: dict):
    title = payload.get("title", "Ad-hoc Investigation Task")
    description = payload.get("description", "")
    evidence_ids = payload.get("evidence_ids", [])
    
    result = tool_create_investigation_task(title, description, evidence_ids)
    task_id = result["task_id"]
    return case_store.get_task(task_id)

@app.post("/api/investigation/tasks/action")
def perform_task_action(payload: TaskApprovalRequest):
    """
    Explicit investigator approval workflow for agentic tool actions.
    Logs action, timestamps, approver identity, and notes.
    """
    task = case_store.update_task_status(
        task_id=payload.task_id,
        action=payload.action,
        approver=payload.approver_name,
        notes=payload.notes
    )
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {payload.task_id} not found.")
    return {
        "task": task,
        "message": f"Task {payload.task_id} successfully {task.status.upper()} by {payload.approver_name}."
    }

@app.post("/api/tools/execute")
def execute_tool(tool_name: str, parameters: dict):
    """
    Application-side dispatch for declared agentic tools.
    """
    if tool_name == "get_evidence_details":
        ev_id = parameters.get("evidence_id", "")
        return tool_get_evidence_details(ev_id)
    elif tool_name == "search_evidence":
        q = parameters.get("query", "")
        return tool_search_evidence(q)
    elif tool_name == "create_investigation_task":
        title = parameters.get("title", "")
        desc = parameters.get("description", "")
        ev_ids = parameters.get("evidence_ids", [])
        return tool_create_investigation_task(title, desc, ev_ids)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown tool '{tool_name}'")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
