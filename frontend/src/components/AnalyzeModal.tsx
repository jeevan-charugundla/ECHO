import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  RotateCcw,
  Zap,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { HealthInfo } from '../types';

interface AnalyzeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAnalysis: (forceFixture: boolean) => Promise<void>;
  health: HealthInfo | null;
  evidenceCount: number;
}

export const AnalyzeModal: React.FC<AnalyzeModalProps> = ({
  isOpen,
  onClose,
  onExecuteAnalysis,
  health,
  evidenceCount
}) => {
  const [forceFixture, setForceFixture] = useState<boolean>(!health?.api_key_present);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartAnalysis = async () => {
    setIsRunning(true);
    setErrorMessage(null);

    try {
      await onExecuteAnalysis(forceFixture);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please verify API key and connectivity.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Execute Multimodal Investigation Synthesis
              </h3>
              <p className="text-xs text-slate-500">
                Cross-correlate {evidenceCount} evidence items using Google Gemma 4.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isRunning}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ×
          </button>
        </div>

        {/* Error Display with Retry */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-md space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-rose-800 font-bold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Gemma 4 Analysis Failure</span>
            </div>
            <p className="text-rose-700 leading-relaxed font-mono text-[11px]">
              {errorMessage}
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => setForceFixture(true)}
                className="text-xs font-semibold text-rose-800 underline hover:text-rose-900"
              >
                Switch to Deterministic Demo Fixture
              </button>
              <button
                onClick={handleStartAnalysis}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Model Spec Details */}
        <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center">
              <Cpu className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Target Model:
            </span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {health?.model_configured || "gemma-4-26b-a4b-it"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Gemini API Key Backend Status:</span>
            {health?.api_key_present ? (
              <span className="text-emerald-700 font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Configured & Verified
              </span>
            ) : (
              <span className="text-amber-700 font-semibold flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" /> Not Configured in backend/.env
              </span>
            )}
          </div>
        </div>

        {/* Execution Mode Radio Options */}
        <div className="space-y-3 text-xs">
          <label className="block font-semibold text-slate-800">
            Select Execution Mode:
          </label>

          <div 
            onClick={() => setForceFixture(false)}
            className={`p-3.5 rounded-md border cursor-pointer transition-all ${
              !forceFixture
                ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="exec_mode"
                  checked={!forceFixture}
                  onChange={() => setForceFixture(false)}
                  className="text-blue-600"
                />
                <span className="font-bold text-navy-900">
                  Live Gemma 4 Multimodal Inference (Official GenAI SDK)
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase font-semibold">
                Live API
              </span>
            </div>
            <p className="mt-1 text-slate-600 text-[11px] pl-5 leading-relaxed">
              Streams raw image bytes and structured text evidence to Google Gemini API using Gemma 4 MoE architecture (`gemma-4-26b-a4b-it`). Produces live structured JSON.
            </p>
          </div>

          <div 
            onClick={() => setForceFixture(true)}
            className={`p-3.5 rounded-md border cursor-pointer transition-all ${
              forceFixture
                ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="exec_mode"
                  checked={forceFixture}
                  onChange={() => setForceFixture(true)}
                  className="text-blue-600"
                />
                <span className="font-bold text-navy-900">
                  Grounded Deterministic Demo Fixture
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase font-semibold">
                Instant Offline
              </span>
            </div>
            <p className="mt-1 text-slate-600 text-[11px] pl-5 leading-relaxed">
              Instantly synthesizes the pre-verified baseline for the 5 synthetic workplace security incident evidence items with 100% deterministic accuracy.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isRunning}
            onClick={handleStartAnalysis}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Synthesizing with Gemma 4...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Start Investigation Analysis
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
