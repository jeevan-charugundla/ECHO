import React, { useState } from 'react';
import { Plus, X, Upload, FileImage, FileText, FileSpreadsheet } from 'lucide-react';
import { uploadEvidenceFile, createEvidenceItem } from '../api';
import { EvidenceItem } from '../types';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvidenceAdded: (item: EvidenceItem) => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  onClose,
  onEvidenceAdded
}) => {
  const [title, setTitle] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [evidenceType, setEvidenceType] = useState<'text' | 'image' | 'csv' | 'document'>('text');
  const [timestampRaw, setTimestampRaw] = useState(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
  const [description, setDescription] = useState('');
  const [contentText, setContentText] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setEvidenceType('image');
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.name.endsWith('.csv')) {
        setEvidenceType('csv');
        setFilePreview(null);
      } else {
        setEvidenceType('text');
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sourceName.trim()) {
      setErrorMsg('Please specify Title and Source Name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('source_name', sourceName);
        formData.append('timestamp_raw', timestampRaw);
        if (description) formData.append('description', description);
        if (tags) formData.append('tags', tags);
        formData.append('file', selectedFile);

        const newItem = await uploadEvidenceFile(formData);
        onEvidenceAdded(newItem);
        onClose();
      } else {
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        const newItem = await createEvidenceItem({
          title,
          source_name: sourceName,
          evidence_type: evidenceType,
          timestamp_raw: timestampRaw,
          content_text: contentText,
          description,
          tags: tagList
        });
        onEvidenceAdded(newItem);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 overflow-y-auto">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-navy-900">
              Ingest New Evidence Piece
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 font-bold text-lg"
          >
            ×
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3 text-xs">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Evidence Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Loading Bay Security Camera Still"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source Name / Origin:
              </label>
              <input
                type="text"
                required
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g. CCTV Cam-08 / Officer Hayes"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recorded Timestamp:
              </label>
              <input
                type="text"
                required
                value={timestampRaw}
                onChange={(e) => setTimestampRaw(e.target.value)}
                placeholder="2026-10-24 22:30:00 UTC"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* File Upload or Text Entry Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload File (Image, CSV, or Text Log):
            </label>
            <input
              type="file"
              accept="image/*,.csv,.txt,.log"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {filePreview && (
              <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden bg-slate-900 border border-slate-800">
                <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {!selectedFile && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Text Transcript / Document Content:
              </label>
              <textarea
                rows={4}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Enter witness statement, email text, log lines, or deposition transcript..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Investigator Context / Description:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Recovered from perimeter patrol logbook."
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags (comma separated):
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Physical Security, Surveillance, Perimeter"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Ingesting...' : 'Add to Evidence Locker'}
          </button>
        </div>
      </form>
    </div>
  );
};
