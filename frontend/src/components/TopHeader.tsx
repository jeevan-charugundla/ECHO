import React from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { HealthInfo } from '../types';

interface TopHeaderProps {
  health: HealthInfo | null;
  evidenceCount: number;
  onLoadDemo: () => void;
  onOpenAnalyze: () => void;
  onOpenAddEvidence: () => void;
  isAnalyzing: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  health,
  evidenceCount,
  onLoadDemo,
  onOpenAnalyze,
  onOpenAddEvidence,
  isAnalyzing
}) => {
  return (
    <header className="h-16 bg-white border-b border-border-main px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      
      {/* Left: Investigation Context */}
      <div className="flex items-center space-x-3 truncate">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
          <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-live-pulse" />
          Active Investigation
        </span>

        <h1 className="text-sm font-bold text-primary truncate tracking-tight font-sans">
          {health?.case_name || "Operation Apex Glass - Corporate Server Facility Breach"}
        </h1>

        <span className="hidden md:inline-block text-border-main">•</span>

        <span className="hidden md:inline-block text-xs font-mono text-secondary tabular-nums">
          {evidenceCount} Evidence Items
        </span>
      </div>

      {/* Right: Model Status & Primary Restrained Actions */}
      <div className="flex items-center space-x-2.5 flex-shrink-0">
        
        {/* Gemma 4 Model Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-slate-50 border border-border-main rounded-md text-xs">
          <Cpu className="w-3.5 h-3.5 text-electric-600" />
          <span className="font-mono text-secondary text-[11px] font-medium">
            {health?.model_configured || "gemma-4-26b-a4b-it"}
          </span>
          {health?.api_key_configured ? (
            <span className="inline-flex items-center text-emerald-600 font-semibold text-[10px]" title="Gemini API Key active">
              <CheckCircle2 className="w-3 h-3 ml-0.5" />
              Live API
            </span>
          ) : (
            <span className="inline-flex items-center text-amber-600 font-semibold text-[10px]" title="Fixture fallback mode">
              <AlertTriangle className="w-3 h-3 ml-0.5" />
              Fixture
            </span>
          )}
        </div>

        {/* Action 1: Add Evidence */}
        <button
          onClick={onOpenAddEvidence}
          className="inline-flex items-center px-3 py-1.5 border border-border-main text-xs font-medium rounded-md text-secondary bg-white hover:bg-slate-50 hover:text-primary transition-colors shadow-subtle focus:outline-hidden"
          title="Upload or input new evidence item"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-secondary" />
          Add Evidence
        </button>

        {/* Action 2: Reset Demo Case */}
        <button
          onClick={onLoadDemo}
          className="inline-flex items-center px-2.5 py-1.5 border border-border-main text-xs font-medium rounded-md text-secondary bg-white hover:bg-slate-50 hover:text-primary transition-colors shadow-subtle focus:outline-hidden"
          title="Reload synthetic 5-item workplace security incident fixture"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1 text-secondary" />
          Reset Demo
        </button>

        {/* Action 3: Primary Run Gemma 4 Analysis */}
        <button
          onClick={onOpenAnalyze}
          disabled={isAnalyzing}
          className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-xs font-semibold rounded-md text-white bg-electric-600 hover:bg-electric-700 focus:outline-hidden transition-all shadow-subtle disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Run Gemma 4'}
        </button>

      </div>
    </header>
  );
};
