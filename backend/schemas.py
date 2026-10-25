from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class EvidenceItem(BaseModel):
    id: str = Field(..., description="Unique evidence identifier, e.g. EVD-001")
    title: str = Field(..., description="Short title of the evidence piece")
    source_name: str = Field(..., description="Origin of evidence, e.g. Security Desk Log, CCTV Cam-04")
    evidence_type: Literal["text", "image", "csv", "document"] = Field(..., description="Media modality")
    timestamp_raw: str = Field(..., description="Explicit timestamp string recorded with the evidence")
    content_text: Optional[str] = Field(None, description="Raw text, transcript, or tabular CSV string")
    image_base64: Optional[str] = Field(None, description="Base64-encoded image payload if image evidence")
    image_mime_type: Optional[str] = Field(None, description="Image mime type, e.g. image/jpeg, image/png")
    description: Optional[str] = Field(None, description="Investigator notes or context")
    tags: List[str] = Field(default_factory=list, description="Categorical tags")
    uploaded_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class DirectObservation(BaseModel):
    evidence_id: str = Field(..., description="Reference ID to the source evidence")
    observation: str = Field(..., description="Direct factual observation without speculative inference")
    modality: Literal["visual", "textual", "tabular"] = Field(..., description="Source sensory modality")
    verifiable: bool = Field(True, description="Whether this observation is directly verifiable from raw data")

class Claim(BaseModel):
    id: str = Field(..., description="Unique claim identifier, e.g. CLM-01")
    statement: str = Field(..., description="Factual or narrative claim made by a source or party")
    evidence_id: str = Field(..., description="Source evidence stating or implying the claim")
    source_name: str = Field(..., description="Name of the source asserting this claim")
    claim_type: Literal["supported", "contradicted", "unverified"] = Field(
        ..., description="Validation status against corroborating evidence"
    )
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score from 0.0 to 1.0")
    rationale: str = Field(..., description="Justification explaining support, contradiction, or why it remains unverified")

class Contradiction(BaseModel):
    id: str = Field(..., description="Unique contradiction identifier, e.g. CON-01")
    claim_a: str = Field(..., description="First conflicting statement")
    claim_b: str = Field(..., description="Second conflicting statement")
    evidence_a_id: str = Field(..., description="Evidence ID containing or supporting claim A")
    evidence_b_id: str = Field(..., description="Evidence ID containing or supporting claim B")
    source_a: str = Field(..., description="Source of claim A")
    source_b: str = Field(..., description="Source of claim B")
    conflict_summary: str = Field(..., description="Concise explanation of the mutual incompatibility")
    is_genuine_contradiction: bool = Field(
        True, description="True if statements are factually irreconcilable; False if difference is merely missing/partial data"
    )
    severity: Literal["critical", "high", "medium", "low"] = Field("high", description="Impact on investigation integrity")
    suggested_reconciliation: Optional[str] = Field(None, description="Action or inquiry to resolve the discrepancy")

class TimelineEvent(BaseModel):
    id: str = Field(..., description="Unique event identifier, e.g. EVT-01")
    timestamp: str = Field(..., description="Standardized timestamp, e.g. 2026-10-24 22:18:00 UTC")
    is_inferred: bool = Field(False, description="Explicit timestamp from device/log vs reconstructed inference")
    title: str = Field(..., description="Short headline of the reconstructed event")
    description: str = Field(..., description="Detailed description of what occurred")
    primary_evidence_id: str = Field(..., description="Primary evidence anchoring this event")
    supporting_evidence_ids: List[str] = Field(default_factory=list, description="Corroborating evidence IDs")
    confidence: float = Field(1.0, ge=0.0, le=1.0)

class UnresolvedQuestion(BaseModel):
    id: str = Field(..., description="Identifier, e.g. QST-01")
    question: str = Field(..., description="Specific unresolved investigative question")
    related_evidence_ids: List[str] = Field(default_factory=list)
    recommended_action: str = Field(..., description="Concrete investigative step to answer this question")
    priority: Literal["urgent", "high", "medium"] = "high"

class InvestigationTask(BaseModel):
    id: str = Field(..., description="Task ID, e.g. TSK-01")
    title: str = Field(..., description="Title of proposed action")
    description: str = Field(..., description="Detailed operational task description")
    evidence_ids: List[str] = Field(default_factory=list, description="Evidence items that triggered this action")
    status: Literal["pending_approval", "approved", "rejected", "completed"] = "pending_approval"
    approved_by: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    audit_log: List[str] = Field(default_factory=list)

class EvidenceAnalysisResult(BaseModel):
    case_name: str
    analyzed_at: str
    model_used: str
    is_fixture_data: bool = False
    evidence_count: int
    direct_observations: List[DirectObservation] = Field(default_factory=list)
    claims: List[Claim] = Field(default_factory=list)
    contradictions: List[Contradiction] = Field(default_factory=list)
    timeline: List[TimelineEvent] = Field(default_factory=list)
    unresolved_questions: List[UnresolvedQuestion] = Field(default_factory=list)
    proposed_tasks: List[InvestigationTask] = Field(default_factory=list)
    overall_confidence: float = 0.92
    executive_overview: str

class InvestigationReport(BaseModel):
    report_title: str
    case_name: str
    generated_at: str
    model_used: str
    classification: str = "INTERNAL INTELLIGENCE ASSESSMENT // CONFIDENTIAL"
    executive_summary: str
    verified_timeline: List[TimelineEvent]
    contradiction_matrix: List[Contradiction]
    key_findings: List[dict]
    evidence_limitations: List[str]
    recommended_actions: List[str]
    disclaimer: str

class TaskApprovalRequest(BaseModel):
    task_id: str
    action: Literal["approve", "reject"]
    approver_name: str = "Lead Investigator"
    notes: Optional[str] = None

class CreateEvidenceRequest(BaseModel):
    title: str
    source_name: str
    evidence_type: Literal["text", "image", "csv", "document"]
    timestamp_raw: str
    content_text: Optional[str] = None
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
