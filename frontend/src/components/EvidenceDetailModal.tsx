import React from 'react';
import { 
  FileImage, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  Tag, 
  X, 
  ExternalLink,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceDetailModalProps {
  item: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              {item.id}
            </span>
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wide">
              Evidence Forensic Record
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          <div>
            <h2 className="text-base font-bold text-navy-900">{item.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-slate-500 font-mono text-[11px]">
              <span>Source: <strong className="text-slate-700">{item.source_name}</strong></span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {item.timestamp_raw}
              </span>
              <span>•</span>
              <span className="uppercase font-semibold text-blue-600">{item.evidence_type}</span>
            </div>
          </div>

          {/* Visual Feed if Image */}
          {item.evidence_type === 'image' && item.image_base64 && (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-slate-900 bg-slate-950">
                <img
                  src={`data:${item.image_mime_type || 'image/jpeg'};base64,${item.image_base64}`}
                  alt={item.title}
                  className="w-full h-auto object-contain max-h-96 mx-auto"
                />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-emerald-400 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/30 flex items-center">
                  <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  AUTHENTICATED HIGH-RES FRAME RECOVERY
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Surveillance still stamped at 2026-10-24 22:18:14 UTC with HUD camera telemetry.
              </p>
            </div>
          )}

          {/* Text Transcript or CSV tabular data */}
          {item.content_text && (
            <div className="space-y-1.5">
              <span className="font-bold text-navy-900 uppercase tracking-wider text-[10px] block">
                {item.evidence_type === 'csv' ? 'Audit Log Data (CSV Format)' : 'Raw Content / Deposition Transcript'}
              </span>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-60 border border-slate-800">
                {item.content_text}
              </pre>
            </div>
          )}

          {/* Investigator Description */}
          {item.description && (
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="font-bold text-slate-800 block mb-0.5 text-[11px]">
                Investigator Context:
              </span>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[11px] font-semibold text-slate-500">Tags:</span>
            {item.tags.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-mono">
                #{t}
              </span>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400 text-[11px]">
            HASH ID: {item.id} // SEC-VERIFIED
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
