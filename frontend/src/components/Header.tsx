import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  RotateCcw, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { HealthInfo } from '../types';

interface HeaderProps {
  health: HealthInfo | null;
  onLoadDemo: () => void;
  onOpenAnalyze: () => void;
  onOpenAddEvidence: () => void;
  onSelectTab: (tab: string) => void;
  isAnalyzing: boolean;
  isFixtureData?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  onLoadDemo,
  onOpenAnalyze,
  onOpenAddEvidence,
  onSelectTab,
  isAnalyzing,
  isFixtureData
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Case Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('overview')}>
              <div className="w-9 h-9 bg-navy-900 rounded-md flex items-center justify-center text-white font-mono font-bold text-lg shadow-sm">
                E
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-navy-900 tracking-tight text-lg">ECHO</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                    v1.0 MVP
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Multimodal Evidence Intelligence Engine</p>
              </div>
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200" />

            <div className="hidden lg:flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-subtle-pulse"></span>
                Active Case
              </span>
              <span className="text-xs font-mono text-slate-600 truncate max-w-xs font-medium">
                {health?.case_name || "Operation Apex Glass - Facility Security Breach"}
              </span>
            </div>
          </div>

          {/* Model Status & Actions */}
          <div className="flex items-center space-x-3">
            {/* Gemma 4 Model Tag */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono text-slate-700 font-medium">
                {health?.model_configured || "gemma-4-26b-a4b-it"}
              </span>
              {health?.api_key_present ? (
                <span className="inline-flex items-center text-emerald-600 font-medium text-[11px]" title="Gemini API Key loaded in backend">
                  <CheckCircle2 className="w-3 h-3 ml-1" />
                  Live API
                </span>
              ) : (
                <span className="inline-flex items-center text-amber-600 font-medium text-[11px]" title="API key not set; fallback fixture active">
                  <AlertTriangle className="w-3 h-3 ml-1" />
                  Fixture Mode
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <button
              onClick={onOpenAddEvidence}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-hidden transition-colors shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Add Evidence
            </button>

            <button
              onClick={onLoadDemo}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-hidden transition-colors shadow-2xs"
              title="Reload synthetic workplace security incident scenario"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Reset Demo Case
            </button>

            <button
              onClick={onOpenAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden transition-colors shadow-xs disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Run Gemma 4'}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
