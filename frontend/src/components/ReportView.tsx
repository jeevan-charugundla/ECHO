import React, { useState } from 'react';
import { 
  FileCheck, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  ShieldAlert, 
  Clock, 
  AlertOctagon,
  Download
} from 'lucide-react';
import { InvestigationReport } from '../types';
import { PageHeader } from './PageHeader';

interface ReportViewProps {
  report: InvestigationReport | null;
  onRegenerate: () => Promise<void>;
  onOpenEvidenceDetail: (evidenceId: string) => void;
  isRegenerating: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onRegenerate,
  onOpenEvidenceDetail,
  isRegenerating
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!report) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-border-main shadow-subtle space-y-3">
        <FileCheck className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
        <h3 className="text-sm font-semibold text-primary">No Intelligence Report Generated Yet</h3>
        <p className="text-xs text-secondary max-w-sm mx-auto">
          Synthesize an executive intelligence brief anchored to validated evidence using Gemma 4.
        </p>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md text-white bg-electric-600 hover:bg-electric-700 shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          {isRegenerating ? 'Generating Report...' : 'Synthesize Report Now'}
        </button>
      </div>
    );
  }

  const handleCopyMarkdown = () => {
    const md = `# ${report.report_title}
**Case Dossier:** ${report.case_name}
**Date Generated:** ${report.generated_at}
**Model Engine:** ${report.model_used}
**Classification:** ${report.classification}

## 1. Executive Summary
${report.executive_summary}

## 2. Key Verified Findings
${report.key_findings.map(f => `- **${f.finding}** [${f.status}]: ${f.details} (Sources: ${f.evidence_references.join(', ')})`).join('\n')}

## 3. Chronology of Verified Events
${report.verified_timeline.map(e => `- **${e.timestamp}** - ${e.title}: ${e.description} (Ref: ${e.primary_evidence_id})`).join('\n')}

## 4. Contradictions Identified
${report.contradiction_matrix.map(c => `- **${c.id} (${c.severity.toUpperCase()}):** ${c.conflict_summary}\n  - Statement A (${c.source_a}): "${c.claim_a}"\n  - Statement B (${c.source_b}): "${c.claim_b}"`).join('\n\n')}

## 5. Evidentiary Limitations
${report.evidence_limitations.map(l => `- ${l}`).join('\n')}

## 6. Recommended Next Steps
${report.recommended_actions.map(a => `- ${a}`).join('\n')}

---
*${report.disclaimer}*
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* PageHeader with Export & Print Actions (Hidden on Print) */}
      <div className="print:hidden">
        <PageHeader
          title="Executive Intelligence Report"
          description="Formally authored forensic assessment with source-grounded citations, verified chronological sequences, and contradiction analysis."
          badge={
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-crimson-50 text-crimson-700 border border-crimson-200 font-bold uppercase">
              {report.classification}
            </span>
          }
          actions={
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyMarkdown}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md text-secondary bg-white hover:bg-slate-50 border border-border-main transition-colors shadow-subtle"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1.5 text-muted" />}
                {copied ? 'Copied' : 'Copy Markdown'}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md text-secondary bg-white hover:bg-slate-50 border border-border-main transition-colors shadow-subtle"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5 text-muted" />
                Print / Save PDF
              </button>

              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-electric-600 hover:bg-electric-700 shadow-subtle transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {isRegenerating ? 'Regenerating...' : 'Re-Synthesize'}
              </button>
            </div>
          }
        />
      </div>

      {/* Editorial Intelligence Document Container */}
      <div className="print-container bg-white border border-border-main rounded-xl shadow-card p-8 sm:p-12 space-y-8 max-w-4xl mx-auto font-sans text-primary">
        
        {/* Document Header & Metadata Strip */}
        <div className="border-b-2 border-navy-900 pb-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-crimson-700 font-bold uppercase tracking-wider">
              {report.classification}
            </span>
            <span className="text-secondary font-medium">
              ECHO SYSTEM ID: REP-2026-SRB-01
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight leading-snug font-sans">
            {report.report_title}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2 text-secondary border-t border-border-subtle mt-3">
            <div>
              <span className="text-muted block text-[10px]">CASE DOSSIER:</span>
              <span className="font-semibold text-primary">{report.case_name}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px]">GENERATED AT:</span>
              <span className="tabular-nums">{report.generated_at}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px]">MODEL ENGINE:</span>
              <span className="text-electric-600 font-semibold">{report.model_used}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px]">VERIFICATION:</span>
              <span className="text-emerald-700 font-semibold">SOURCE-GROUNDED</span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2.5">
          <h2 className="text-xs font-bold text-navy-900 tracking-wider uppercase border-b border-border-main pb-1.5 font-sans">
            1. Executive Summary & Incident Overview
          </h2>
          <div className="text-xs sm:text-sm text-primary leading-relaxed space-y-3 font-serif">
            {report.executive_summary.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* Section 2: Key Verified Findings */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-navy-900 tracking-wider uppercase border-b border-border-main pb-1.5 font-sans">
            2. Key Verified Findings & Physical Grounding
          </h2>
          <div className="space-y-3">
            {report.key_findings.map((f, idx) => (
              <div key={idx} className="p-4 bg-slate-50/70 border border-border-main rounded-lg space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-primary">{f.finding}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold bg-electric-50 text-electric-700 border border-electric-200">
                      {f.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {f.evidence_references.map(ref => (
                      <button
                        key={ref}
                        onClick={() => onOpenEvidenceDetail(ref)}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-border-main text-electric-600 hover:underline"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-secondary leading-relaxed font-sans">{f.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Verified Timeline Summary */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-navy-900 tracking-wider uppercase border-b border-border-main pb-1.5 font-sans">
            3. Chronological Sequence of Verified Events
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border-main">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-secondary font-mono text-[11px] border-b border-border-main">
                <tr>
                  <th className="p-2.5 font-semibold">Timestamp</th>
                  <th className="p-2.5 font-semibold">Event Description</th>
                  <th className="p-2.5 font-semibold">Classification</th>
                  <th className="p-2.5 font-semibold">Source Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {report.verified_timeline.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/40">
                    <td className="p-2.5 font-mono text-primary whitespace-nowrap tabular-nums">{evt.timestamp}</td>
                    <td className="p-2.5 font-medium text-primary">
                      {evt.title} — <span className="text-secondary font-normal font-sans">{evt.description}</span>
                    </td>
                    <td className="p-2.5 font-mono whitespace-nowrap">
                      {evt.is_inferred ? (
                        <span className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Inferred</span>
                      ) : (
                        <span className="text-electric-700 font-semibold text-[10px] bg-electric-50 px-1.5 py-0.5 rounded border border-electric-200">Explicit Log</span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-electric-600">
                      <button onClick={() => onOpenEvidenceDetail(evt.primary_evidence_id)} className="hover:underline">
                        {evt.primary_evidence_id}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Contradiction Matrix */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-navy-900 tracking-wider uppercase border-b border-border-main pb-1.5 font-sans">
            4. Inconsistency & Contradiction Matrix
          </h2>
          <div className="space-y-3">
            {report.contradiction_matrix.map((c) => (
              <div key={c.id} className="p-4 bg-crimson-50/30 border border-crimson-200/80 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-crimson-700 text-[11px]">{c.id} // {c.severity.toUpperCase()} SEVERITY</span>
                  <span className="text-[10px] font-mono text-secondary">
                    Comparing {c.evidence_a_id} vs {c.evidence_b_id}
                  </span>
                </div>
                <p className="font-semibold text-primary">{c.conflict_summary}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                  <div className="p-2.5 bg-white rounded-md border border-border-main">
                    <span className="font-mono text-secondary block mb-0.5">{c.source_a}:</span>
                    <span className="text-primary italic font-sans">"{c.claim_a}"</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-md border border-crimson-200">
                    <span className="font-mono text-crimson-700 block mb-0.5">{c.source_b}:</span>
                    <span className="text-primary font-medium italic font-sans">"{c.claim_b}"</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 & 6: Limitations & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-navy-900 tracking-wider uppercase border-b border-border-main pb-1.5 font-sans">
              5. Evidentiary Limitations
            </h2>
            <ul className="list-disc list-inside text-xs text-secondary space-y-1.5 leading-relaxed font-sans">
              {report.evidence_limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xs font-bold text-navy-900 tracking-wider uppercase border-b border-border-main pb-1.5 font-sans">
              6. Recommended Operational Actions
            </h2>
            <ul className="list-disc list-inside text-xs text-electric-700 font-medium space-y-1.5 leading-relaxed font-sans">
              {report.recommended_actions.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </section>

        </div>

        {/* Footer Disclaimer */}
        <div className="border-t border-border-main pt-5 text-[11px] text-muted font-serif italic text-center leading-relaxed">
          {report.disclaimer}
        </div>

      </div>

    </div>
  );
};
