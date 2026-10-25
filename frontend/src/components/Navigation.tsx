import React from 'react';
import { 
  LayoutDashboard, 
  FolderArchive, 
  Clock, 
  GitFork, 
  FileCheck, 
  ListCheck
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  evidenceCount: number;
  timelineCount: number;
  contradictionCount: number;
  pendingTasksCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  evidenceCount,
  timelineCount,
  contradictionCount,
  pendingTasksCount
}) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'evidence',
      label: 'Evidence Locker',
      icon: FolderArchive,
      badge: evidenceCount > 0 ? evidenceCount : null
    },
    {
      id: 'timeline',
      label: 'Investigation Timeline',
      icon: Clock,
      badge: timelineCount > 0 ? timelineCount : null
    },
    {
      id: 'contradictions',
      label: 'Findings & Contradictions',
      icon: GitFork,
      badge: contradictionCount > 0 ? contradictionCount : null,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'tasks',
      label: 'Agentic Tasks',
      icon: ListCheck,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount} pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'report',
      label: 'Final Report',
      icon: FileCheck,
      badge: null
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-xs whitespace-nowrap transition-colors focus:outline-hidden ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono border ${
                      tab.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
