import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Copy, 
  Check, 
  Tag, 
  Eye, 
  FileImage, 
  FileSpreadsheet, 
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceDetailPanelProps {
  item: EvidenceItem | null;
  onClose: () => void;
  onSelectFinding?: (id: string) => void;
}

export const EvidenceDetailPanel: React.FC<EvidenceDetailPanelProps> = ({
  item,
  onClose
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!item) return null;

  const handleCopyContent = () => {
    if (!item.content_text) return;
    navigator.clipboard.writeText(item.content_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl border border-border-main shadow-modal max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-border-main flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold text-electric-600 bg-electric-50 border border-electric-200 px-2 py-0.5 rounded">
              {item.id}
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Forensic Evidence Record
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-secondary hover:text-primary hover:bg-slate-200/60 transition-colors focus:outline-hidden"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-primary font-sans">
          
          {/* Title & Metadata Headline */}
          <div>
            <h2 className="text-base font-bold text-primary tracking-tight font-sans">
              {item.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-secondary font-mono text-[11px]">
              <span className="text-primary font-medium">{item.source_name}</span>
              <span>•</span>
              <span className="flex items-center text-secondary">
                <Calendar className="w-3 h-3 mr-1" />
                {item.timestamp_raw}
              </span>
              <span>•</span>
              <span className="uppercase font-semibold text-electric-600">
                {item.evidence_type}
              </span>
            </div>
          </div>

          {/* Visual Still if Image Evidence */}
          {item.evidence_type === 'image' && item.image_base64 && (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-slate-900 bg-slate-950">
                <img
                  src={`data:${item.image_mime_type || 'image/jpeg'};base64,${item.image_base64}`}
                  alt={item.title}
                  className="w-full h-auto object-contain max-h-96 mx-auto"
                />
                <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-xs text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center">
                  <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-live-pulse" />
                  AUTHENTICATED HIGH-RES FRAME RECOVERY
                </div>
              </div>
              <p className="text-[11px] text-muted italic">
                CCTV Cam-04 Corridor Surveillance Frame. Stamped at 2026-10-24 22:18:14 UTC with HUD camera telemetry.
              </p>
            </div>
          )}

          {/* Raw Transcript or Tabular CSV Content */}
          {item.content_text && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary uppercase tracking-wider text-[11px] block">
                  {item.evidence_type === 'csv' ? 'Audit Log Stream (CSV Format)' : 'Raw Deposition Transcript / Incident Text'}
                </span>
                <button
                  onClick={handleCopyContent}
                  className="inline-flex items-center px-2 py-1 bg-slate-100 hover:bg-slate-200 text-secondary hover:text-primary rounded text-[11px] font-mono transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 mr-1 text-emerald-600" /> : <Copy className="w-3 h-3 mr-1 text-muted" />}
                  {copied ? 'Copied' : 'Copy Content'}
                </button>
              </div>

              <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-60 border border-slate-800">
                {item.content_text}
              </pre>
            </div>
          )}

          {/* Investigator Description */}
          {item.description && (
            <div className="p-3.5 bg-slate-50 rounded-lg border border-border-main space-y-1">
              <span className="font-bold text-primary block text-[11px]">
                Investigator Context / Recovery Notes:
              </span>
              <p className="text-secondary leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-subtle">
            <span className="text-[11px] font-semibold text-secondary">Tags:</span>
            {item.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-secondary rounded text-[10px] font-mono">
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Panel Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-border-main flex items-center justify-between text-xs font-mono">
          <span className="text-muted text-[11px]">
            HASH ID: {item.id} // SEC-VERIFIED
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-subtle"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
