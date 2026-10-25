export type EvidenceType = 'text' | 'image' | 'csv' | 'document';

export interface EvidenceItem {
  id: string;
  title: string;
  source_name: string;
  evidence_type: EvidenceType;
  timestamp_raw: string;
  content_text?: string;
  image_base64?: string;
  image_mime_type?: string;
  description?: string;
  tags: string[];
  uploaded_at: string;
}

export interface DirectObservation {
  evidence_id: string;
  observation: string;
  modality: 'visual' | 'textual' | 'tabular';
  verifiable: boolean;
}

export interface Claim {
  id: string;
  statement: string;
  evidence_id: string;
  source_name: string;
  claim_type: 'supported' | 'contradicted' | 'unverified';
  confidence: number;
  rationale: string;
}

export interface Contradiction {
  id: string;
  claim_a: string;
  claim_b: string;
  evidence_a_id: string;
  evidence_b_id: string;
  source_a: string;
  source_b: string;
  conflict_summary: string;
  is_genuine_contradiction: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggested_reconciliation?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  is_inferred: boolean;
  title: string;
  description: string;
  primary_evidence_id: string;
  supporting_evidence_ids: string[];
  confidence: number;
}

export interface UnresolvedQuestion {
  id: string;
  question: string;
  related_evidence_ids: string[];
  recommended_action: string;
  priority: 'urgent' | 'high' | 'medium';
}

export interface InvestigationTask {
  id: string;
  title: string;
  description: string;
  evidence_ids: string[];
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed';
  approved_by?: string;
  created_at: string;
  audit_log: string[];
}

export interface EvidenceAnalysisResult {
  case_name: string;
  analyzed_at: string;
  model_used: string;
  is_fixture_data: boolean;
  evidence_count: number;
  direct_observations: DirectObservation[];
  claims: Claim[];
  contradictions: Contradiction[];
  timeline: TimelineEvent[];
  unresolved_questions: UnresolvedQuestion[];
  proposed_tasks: InvestigationTask[];
  overall_confidence: number;
  executive_overview: string;
}

export interface KeyFinding {
  finding: string;
  evidence_references: string[];
  status: string;
  details: string;
}

export interface InvestigationReport {
  report_title: string;
  case_name: string;
  generated_at: string;
  model_used: string;
  classification: string;
  executive_summary: string;
  verified_timeline: TimelineEvent[];
  contradiction_matrix: Contradiction[];
  key_findings: KeyFinding[];
  evidence_limitations: string[];
  recommended_actions: string[];
  disclaimer: string;
}

export interface HealthInfo {
  status: string;
  service: string;
  model_configured: string;
  api_key_present?: boolean;
  api_key_configured?: boolean;
  sdk_version?: string;
  evidence_count: number;
  tasks_count: number;
  case_name: string;
  investigation_status: string;
  timestamp: string;
}
