import React, { useState, useEffect } from 'react';
import { 
  Sidebar 
} from './components/Sidebar';
import { 
  TopHeader 
} from './components/TopHeader';
import { 
  OverviewView 
} from './components/OverviewView';
import { 
  EvidenceLockerView 
} from './components/EvidenceLockerView';
import { 
  TimelineView 
} from './components/TimelineView';
import { 
  ContradictionsView 
} from './components/ContradictionsView';
import { 
  TasksView 
} from './components/TasksView';
import { 
  ReportView 
} from './components/ReportView';
import { 
  EvidenceDetailPanel 
} from './components/EvidenceDetailPanel';
import { 
  AddEvidenceModal 
} from './components/AddEvidenceModal';
import { 
  AnalyzeModal 
} from './components/AnalyzeModal';
import { 
  fetchHealth, 
  loadDemoCase, 
  deleteEvidenceItem, 
  runAnalysis, 
  fetchReport, 
  fetchTasks, 
  performTaskAction, 
  createManualTask 
} from './api';
import { 
  HealthInfo, 
  EvidenceItem, 
  EvidenceAnalysisResult, 
  InvestigationReport, 
  InvestigationTask 
} from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [analysis, setAnalysis] = useState<EvidenceAnalysisResult | null>(null);
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [tasks, setTasks] = useState<InvestigationTask[]>([]);
  
  // Modals & Panels
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState<boolean>(false);
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isRegeneratingReport, setIsRegeneratingReport] = useState<boolean>(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Initial load
  useEffect(() => {
    const initApp = async () => {
      try {
        const h = await fetchHealth();
        setHealth(h);
        
        // Load demo case by default
        const demo = await loadDemoCase();
        setEvidence(demo.evidence);
        setAnalysis(demo.analysis);
        setReport(demo.report);
        setTasks(demo.tasks);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        showToast('Connected in offline mode or waiting for backend server.', 'info');
      }
    };
    initApp();
  }, []);

  const handleLoadDemo = async () => {
    try {
      const demo = await loadDemoCase();
      setEvidence(demo.evidence);
      setAnalysis(demo.analysis);
      setReport(demo.report);
      setTasks(demo.tasks);
      showToast('Prepared demo case (Operation Apex Glass) loaded with 5 multimodal items.');
    } catch (err: any) {
      showToast(err.message || 'Failed to load demo case', 'error');
    }
  };

  const handleExecuteAnalysis = async (forceFixture: boolean) => {
    setIsAnalyzing(true);
    try {
      const res = await runAnalysis(forceFixture);
      setAnalysis(res);
      
      // Refresh tasks
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
      
      showToast(
        forceFixture 
          ? 'Analysis updated using verified baseline fixture.' 
          : 'Live Gemma 4 multimodal analysis completed successfully!'
      );
    } catch (err: any) {
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteEvidence = async (id: string) => {
    try {
      await deleteEvidenceItem(id);
      setEvidence(prev => prev.filter(e => e.id !== id));
      showToast(`Evidence item ${id} deleted.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete evidence', 'error');
    }
  };

  const handleEvidenceAdded = (item: EvidenceItem) => {
    setEvidence(prev => [item, ...prev]);
    showToast(`Evidence ${item.id} successfully ingested into locker.`);
  };

  const handlePerformTaskAction = async (taskId: string, action: 'approve' | 'reject', approverName: string, notes?: string) => {
    try {
      const res = await performTaskAction(taskId, action, approverName, notes);
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
      showToast(res.message);
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleCreateManualTask = async (title: string, description: string, evidenceIds: string[]) => {
    try {
      await createManualTask({ title, description, evidence_ids: evidenceIds });
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
      showToast('Investigation action created and queued.');
    } catch (err: any) {
      showToast(err.message || 'Failed to create task', 'error');
    }
  };

  const handleRegenerateReport = async () => {
    setIsRegeneratingReport(true);
    try {
      const isFixture = analysis?.is_fixture_data ?? true;
      const rep = await fetchReport(isFixture);
      setReport(rep);
      showToast('Intelligence Report refreshed.');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate report', 'error');
    } finally {
      setIsRegeneratingReport(false);
    }
  };

  const selectedEvidence = evidence.find(e => e.id === selectedEvidenceId) || null;

  return (
    <div className="min-h-screen bg-background text-primary flex font-sans antialiased">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-modal border text-xs font-medium animate-in fade-in slide-in-from-bottom-5 bg-white border-border-main text-primary">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-crimson-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          )}
          <span className="font-sans">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-muted hover:text-primary">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Persistent Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        evidenceCount={evidence.length}
        timelineCount={analysis?.timeline.length || 0}
        contradictionCount={analysis?.contradictions.length || 0}
        pendingTasksCount={tasks.filter(t => t.status === 'pending_approval').length}
        health={health}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <TopHeader
          health={health}
          evidenceCount={evidence.length}
          onLoadDemo={handleLoadDemo}
          onOpenAnalyze={() => setIsAnalyzeOpen(true)}
          onOpenAddEvidence={() => setIsAddEvidenceOpen(true)}
          isAnalyzing={isAnalyzing}
        />

        {/* Dynamic View Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
          {currentTab === 'overview' && (
            <OverviewView
              analysis={analysis}
              evidence={evidence}
              tasks={tasks}
              onSelectTab={setCurrentTab}
              onOpenEvidenceDetail={setSelectedEvidenceId}
              onOpenAnalyze={() => setIsAnalyzeOpen(true)}
            />
          )}

          {currentTab === 'evidence' && (
            <EvidenceLockerView
              evidence={evidence}
              onOpenAddModal={() => setIsAddEvidenceOpen(true)}
              onOpenDetailModal={setSelectedEvidenceId}
              onDeleteEvidence={handleDeleteEvidence}
              onLoadDemo={handleLoadDemo}
              onOpenAnalyze={() => setIsAnalyzeOpen(true)}
            />
          )}

          {currentTab === 'timeline' && (
            <TimelineView
              timeline={analysis?.timeline || []}
              onOpenEvidenceDetail={setSelectedEvidenceId}
              onOpenAnalyze={() => setIsAnalyzeOpen(true)}
            />
          )}

          {currentTab === 'contradictions' && (
            <ContradictionsView
              contradictions={analysis?.contradictions || []}
              claims={analysis?.claims || []}
              observations={analysis?.direct_observations || []}
              onOpenEvidenceDetail={setSelectedEvidenceId}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onPerformAction={handlePerformTaskAction}
              onCreateManualTask={handleCreateManualTask}
              onOpenEvidenceDetail={setSelectedEvidenceId}
            />
          )}

          {currentTab === 'report' && (
            <ReportView
              report={report}
              onRegenerate={handleRegenerateReport}
              onOpenEvidenceDetail={setSelectedEvidenceId}
              isRegenerating={isRegeneratingReport}
            />
          )}
        </main>

        {/* Professional Minimal Footer */}
        <footer className="border-t border-border-main bg-white py-3.5 px-6 print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-muted font-mono">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-primary font-sans">ECHO</span>
              <span>•</span>
              <span>Multimodal Evidence Intelligence Engine</span>
              <span>•</span>
              <span className="text-electric-600 font-semibold">{health?.model_configured || 'gemma-4-26b-a4b-it'}</span>
            </div>
            <div className="mt-1 sm:mt-0 text-[11px] text-muted">
              Source-Linked Grounding & Human-in-the-Loop Protocol
            </div>
          </div>
        </footer>

      </div>

      {/* Forensic Evidence Detail Inspector Modal */}
      <EvidenceDetailPanel
        item={selectedEvidence}
        onClose={() => setSelectedEvidenceId(null)}
      />

      {/* Ingest Evidence Modal */}
      <AddEvidenceModal
        isOpen={isAddEvidenceOpen}
        onClose={() => setIsAddEvidenceOpen(false)}
        onEvidenceAdded={handleEvidenceAdded}
      />

      {/* Gemma 4 Synthesis Trigger Modal */}
      <AnalyzeModal
        isOpen={isAnalyzeOpen}
        onClose={() => setIsAnalyzeOpen(false)}
        onExecuteAnalysis={handleExecuteAnalysis}
        health={health}
        evidenceCount={evidence.length}
      />

    </div>
  );
}

export default App;
