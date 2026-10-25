import json
import base64
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import ValidationError

from config import settings
from schemas import (
    EvidenceItem,
    EvidenceAnalysisResult,
    DirectObservation,
    Claim,
    Contradiction,
    TimelineEvent,
    UnresolvedQuestion,
    InvestigationTask,
    InvestigationReport
)
from demo_data import get_deterministic_analysis_result, get_deterministic_report
from storage import case_store

logger = logging.getLogger("echo.gemini_service")

# --- Agentic Tool Declarations ---
def tool_get_evidence_details(evidence_id: str) -> Dict[str, Any]:
    """Retrieve full metadata, transcript, or details for an evidence item."""
    item = case_store.get_evidence(evidence_id)
    if not item:
        return {"error": f"Evidence {evidence_id} not found in case locker"}
    return {
        "id": item.id,
        "title": item.title,
        "source_name": item.source_name,
        "evidence_type": item.evidence_type,
        "timestamp_raw": item.timestamp_raw,
        "content_excerpt": (item.content_text[:300] + "...") if item.content_text and len(item.content_text) > 300 else item.content_text,
        "has_image": bool(item.image_base64),
        "tags": item.tags
    }

def tool_search_evidence(query: str) -> List[Dict[str, Any]]:
    """Search all items in the evidence locker by text query."""
    matches = case_store.search_evidence_items(query)
    return [
        {
            "id": m.id,
            "title": m.title,
            "source_name": m.source_name,
            "type": m.evidence_type,
            "timestamp": m.timestamp_raw
        }
        for m in matches
    ]

def tool_create_investigation_task(title: str, description: str, evidence_ids: List[str]) -> Dict[str, Any]:
    """
    Propose an investigation task requiring explicit investigator approval.
    """
    task_id = f"TSK-G4-{datetime.utcnow().strftime('%H%M%S')}"
    new_task = InvestigationTask(
        id=task_id,
        title=title,
        description=description,
        evidence_ids=evidence_ids,
        status="pending_approval",
        audit_log=[
            f"[{datetime.utcnow().isoformat()}] PROPOSED by Gemma 4 agentic tool [create_investigation_task]. Awaiting human investigator review."
        ]
    )
    case_store.add_task(new_task)
    return {
        "task_id": task_id,
        "status": "pending_approval",
        "message": f"Task '{title}' queued. Requires explicit user authorization before execution.",
        "evidence_ids": evidence_ids
    }

def build_system_prompt() -> str:
    return """You are ECHO, an enterprise-grade multimodal investigation intelligence engine powered by Gemma 4.
Your mandate is to analyze fragmented evidence and synthesize:
1. Direct factual observations strictly tied to specific source evidence items.
2. Verified claims (supported, contradicted, or unverified).
3. Genuine contradictions (distinguish genuine mutual factual incompatibilities from merely missing or incomplete info).
4. Reconstructed chronological timeline (explicit timestamps MUST be separated from inferred sequencing).
5. Unresolved investigative questions.
6. Recommended actionable tasks to resolve discrepancies.

CRITICAL INVESTIGATION RULES:
- NEVER invent timestamps, sources, people, or quotations.
- A claim without direct supporting evidence MUST be labeled 'unverified'.
- Distinguish model inference from direct observation explicitly.
- For EVERY finding, observation, claim, or event, you MUST cite the exact source evidence IDs (e.g. EVD-001, EVD-002).
- Return valid JSON strictly adhering to the schema below without any enclosing code blocks or markdown wrappers.

JSON SCHEMA REQUIREMENT:
{
  "case_name": string,
  "analyzed_at": string (ISO),
  "model_used": string,
  "is_fixture_data": false,
  "evidence_count": integer,
  "direct_observations": [
    {
      "evidence_id": string,
      "observation": string,
      "modality": "visual" | "textual" | "tabular",
      "verifiable": boolean
    }
  ],
  "claims": [
    {
      "id": string (e.g. CLM-01),
      "statement": string,
      "evidence_id": string,
      "source_name": string,
      "claim_type": "supported" | "contradicted" | "unverified",
      "confidence": float (0.0 to 1.0),
      "rationale": string
    }
  ],
  "contradictions": [
    {
      "id": string (e.g. CON-01),
      "claim_a": string,
      "claim_b": string,
      "evidence_a_id": string,
      "evidence_b_id": string,
      "source_a": string,
      "source_b": string,
      "conflict_summary": string,
      "is_genuine_contradiction": boolean,
      "severity": "critical" | "high" | "medium" | "low",
      "suggested_reconciliation": string
    }
  ],
  "timeline": [
    {
      "id": string (e.g. EVT-01),
      "timestamp": string,
      "is_inferred": boolean,
      "title": string,
      "description": string,
      "primary_evidence_id": string,
      "supporting_evidence_ids": [string],
      "confidence": float
    }
  ],
  "unresolved_questions": [
    {
      "id": string (e.g. QST-01),
      "question": string,
      "related_evidence_ids": [string],
      "recommended_action": string,
      "priority": "urgent" | "high" | "medium"
    }
  ],
  "proposed_tasks": [
    {
      "id": string (e.g. TSK-01),
      "title": string,
      "description": string,
      "evidence_ids": [string],
      "status": "pending_approval",
      "audit_log": [string]
    }
  ],
  "overall_confidence": float (0.0 to 1.0),
  "executive_overview": string
}"""

class GeminiService:
    def __init__(self):
        self._client = None

    def get_client(self):
        if not settings.GEMINI_API_KEY:
            return None
        if self._client is None:
            try:
                from google import genai
                self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize google-genai Client: {e}")
                raise
        return self._client

    def is_api_key_configured(self) -> bool:
        return bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)

    def analyze_evidence(self, evidence_items: List[EvidenceItem], force_fixture: bool = False) -> EvidenceAnalysisResult:
        if force_fixture or not self.is_api_key_configured():
            if not force_fixture and not self.is_api_key_configured():
                logger.warning("No GEMINI_API_KEY set; returning deterministic demo fixture.")
            result = get_deterministic_analysis_result()
            result.case_name = settings.CASE_NAME
            result.evidence_count = len(evidence_items)
            return result

        client = self.get_client()
        if not client:
            raise ValueError("Google GenAI client could not be initialized. Verify GEMINI_API_KEY.")

        from google.genai import types

        contents = []
        # Add system context and guidelines
        contents.append(build_system_prompt())

        # Construct prompt bundle with evidence items
        evidence_summary_text = [
            f"\n--- BEGIN EVIDENCE LOCKER ({len(evidence_items)} ITEMS) ---"
        ]

        for item in evidence_items:
            evidence_summary_text.append(f"\n[EVIDENCE ITEM ID: {item.id}]")
            evidence_summary_text.append(f"Title: {item.title}")
            evidence_summary_text.append(f"Source: {item.source_name}")
            evidence_summary_text.append(f"Type: {item.evidence_type}")
            evidence_summary_text.append(f"Recorded Timestamp: {item.timestamp_raw}")
            if item.description:
                evidence_summary_text.append(f"Description: {item.description}")
            if item.content_text:
                evidence_summary_text.append(f"Content / Transcript:\n{item.content_text}")
            
            # If item has image payload, append Part
            if item.evidence_type == "image" and item.image_base64:
                try:
                    img_bytes = base64.b64decode(item.image_base64)
                    mime = item.image_mime_type or "image/jpeg"
                    part = types.Part.from_bytes(data=img_bytes, mime_type=mime)
                    contents.append(f"Attached visual image file for Evidence ID {item.id}:")
                    contents.append(part)
                except Exception as img_err:
                    logger.warning(f"Could not decode image for {item.id}: {img_err}")

        evidence_summary_text.append("\n--- END EVIDENCE LOCKER ---")
        evidence_summary_text.append("\nExecute full investigation synthesis now. Output strict structured JSON:")

        contents.append("\n".join(evidence_summary_text))

        try:
            response = client.models.generate_content(
                model=settings.GEMMA_MODEL_ID,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )

            raw_text = response.text or "{}"
            # Clean markdown formatting if present
            clean_text = raw_text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()

            parsed = json.loads(clean_text)
            parsed["is_fixture_data"] = False
            parsed["model_used"] = f"{settings.GEMMA_MODEL_ID} (Live Gemini API)"
            
            validated_result = EvidenceAnalysisResult.model_validate(parsed)
            return validated_result

        except Exception as e:
            logger.error(f"Gemma 4 generation failed: {e}")
            raise RuntimeError(f"Gemma 4 API Request Error: {str(e)}")

    def generate_report(self, analysis: EvidenceAnalysisResult, force_fixture: bool = False) -> InvestigationReport:
        if force_fixture or not self.is_api_key_configured():
            return get_deterministic_report()

        client = self.get_client()
        if not client:
            return get_deterministic_report()

        from google.genai import types

        prompt = f"""You are the lead intelligence reporting officer for ECHO.
Based on the following validated evidence analysis, compose a formal, comprehensive Investigation Report.

Case Name: {analysis.case_name}
Evidence Items Analyzed: {analysis.evidence_count}
Direct Observations Count: {len(analysis.direct_observations)}
Key Contradictions: {len(analysis.contradictions)}
Timeline Events: {len(analysis.timeline)}

Analysis Overview:
{analysis.executive_overview}

Contradictions Identified:
{json.dumps([c.model_dump() for c in analysis.contradictions], indent=2)}

Timeline Reconstructed:
{json.dumps([t.model_dump() for t in analysis.timeline], indent=2)}

Return strict JSON matching this structure:
{{
  "report_title": string,
  "case_name": string,
  "generated_at": string (ISO),
  "model_used": "{settings.GEMMA_MODEL_ID}",
  "classification": "INTERNAL INTELLIGENCE ASSESSMENT // CONFIDENTIAL",
  "executive_summary": string,
  "verified_timeline": array of timeline events,
  "contradiction_matrix": array of contradictions,
  "key_findings": [
    {{
      "finding": string,
      "evidence_references": [string],
      "status": string,
      "details": string
    }}
  ],
  "evidence_limitations": [string],
  "recommended_actions": [string],
  "disclaimer": string
}}
"""
        try:
            response = client.models.generate_content(
                model=settings.GEMMA_MODEL_ID,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )

            raw_text = response.text or "{}"
            clean_text = raw_text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()

            parsed = json.loads(clean_text)
            return InvestigationReport.model_validate(parsed)
        except Exception as e:
            logger.warning(f"Live report generation failed ({e}), falling back to grounded report template")
            return get_deterministic_report()

gemini_service = GeminiService()
