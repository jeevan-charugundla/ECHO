import {
  EvidenceItem,
  EvidenceAnalysisResult,
  InvestigationReport,
  InvestigationTask,
  HealthInfo
} from './types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthInfo> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function loadDemoCase(): Promise<{
  message: string;
  evidence: EvidenceItem[];
  analysis: EvidenceAnalysisResult;
  report: InvestigationReport;
  tasks: InvestigationTask[];
}> {
  const res = await fetch(`${API_BASE}/demo-case`);
  if (!res.ok) throw new Error(`Failed to load demo case: ${res.statusText}`);
  return res.json();
}

export async function fetchEvidence(): Promise<EvidenceItem[]> {
  const res = await fetch(`${API_BASE}/evidence`);
  if (!res.ok) throw new Error(`Failed to fetch evidence: ${res.statusText}`);
  return res.json();
}

export async function createEvidenceItem(payload: {
  title: string;
  source_name: string;
  evidence_type: 'text' | 'image' | 'csv' | 'document';
  timestamp_raw: string;
  content_text?: string;
  image_base64?: string;
  image_mime_type?: string;
  description?: string;
  tags?: string[];
}): Promise<EvidenceItem> {
  const res = await fetch(`${API_BASE}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create evidence item');
  }
  return res.json();
}

export async function uploadEvidenceFile(formData: FormData): Promise<EvidenceItem> {
  const res = await fetch(`${API_BASE}/evidence/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to upload evidence file');
  }
  return res.json();
}

export async function deleteEvidenceItem(evidenceId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/evidence/${evidenceId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete evidence ${evidenceId}`);
}

export async function runAnalysis(forceFixture: boolean = false): Promise<EvidenceAnalysisResult> {
  const res = await fetch(`${API_BASE}/evidence/analyze?force_fixture=${forceFixture}`, {
    method: 'POST'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Analysis request failed');
  }
  return res.json();
}

export async function fetchReport(forceFixture: boolean = false): Promise<InvestigationReport> {
  const res = await fetch(`${API_BASE}/investigation/report?force_fixture=${forceFixture}`, {
    method: 'POST'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to generate report');
  }
  return res.json();
}

export async function fetchTasks(): Promise<InvestigationTask[]> {
  const res = await fetch(`${API_BASE}/investigation/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function performTaskAction(
  taskId: string,
  action: 'approve' | 'reject',
  approverName: string = 'Lead Investigator',
  notes?: string
): Promise<{ task: InvestigationTask; message: string }> {
  const res = await fetch(`${API_BASE}/investigation/tasks/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task_id: taskId,
      action,
      approver_name: approverName,
      notes
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Task action failed');
  }
  return res.json();
}

export async function createManualTask(payload: {
  title: string;
  description: string;
  evidence_ids: string[];
}): Promise<InvestigationTask> {
  const res = await fetch(`${API_BASE}/investigation/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create investigation task');
  return res.json();
}
