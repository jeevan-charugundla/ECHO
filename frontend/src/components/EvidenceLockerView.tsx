import React, { useState } from 'react';
import { 
  FolderArchive, 
  Search, 
  Plus, 
  FileImage, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Calendar, 
  Tag, 
  Eye, 
  Trash2, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  UploadCloud,
  LayoutGrid,
  List
} from 'lucide-react';
import { EvidenceItem } from '../types';
import { PageHeader } from './PageHeader';

interface EvidenceLockerViewProps {
  evidence: EvidenceItem[];
  onOpenAddModal: () => void;
  onOpenDetailModal: (id: string) => void;
  onDeleteEvidence: (id: string) => void;
  onLoadDemo: () => void;
  onOpenAnalyze: () => void;
}

export const EvidenceLockerView: React.FC<EvidenceLockerViewProps> = ({
  evidence,
  onOpenAddModal,
  onOpenDetailModal,
  onDeleteEvidence,
  onLoadDemo,
  onOpenAnalyze
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  const filteredEvidence = evidence.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content_text && item.content_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || item.evidence_type === selectedType;

    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-4 h-4 text-electric-600" />;
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'document':
        return <FileCode className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-secondary" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* PageHeader with Ingest and Reset Actions */}
      <PageHeader
        title="Evidence Locker Repository"
        description="Forensic repository of multimodal inputs including surveillance feeds, digital card access logs, first responder reports, and witness depositions."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-secondary border border-border-main font-semibold tabular-nums">
            {evidence.length} ITEMS AUTHENTICATED
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md text-secondary bg-white hover:bg-slate-50 border border-border-main transition-colors shadow-subtle"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-muted" />
              Reset Demo Fixtures
            </button>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-electric-600 hover:bg-electric-700 shadow-subtle transition-colors"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Ingest Evidence
            </button>
          </div>
        }
      />

      {/* Quick Upload Dropzone Banner */}
      <div 
        onClick={onOpenAddModal}
        className="p-4 border-2 border-dashed border-border-main hover:border-electric-500 rounded-xl bg-white hover:bg-electric-50/20 cursor-pointer transition-all flex items-center justify-between group shadow-subtle"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-electric-50 text-electric-600 rounded-lg group-hover:scale-105 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-primary">Drag & Drop or Click to Ingest Evidence</h3>
            <p className="text-[11px] text-secondary mt-0.5">
              Supports JPEG/PNG surveillance stills, CSV audit trail logs, TXT/Markdown statements, and dispatch logs.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-electric-600 bg-white px-3 py-1.5 rounded-lg border border-border-main shadow-subtle group-hover:border-electric-300">
          Upload File
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
          <input
            type="text"
            placeholder="Search titles, sources, transcripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-border-main rounded-lg text-xs text-primary placeholder-muted focus:outline-hidden focus:border-electric-500 focus:ring-1 focus:ring-electric-500 shadow-subtle"
          />
        </div>

        {/* Type Filter Pills & Layout Toggle */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {['all', 'text', 'image', 'csv', 'document'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${
                  selectedType === t
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'bg-white text-secondary border border-border-main hover:bg-slate-50'
                }`}
              >
                {t} {t !== 'all' && `(${evidence.filter(e => e.evidence_type === t).length})`}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center space-x-1 p-0.5 bg-slate-100 rounded-lg border border-border-main">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1 rounded ${viewLayout === 'grid' ? 'bg-white text-primary shadow-subtle' : 'text-muted hover:text-secondary'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('table')}
              className={`p-1 rounded ${viewLayout === 'table' ? 'bg-white text-primary shadow-subtle' : 'text-muted hover:text-secondary'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Grid or Table View */}
      {filteredEvidence.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-border-main shadow-subtle space-y-2">
          <FolderArchive className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-semibold text-primary">No evidence items match your criteria</h3>
          <p className="text-xs text-secondary">Try adjusting your search terms or type filter.</p>
        </div>
      ) : viewLayout === 'table' ? (
        /* Table Layout */
        <div className="bg-white rounded-xl border border-border-main overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 text-secondary font-mono text-[11px] border-b border-border-main">
                <tr>
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Title</th>
                  <th className="p-3 font-semibold">Source</th>
                  <th className="p-3 font-semibold">Timestamp</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredEvidence.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-electric-600 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="p-3 font-medium text-primary cursor-pointer hover:text-electric-600" onClick={() => onOpenDetailModal(item.id)}>
                      {item.title}
                    </td>
                    <td className="p-3 text-secondary">{item.source_name}</td>
                    <td className="p-3 font-mono text-secondary whitespace-nowrap tabular-nums">{item.timestamp_raw}</td>
                    <td className="p-3 font-mono uppercase text-muted whitespace-nowrap">{item.evidence_type}</td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => onOpenDetailModal(item.id)}
                        className="text-xs font-semibold text-electric-600 hover:text-electric-700"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onDeleteEvidence(item.id)}
                        className="text-xs text-muted hover:text-crimson-600 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvidence.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-border-main hover:border-slate-300 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Image Thumbnail Preview if Image Evidence */}
              {item.evidence_type === 'image' && item.image_base64 && (
                <div 
                  onClick={() => onOpenDetailModal(item.id)}
                  className="relative w-full h-44 bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={`data:${item.image_mime_type || 'image/jpeg'};base64,${item.image_base64}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/20">
                    VISUAL FEED // {item.id}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-electric-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center">
                    <Eye className="w-3 h-3 mr-1" /> Inspect Frame
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-electric-600 bg-electric-50 px-1.5 py-0.5 rounded text-[11px] border border-electric-200">
                        {item.id}
                      </span>
                      <span className="inline-flex items-center space-x-1 text-secondary text-[11px] font-medium">
                        {getTypeIcon(item.evidence_type)}
                        <span className="uppercase">{item.evidence_type}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteEvidence(item.id)}
                      className="text-muted hover:text-crimson-600 transition-colors p-1"
                      title="Remove from locker"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 
                    onClick={() => onOpenDetailModal(item.id)}
                    className="text-sm font-bold text-primary hover:text-electric-600 cursor-pointer line-clamp-2 font-sans tracking-tight"
                  >
                    {item.title}
                  </h3>

                  <div className="mt-1 flex items-center text-[11px] text-secondary">
                    <span className="font-medium text-primary truncate">{item.source_name}</span>
                  </div>

                  <div className="mt-1 flex items-center text-[11px] font-mono text-secondary tabular-nums">
                    <Calendar className="w-3 h-3 mr-1 text-muted flex-shrink-0" />
                    <span className="truncate">{item.timestamp_raw}</span>
                  </div>

                  {/* Excerpt */}
                  {item.content_text && item.evidence_type !== 'image' && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 border border-border-subtle rounded-lg text-xs text-secondary font-mono line-clamp-3 leading-relaxed">
                      {item.content_text}
                    </div>
                  )}

                  {item.description && (
                    <p className="mt-2 text-xs text-secondary line-clamp-2 italic font-sans">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Tags and Action Footer */}
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-secondary rounded font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenDetailModal(item.id)}
                    className="text-xs font-semibold text-electric-600 hover:text-electric-700 inline-flex items-center"
                  >
                    Details <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
