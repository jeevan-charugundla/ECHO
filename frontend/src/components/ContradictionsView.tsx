import React, { useState } from 'react';
import { 
  GitFork, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ExternalLink, 
  Filter, 
  ShieldCheck, 
  Info,
  Scale,
  ArrowRight
} from 'lucide-react';
import { Contradiction, Claim, DirectObservation } from '../types';
import { PageHeader } from './PageHeader';

interface ContradictionsViewProps {
  contradictions: Contradiction[];
  claims: Claim[];
  observations: DirectObservation[];
  onOpenEvidenceDetail: (evidenceId: string) => void;
}

export const ContradictionsView: React.FC<ContradictionsViewProps> = ({
  contradictions,
  claims,
  observations,
  onOpenEvidenceDetail
}) => {
  const [subTab, setSubTab] = useState<'contradictions' | 'claims' | 'observations'>('contradictions');
  const [claimFilter, setClaimFilter] = useState<'all' | 'supported' | 'contradicted' | 'unverified'>('all');

  const filteredClaims = claims.filter((c) => {
    if (claimFilter === 'all') return true;
    return c.claim_type === claimFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* PageHeader */}
      <PageHeader
        title="Findings & Contradiction Intelligence"
        description="Rigorous cross-examination of assertions against physical telemetry and digital audit logs. Distinguishes genuine factual incompatibilities from gaps in current data."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-crimson-50 text-crimson-700 border border-crimson-200 font-bold tabular-nums">
            {contradictions.length} CONTRADICTIONS IDENTIFIED
          </span>
        }
        actions={
          /* Sub-tab Pills */
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-border-main text-xs">
            <button
              onClick={() => setSubTab('contradictions')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                subTab === 'contradictions'
                  ? 'bg-white text-crimson-700 shadow-subtle font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Contradictions ({contradictions.length})</span>
            </button>
            
            <button
              onClick={() => setSubTab('claims')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                subTab === 'claims'
                  ? 'bg-white text-electric-600 shadow-subtle font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Claims Matrix ({claims.length})</span>
            </button>

            <button
              onClick={() => setSubTab('observations')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                subTab === 'observations'
                  ? 'bg-white text-primary shadow-subtle font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Observations ({observations.length})</span>
            </button>
          </div>
        }
      />

      {/* SUBTAB 1: CONTRADICTIONS MATRIX */}
      {subTab === 'contradictions' && (
        <div className="space-y-5">
          {contradictions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-border-main shadow-subtle space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              <h3 className="text-sm font-semibold text-primary">No Contradictions Detected</h3>
              <p className="text-xs text-secondary">All current evidence assertions are mutually compatible.</p>
            </div>
          ) : (
            contradictions.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-crimson-200/80 shadow-subtle overflow-hidden space-y-0"
              >
                {/* Header Strip */}
                <div className="bg-crimson-50/50 px-5 py-3 border-b border-crimson-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-crimson-700 bg-crimson-100 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">
                      Factual Inconsistency Analysis
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.is_genuine_contradiction ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-crimson-600 text-white shadow-subtle">
                        Genuine Contradiction
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-medium uppercase bg-slate-200 text-secondary">
                        Missing Information Gap
                      </span>
                    )}

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      item.severity === 'critical' ? 'bg-crimson-100 text-crimson-700 border border-crimson-200' :
                      item.severity === 'high' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {item.severity} Severity
                    </span>
                  </div>
                </div>

                {/* Split Comparison Cards */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Claim A */}
                    <div className="p-4 rounded-lg border border-border-main bg-slate-50/40 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-secondary mb-1">
                          <span className="font-semibold text-primary">ASSERTION A</span>
                          <span>{item.source_a}</span>
                        </div>
                        <p className="text-xs font-medium text-primary leading-relaxed font-sans">
                          "{item.claim_a}"
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => onOpenEvidenceDetail(item.evidence_a_id)}
                          className="inline-flex items-center text-xs font-mono text-electric-600 hover:text-electric-700 font-medium"
                        >
                          Source Evidence: {item.evidence_a_id} <ExternalLink className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>

                    {/* Claim B */}
                    <div className="p-4 rounded-lg border border-crimson-200 bg-crimson-50/20 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-crimson-700 mb-1">
                          <span className="font-bold">CONTRADICTING ASSERTION B</span>
                          <span>{item.source_b}</span>
                        </div>
                        <p className="text-xs font-bold text-primary leading-relaxed font-sans">
                          "{item.claim_b}"
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => onOpenEvidenceDetail(item.evidence_b_id)}
                          className="inline-flex items-center text-xs font-mono text-electric-600 hover:text-electric-700 font-medium"
                        >
                          Source Evidence: {item.evidence_b_id} <ExternalLink className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Conflict Narrative & Suggested Reconciliation */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-border-main space-y-2.5 text-xs">
                    <div>
                      <span className="font-bold text-primary uppercase tracking-wide text-[11px] block">
                        Conflict Breakdown:
                      </span>
                      <p className="text-secondary mt-0.5 leading-relaxed font-sans">
                        {item.conflict_summary}
                      </p>
                    </div>

                    {item.suggested_reconciliation && (
                      <div className="pt-2.5 border-t border-border-subtle">
                        <span className="font-bold text-electric-600 uppercase tracking-wide text-[11px] block">
                          Suggested Reconciliation Action:
                        </span>
                        <p className="text-primary mt-0.5 leading-relaxed font-medium font-sans">
                          {item.suggested_reconciliation}
                        </p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* SUBTAB 2: CLAIMS MATRIX */}
      {subTab === 'claims' && (
        <div className="space-y-4">
          {/* Claim Filter Pills */}
          <div className="flex items-center space-x-2 pb-2">
            <span className="text-xs text-secondary font-medium">Filter Claims:</span>
            {['all', 'supported', 'contradicted', 'unverified'].map((filter) => (
              <button
                key={filter}
                onClick={() => setClaimFilter(filter as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${
                  claimFilter === filter
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'bg-white text-secondary border border-border-main hover:bg-slate-50'
                }`}
              >
                {filter} ({claims.filter(c => filter === 'all' || c.claim_type === filter).length})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredClaims.map((claim) => (
              <div 
                key={claim.id}
                className="bg-white p-4 rounded-xl border border-border-main shadow-subtle hover:border-slate-300 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-primary bg-slate-100 px-2 py-0.5 rounded">
                      {claim.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      claim.claim_type === 'supported' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      claim.claim_type === 'contradicted' ? 'bg-crimson-50 text-crimson-700 border border-crimson-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {claim.claim_type}
                    </span>
                    <span className="text-xs text-secondary font-medium truncate">
                      Source: {claim.source_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-secondary font-mono text-[11px] tabular-nums">
                      Confidence: {Math.round(claim.confidence * 100)}%
                    </span>
                    <button
                      onClick={() => onOpenEvidenceDetail(claim.evidence_id)}
                      className="text-xs font-mono text-electric-600 hover:underline inline-flex items-center"
                    >
                      Ref: {claim.evidence_id} <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-primary leading-relaxed font-sans">
                  {claim.statement}
                </p>

                <p className="text-xs text-secondary font-sans italic bg-slate-50 p-2.5 rounded-lg border border-border-subtle">
                  <strong className="text-primary not-italic font-semibold">Verification Rationale:</strong> {claim.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DIRECT OBSERVATIONS */}
      {subTab === 'observations' && (
        <div className="space-y-4">
          <div className="p-3 bg-electric-50/60 border border-electric-200 rounded-lg text-xs text-electric-700">
            <strong className="font-semibold">Observation Discipline:</strong> Direct factual observations represent sensory data directly verifiable from text transcripts, camera stills, or machine logs, without speculative inference.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {observations.map((obs, idx) => (
              <div 
                key={idx}
                className="bg-white p-4 rounded-xl border border-border-main shadow-subtle space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="font-bold text-secondary uppercase bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      Modality: {obs.modality}
                    </span>
                    <span className="text-emerald-700 font-semibold text-[11px] flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Direct Observation
                    </span>
                  </div>

                  <p className="text-xs text-primary leading-relaxed font-medium font-sans">
                    {obs.observation}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <button
                    onClick={() => onOpenEvidenceDetail(obs.evidence_id)}
                    className="text-xs font-mono text-electric-600 hover:text-electric-700 inline-flex items-center font-medium"
                  >
                    Anchored to {obs.evidence_id} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                  <span className="text-[10px] font-mono text-muted">VERIFIABLE: TRUE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
