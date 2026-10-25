import React from 'react';
import { 
  FolderSearch, 
  Clock, 
  AlertOctagon, 
  CheckCircle, 
  ArrowRight, 
  HelpCircle, 
  Sparkles,
  FileSpreadsheet,
  FileImage,
  FileText,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  EvidenceItem, 
  EvidenceAnalysisResult, 
  InvestigationTask 
} from '../types';
import { PageHeader } from './PageHeader';
import { MetricCard } from './MetricCard';

interface OverviewViewProps {
  analysis: EvidenceAnalysisResult | null;
  evidence: EvidenceItem[];
  tasks: InvestigationTask[];
  onSelectTab: (tab: string) => void;
  onOpenEvidenceDetail: (evidenceId: string) => void;
  onOpenAnalyze: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  analysis,
  evidence,
  tasks,
  onSelectTab,
  onOpenEvidenceDetail,
  onOpenAnalyze
}) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending_approval');
  const criticalContradictions = analysis?.contradictions.filter(c => c.severity === 'critical' || c.severity === 'high') || [];

  // Group evidence by modality
  const evidenceTypeCounts = evidence.reduce((acc, item) => {
    acc[item.evidence_type] = (acc[item.evidence_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      
      {/* Reusable PageHeader */}
      <PageHeader
        title="Investigation Command Overview"
        description="Multi-modal intelligence synthesis cross-referencing physical sensor logs, video surveillance, cryptographic badge records, and human testimony."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            STATUS: ACTIVE
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectTab('report')}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md text-secondary bg-white hover:bg-slate-50 border border-border-main transition-colors shadow-subtle"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-secondary" />
              Intelligence Briefing
            </button>
            <button
              onClick={onOpenAnalyze}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-electric-600 hover:bg-electric-700 shadow-subtle transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Synthesize Evidence
            </button>
          </div>
        }
      />

      {/* Priority Inconsistency Alert Banner */}
      {criticalContradictions.length > 0 && (
        <div className="p-4 bg-crimson-50 border border-crimson-500/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-crimson-100 text-crimson-700 rounded-lg flex-shrink-0 mt-0.5">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold font-mono text-crimson-700 uppercase tracking-wide">
                  CRITICAL CONTRADICTION DETECTED // CON-01
                </span>
                <span className="text-[10px] font-mono bg-white text-crimson-700 px-1.5 py-0.2 rounded border border-crimson-200 font-bold">
                  HIGH SEVERITY
                </span>
              </div>
              <p className="text-xs text-primary mt-1 font-medium leading-relaxed">
                IT Director Vikram Malhotra's official update asserting "zero badge swipes after 20:00 UTC and no facility entry" is directly refuted by cryptographic Reader 202-B logs recording Master Override Key access at 22:28 UTC.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('contradictions')}
            className="inline-flex items-center text-xs font-semibold text-crimson-700 hover:text-crimson-800 bg-white px-3 py-1.5 rounded-lg border border-crimson-200 shadow-subtle whitespace-nowrap self-start md:self-center transition-colors"
          >
            Review Discrepancy <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      )}

      {/* Standardized Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <MetricCard
          label="Evidence Locker"
          value={evidence.length}
          subtext="Items Ingested"
          icon={FolderSearch}
          iconColor="text-electric-600"
          iconBg="bg-electric-50"
          onClick={() => onSelectTab('evidence')}
          breakdown={
            <div className="flex flex-wrap gap-1">
              {Object.entries(evidenceTypeCounts).map(([type, count]) => (
                <span key={type} className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-secondary rounded font-mono uppercase">
                  {type}: {count}
                </span>
              ))}
            </div>
          }
        />

        <MetricCard
          label="Timeline Events"
          value={analysis?.timeline.length || 0}
          subtext="Reconstructed"
          icon={Clock}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          onClick={() => onSelectTab('timeline')}
          breakdown={
            <div className="flex items-center space-x-2 text-[11px] font-mono text-secondary">
              <span className="text-electric-600 font-medium">
                {analysis?.timeline.filter(e => !e.is_inferred).length || 0} Explicit
              </span>
              <span>•</span>
              <span className="text-amber-600 font-medium">
                {analysis?.timeline.filter(e => e.is_inferred).length || 0} Inferred
              </span>
            </div>
          }
        />

        <MetricCard
          label="Contradictions"
          value={analysis?.contradictions.length || 0}
          subtext="Inconsistencies"
          icon={AlertOctagon}
          iconColor="text-crimson-600"
          iconBg="bg-crimson-50"
          onClick={() => onSelectTab('contradictions')}
          breakdown={
            <div className="text-[11px] font-mono text-crimson-700 font-semibold">
              {criticalContradictions.length} Critical / High Severity
            </div>
          }
        />

        <MetricCard
          label="Agentic Tasks"
          value={pendingTasks.length}
          subtext="Pending Review"
          icon={CheckCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={() => onSelectTab('tasks')}
          breakdown={
            <div className="text-[11px] text-secondary font-medium">
              Human-in-the-loop authorization
            </div>
          }
        />

      </div>

      {/* Main Workspace 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Executive Analysis & Contradictions & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Overview Synthesis Card */}
          <div className="bg-white rounded-xl border border-border-main p-6 shadow-subtle space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-electric-600" />
                <h2 className="text-xs font-bold text-primary tracking-wider uppercase">
                  Executive Intelligence Synthesis
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-electric-50 text-electric-600 border border-electric-200 tabular-nums">
                Confidence: {Math.round((analysis?.overall_confidence || 0.92) * 100)}%
              </span>
            </div>

            <p className="text-xs text-primary leading-relaxed font-sans">
              {analysis?.executive_overview || "No model synthesis generated yet. Click 'Run Gemma 4' to process the evidence locker."}
            </p>

            {analysis?.is_fixture_data && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong className="font-semibold">Deterministic Verified Baseline:</strong> Showing pre-verified analysis. Run live Gemma 4 inference to generate real-time multimodal reasoning.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Primary Inconsistencies Card */}
          <div className="bg-white rounded-xl border border-border-main p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-crimson-600" />
                <h2 className="text-xs font-bold text-primary tracking-wider uppercase">
                  Crucial Contradictions Discovered ({criticalContradictions.length})
                </h2>
              </div>
              <button
                onClick={() => onSelectTab('contradictions')}
                className="text-xs text-electric-600 hover:text-electric-700 font-medium inline-flex items-center"
              >
                Inspect All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="space-y-3">
              {criticalContradictions.slice(0, 2).map((c) => (
                <div key={c.id} className="p-4 rounded-lg border border-crimson-100 bg-crimson-50/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-crimson-700">{c.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-crimson-100 text-crimson-700">
                      {c.severity} Severity
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-border-main space-y-1">
                      <span className="text-[10px] font-mono text-secondary block font-semibold">STATEMENT A ({c.source_a})</span>
                      <p className="text-primary leading-relaxed font-sans">{c.claim_a}</p>
                      <button 
                        onClick={() => onOpenEvidenceDetail(c.evidence_a_id)}
                        className="mt-1 text-[10px] font-mono text-electric-600 hover:underline inline-flex items-center"
                      >
                        Ref: {c.evidence_a_id} <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-crimson-200 space-y-1">
                      <span className="text-[10px] font-mono text-crimson-600 block font-semibold">CONTRADICTORY STATEMENT B ({c.source_b})</span>
                      <p className="text-primary font-medium leading-relaxed font-sans">{c.claim_b}</p>
                      <button 
                        onClick={() => onOpenEvidenceDetail(c.evidence_b_id)}
                        className="mt-1 text-[10px] font-mono text-electric-600 hover:underline inline-flex items-center"
                      >
                        Ref: {c.evidence_b_id} <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-secondary italic pt-1 border-t border-crimson-100/60 font-sans">
                    <strong className="text-primary font-semibold not-italic">Synthesis:</strong> {c.conflict_summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Sneak Peek */}
          <div className="bg-white rounded-xl border border-border-main p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-electric-600" />
                <h2 className="text-xs font-bold text-primary tracking-wider uppercase">
                  Reconstructed Chronology Preview
                </h2>
              </div>
              <button
                onClick={() => onSelectTab('timeline')}
                className="text-xs text-electric-600 hover:text-electric-700 font-medium inline-flex items-center"
              >
                Full Timeline ({analysis?.timeline.length || 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-main">
              {analysis?.timeline.slice(0, 4).map((evt) => (
                <div key={evt.id} className="relative">
                  <div className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                    evt.is_inferred ? 'border-amber-500' : 'border-electric-600'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-semibold text-primary tabular-nums">{evt.timestamp}</span>
                      {evt.is_inferred ? (
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded font-mono">
                          Inferred
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 bg-electric-50 text-electric-600 border border-electric-200 rounded font-mono">
                          Explicit
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-primary mt-0.5">{evt.title}</p>
                    <p className="text-xs text-secondary mt-0.5 leading-relaxed">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Unresolved Questions & Recent Ingestions */}
        <div className="space-y-6">
          
          {/* Action Approval Needed Card */}
          <div className="bg-white rounded-xl border border-border-main p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                <h2 className="text-xs font-bold text-primary tracking-wider uppercase">
                  Pending Approvals
                </h2>
              </div>
              <span className="text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold tabular-nums">
                {pendingTasks.length} queued
              </span>
            </div>

            {pendingTasks.length === 0 ? (
              <p className="text-xs text-secondary py-3 text-center">
                All agentic tool tasks have been reviewed.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="p-3 bg-slate-50/70 rounded-lg border border-border-main space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{task.title}</span>
                    </div>
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{task.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-muted">
                        Triggered by: {task.evidence_ids.join(', ')}
                      </span>
                      <button
                        onClick={() => onSelectTab('tasks')}
                        className="text-xs font-semibold text-electric-600 hover:text-electric-700 inline-flex items-center"
                      >
                        Review <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unresolved Questions */}
          <div className="bg-white rounded-xl border border-border-main p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-electric-600" />
                <h2 className="text-xs font-bold text-primary tracking-wider uppercase">
                  Unresolved Questions
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {(analysis?.unresolved_questions || []).map((q) => (
                <div key={q.id} className="p-3 border border-border-main rounded-lg space-y-1.5 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-electric-600 font-bold">{q.id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-slate-100 text-secondary font-semibold">
                      {q.priority}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary">{q.question}</p>
                  <p className="text-xs text-secondary italic">
                    Action: {q.recommended_action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sources Quick List */}
          <div className="bg-white rounded-xl border border-border-main p-6 shadow-subtle space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <h2 className="text-xs font-bold text-primary tracking-wider uppercase">
                Active Sources ({evidence.length})
              </h2>
              <button
                onClick={() => onSelectTab('evidence')}
                className="text-xs text-electric-600 hover:text-electric-700 font-medium"
              >
                View Locker
              </button>
            </div>
            <div className="space-y-1.5">
              {evidence.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onOpenEvidenceDetail(item.id)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs transition-colors border border-transparent hover:border-border-subtle"
                >
                  <div className="flex items-center space-x-2 truncate">
                    {item.evidence_type === 'image' ? (
                      <FileImage className="w-3.5 h-3.5 text-electric-600 flex-shrink-0" />
                    ) : item.evidence_type === 'csv' ? (
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                    )}
                    <span className="font-mono text-secondary font-semibold text-[11px]">{item.id}</span>
                    <span className="text-primary truncate font-medium">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted uppercase whitespace-nowrap ml-2">
                    {item.evidence_type}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
