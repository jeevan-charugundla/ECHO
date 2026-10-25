import React, { useState } from 'react';
import { 
  ListCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Plus, 
  UserCheck, 
  History,
  FileCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { InvestigationTask } from '../types';
import { PageHeader } from './PageHeader';

interface TasksViewProps {
  tasks: InvestigationTask[];
  onPerformAction: (taskId: string, action: 'approve' | 'reject', approverName: string, notes?: string) => Promise<void>;
  onCreateManualTask: (title: string, description: string, evidenceIds: string[]) => Promise<void>;
  onOpenEvidenceDetail: (evidenceId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onPerformAction,
  onCreateManualTask,
  onOpenEvidenceDetail
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [activeModalTask, setActiveModalTask] = useState<InvestigationTask | null>(null);
  const [approverName, setApproverName] = useState<string>('Chief Inspector Rivera');
  const [approvalNotes, setApprovalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // New task creation state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newEvidenceIds, setNewEvidenceIds] = useState<string>('EVD-001, EVD-003');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!activeModalTask) return;
    setIsSubmitting(true);
    try {
      await onPerformAction(activeModalTask.id, action, approverName, approvalNotes);
      setActiveModalTask(null);
      setApprovalNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const ids = newEvidenceIds.split(',').map(s => s.trim()).filter(Boolean);
    await onCreateManualTask(newTitle, newDescription, ids);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" /> APPROVED
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-crimson-50 text-crimson-700 border border-crimson-200">
            <XCircle className="w-3 h-3 mr-1" /> REJECTED
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-electric-50 text-electric-600 border border-electric-200">
            <FileCheck className="w-3 h-3 mr-1" /> COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1 animate-live-pulse" /> PENDING APPROVAL
          </span>
        );
    }
  };

  const pendingCount = tasks.filter(t => t.status === 'pending_approval').length;

  return (
    <div className="space-y-6">
      
      {/* PageHeader with Propose Action Button */}
      <PageHeader
        title="Agentic Action & Task Approval Center"
        description="Strict human-in-the-loop operational protocol. When Gemma 4 proposes investigative tasks via tool calling, explicit investigator authorization and cryptographically logged audit records are mandatory before task dispatch."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold tabular-nums">
            {pendingCount} AWAITING AUTHORIZATION
          </span>
        }
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-electric-600 hover:bg-electric-700 shadow-subtle transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Propose Action
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-secondary font-medium">Filter Tasks:</span>
        {['all', 'pending_approval', 'approved', 'rejected', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${
              filter === f
                ? 'bg-navy-900 text-white font-semibold'
                : 'bg-white text-secondary border border-border-main hover:bg-slate-50'
            }`}
          >
            {f.replace('_', ' ')} ({tasks.filter(t => f === 'all' || t.status === f).length})
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-border-main shadow-subtle space-y-2">
            <ListCheck className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-semibold text-primary">No tasks in this category</h3>
            <p className="text-xs text-secondary">Select another filter or propose a new investigative task.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className={`bg-white rounded-xl border transition-all p-5 shadow-subtle space-y-3 ${
                task.status === 'pending_approval' ? 'border-amber-300 ring-1 ring-amber-100/50' : 'border-border-main'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-primary bg-slate-100 px-2 py-0.5 rounded">
                    {task.id}
                  </span>
                  <h3 className="text-sm font-bold text-primary font-sans">
                    {task.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(task.status)}
                </div>
              </div>

              <p className="text-xs text-primary leading-relaxed font-sans">
                {task.description}
              </p>

              {/* Supporting Evidence Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[11px] font-medium text-secondary">Triggering Evidence:</span>
                {task.evidence_ids.map((id) => (
                  <button
                    key={id}
                    onClick={() => onOpenEvidenceDetail(id)}
                    className="inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 rounded bg-electric-50 text-electric-600 border border-electric-200 hover:bg-electric-100 transition-colors"
                  >
                    {id} <ExternalLink className="w-2.5 h-2.5 ml-1" />
                  </button>
                ))}
              </div>

              {/* Audit Log */}
              {task.audit_log && task.audit_log.length > 0 && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-border-main space-y-1.5 text-xs">
                  <div className="flex items-center space-x-1.5 text-secondary font-mono text-[11px] font-semibold">
                    <History className="w-3.5 h-3.5" />
                    <span>AUDIT RECORD & OPERATIONAL LOG:</span>
                  </div>
                  {task.audit_log.map((log, idx) => (
                    <p key={idx} className="font-mono text-[11px] text-secondary pl-3 border-l-2 border-slate-300">
                      {log}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Buttons for Pending Approval */}
              {task.status === 'pending_approval' && (
                <div className="pt-2 flex items-center justify-end space-x-3 border-t border-border-subtle">
                  <button
                    onClick={() => setActiveModalTask(task)}
                    className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-md text-white bg-electric-600 hover:bg-electric-700 shadow-subtle transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                    Review & Authorize Action
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Human Authorization Dialog */}
      {activeModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl border border-border-main shadow-modal max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between border-b border-border-subtle pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  INVESTIGATOR AUTHORIZATION REQUIRED
                </span>
                <h3 className="text-base font-bold text-primary mt-2 font-sans">
                  Authorize Operational Task
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalTask(null)}
                className="text-muted hover:text-secondary text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-border-main space-y-1">
                <span className="font-bold text-primary block text-xs">{activeModalTask.title}</span>
                <p className="text-secondary leading-relaxed font-sans">{activeModalTask.description}</p>
                <div className="mt-2 text-[11px] font-mono text-muted">
                  Anchored Evidence: {activeModalTask.evidence_ids.join(', ')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Authorizing Officer Identity:
                </label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-border-main rounded-lg text-xs text-primary focus:ring-1 focus:ring-electric-500 focus:outline-hidden"
                  placeholder="e.g. Chief Inspector Rivera"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Operational Directive & Authorization Justification:
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-border-main rounded-lg text-xs text-primary focus:ring-1 focus:ring-electric-500 focus:outline-hidden"
                  placeholder="e.g. Dispatched under emergency evidence preservation protocol."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border-subtle">
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('reject')}
                className="px-3 py-1.5 text-xs font-semibold text-crimson-700 hover:bg-crimson-50 border border-crimson-200 rounded-md transition-colors"
              >
                Dismiss / Reject
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleAction('approve')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-electric-600 hover:bg-electric-700 rounded-md shadow-subtle transition-colors flex items-center"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                {isSubmitting ? 'Recording...' : 'Confirm Authorization'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Propose Manual Action Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <form 
            onSubmit={handleCreateTask}
            className="bg-white rounded-xl border border-border-main shadow-modal max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-start justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-primary font-sans">
                Propose New Investigative Action
              </h3>
              <button 
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-muted hover:text-secondary font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Task Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Forensic analysis of secondary lock mechanism"
                  className="w-full px-3 py-1.5 border border-border-main rounded-lg text-xs text-primary focus:ring-1 focus:ring-electric-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Operational Description:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed instructions for field or forensic investigators..."
                  className="w-full px-3 py-1.5 border border-border-main rounded-lg text-xs text-primary focus:ring-1 focus:ring-electric-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Related Evidence IDs (comma separated):
                </label>
                <input
                  type="text"
                  value={newEvidenceIds}
                  onChange={(e) => setNewEvidenceIds(e.target.value)}
                  placeholder="EVD-001, EVD-003"
                  className="w-full px-3 py-1.5 border border-border-main rounded-lg text-xs font-mono text-primary focus:ring-1 focus:ring-electric-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-3 py-1.5 text-xs text-secondary hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-electric-600 hover:bg-electric-700 rounded-md shadow-subtle"
              >
                Queue Action for Approval
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
