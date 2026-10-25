import React, { useState } from 'react';
import { 
  Clock, 
  ExternalLink, 
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Filter,
  Sparkles
} from 'lucide-react';
import { TimelineEvent } from '../types';
import { PageHeader } from './PageHeader';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  onOpenEvidenceDetail: (evidenceId: string) => void;
  onOpenAnalyze: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  onOpenEvidenceDetail,
  onOpenAnalyze
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'explicit' | 'inferred'>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredEvents = timeline.filter((evt) => {
    if (filterMode === 'explicit') return !evt.is_inferred;
    if (filterMode === 'inferred') return evt.is_inferred;
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime() || 0;
    const timeB = new Date(b.timestamp).getTime() || 0;
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  const explicitCount = timeline.filter(e => !e.is_inferred).length;
  const inferredCount = timeline.filter(e => e.is_inferred).length;

  return (
    <div className="space-y-6">
      
      {/* PageHeader with count badge and actions */}
      <PageHeader
        title="Investigation Timeline"
        description="Reconstructed chronological timeline aligning electronic device transactions with human eyewitness sightings. Explicit hardware timestamps are strictly distinguished from inferred transit intervals."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-secondary border border-border-main font-semibold tabular-nums">
            {timeline.length} RECONSTRUCTED EVENTS
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-border-main text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'all' ? 'bg-white text-primary shadow-subtle font-semibold' : 'text-secondary hover:text-primary'
                }`}
              >
                All ({timeline.length})
              </button>
              <button
                onClick={() => setFilterMode('explicit')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'explicit' ? 'bg-white text-electric-600 shadow-subtle font-semibold' : 'text-secondary hover:text-primary'
                }`}
              >
                Explicit ({explicitCount})
              </button>
              <button
                onClick={() => setFilterMode('inferred')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'inferred' ? 'bg-white text-amber-600 shadow-subtle font-semibold' : 'text-secondary hover:text-primary'
                }`}
              >
                Inferred ({inferredCount})
              </button>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 rounded-lg border border-border-main bg-white hover:bg-slate-50 text-secondary transition-colors shadow-subtle"
              title="Toggle Sort Chronology"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Main Vertical Timeline Container */}
      {sortedEvents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-border-main shadow-subtle space-y-2">
          <Clock className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-semibold text-primary">No events found</h3>
          <p className="text-xs text-secondary">Try resetting your filter mode.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border-main">
          {sortedEvents.map((event) => (
            <div key={event.id} className="relative group">
              
              {/* Event Marker Node */}
              <div 
                className={`absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-transform group-hover:scale-125 ${
                  event.is_inferred 
                    ? 'border-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.15)]' 
                    : 'border-electric-600 shadow-[0_0_0_2px_rgba(49,94,251,0.15)]'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${event.is_inferred ? 'bg-amber-500' : 'bg-electric-600'}`} />
              </div>

              {/* Event Card */}
              <div className="bg-white rounded-xl border border-border-main hover:border-slate-300 shadow-subtle hover:shadow-card transition-all p-5 space-y-3">
                
                {/* Header: Timestamp, Badge, and Confidence */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-bold text-primary bg-slate-100 px-2.5 py-1 rounded-md border border-border-main tabular-nums">
                      {event.timestamp}
                    </span>

                    {event.is_inferred ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded font-semibold uppercase bg-amber-50 text-amber-800 border border-amber-200 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Inferred Sequence
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded font-semibold uppercase bg-electric-50 text-electric-700 border border-electric-200 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Explicit Device Log
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-mono text-muted text-[11px]">ID: {event.id}</span>
                    <span className="font-mono text-secondary text-[11px] tabular-nums">
                      Confidence: {Math.round(event.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Event Headline & Narrative */}
                <div>
                  <h3 className="text-sm font-bold text-primary tracking-tight font-sans">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-xs text-secondary leading-relaxed font-sans">
                    {event.description}
                  </p>
                </div>

                {/* Anchored Evidence References */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-border-subtle">
                  <span className="text-[11px] font-medium text-secondary">Source Anchor:</span>
                  
                  {/* Primary Evidence */}
                  <button
                    onClick={() => onOpenEvidenceDetail(event.primary_evidence_id)}
                    className="inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 rounded bg-electric-50 text-electric-600 border border-electric-200 hover:bg-electric-100 transition-colors"
                  >
                    Primary: {event.primary_evidence_id}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>

                  {/* Supporting Evidence */}
                  {event.supporting_evidence_ids.map((suppId) => (
                    <button
                      key={suppId}
                      onClick={() => onOpenEvidenceDetail(suppId)}
                      className="inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-50 text-secondary border border-border-main hover:bg-slate-100 transition-colors"
                    >
                      Corrob: {suppId}
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </button>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
