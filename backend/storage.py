import json
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
from config import settings
from schemas import EvidenceItem, InvestigationTask, EvidenceAnalysisResult, InvestigationReport
from demo_data import get_demo_evidence_items, get_deterministic_analysis_result, get_deterministic_report

STORAGE_FILE = settings.STORAGE_DIR / "case_state.json"

class CaseStore:
    def __init__(self):
        self.evidence: Dict[str, EvidenceItem] = {}
        self.tasks: Dict[str, InvestigationTask] = {}
        self.latest_analysis: Optional[EvidenceAnalysisResult] = None
        self.latest_report: Optional[InvestigationReport] = None
        self.case_name: str = settings.CASE_NAME
        self.status: str = "Active Investigation"
        
        # Load demo data by default on first init
        self.reset_to_demo()

    def reset_to_demo(self):
        self.evidence.clear()
        self.tasks.clear()
        
        for item in get_demo_evidence_items():
            self.evidence[item.id] = item
            
        demo_analysis = get_deterministic_analysis_result()
        self.latest_analysis = demo_analysis
        for task in demo_analysis.proposed_tasks:
            self.tasks[task.id] = task
            
        self.latest_report = get_deterministic_report()

    def get_all_evidence(self) -> List[EvidenceItem]:
        return list(self.evidence.values())

    def get_evidence(self, evidence_id: str) -> Optional[EvidenceItem]:
        return self.evidence.get(evidence_id)

    def add_evidence(self, item: EvidenceItem):
        self.evidence[item.id] = item

    def get_all_tasks(self) -> List[InvestigationTask]:
        return list(self.tasks.values())

    def get_task(self, task_id: str) -> Optional[InvestigationTask]:
        return self.tasks.get(task_id)

    def add_task(self, task: InvestigationTask):
        self.tasks[task.id] = task

    def update_task_status(self, task_id: str, action: str, approver: str, notes: Optional[str] = None) -> Optional[InvestigationTask]:
        task = self.tasks.get(task_id)
        if not task:
            return None
        
        timestamp = datetime.utcnow().isoformat()
        if action == "approve":
            task.status = "approved"
            task.approved_by = approver
            task.audit_log.append(f"[{timestamp}] APPROVED by {approver}. Notes: {notes or 'Authorized operational task.'}")
        elif action == "reject":
            task.status = "rejected"
            task.audit_log.append(f"[{timestamp}] REJECTED by {approver}. Notes: {notes or 'Dismissed by investigator.'}")
        elif action == "complete":
            task.status = "completed"
            task.audit_log.append(f"[{timestamp}] COMPLETED by {approver}. Notes: {notes or 'Field action concluded.'}")
            
        return task

    def search_evidence_items(self, query: str) -> List[EvidenceItem]:
        query_lower = query.lower()
        results = []
        for item in self.evidence.values():
            text_match = item.content_text and query_lower in item.content_text.lower()
            title_match = query_lower in item.title.lower()
            source_match = query_lower in item.source_name.lower()
            tag_match = any(query_lower in t.lower() for t in item.tags)
            if text_match or title_match or source_match or tag_match:
                results.append(item)
        return results

case_store = CaseStore()
