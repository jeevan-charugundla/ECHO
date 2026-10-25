import React from 'react';
import { 
  LayoutDashboard, 
  FolderArchive, 
  Clock, 
  GitFork, 
  FileCheck, 
  ListCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
  Cpu
} from 'lucide-react';
import { HealthInfo } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  evidenceCount: number;
  timelineCount: number;
  contradictionCount: number;
  pendingTasksCount: number;
  health: HealthInfo | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  evidenceCount,
  timelineCount,
  contradictionCount,
  pendingTasksCount,
  health,
  collapsed,
  onToggleCollapse
}) => {
  const navItems = [
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
      label: 'Timeline',
      icon: Clock,
      badge: timelineCount > 0 ? timelineCount : null
    },
    {
      id: 'contradictions',
      label: 'Findings & Conflicts',
      icon: GitFork,
      badge: contradictionCount > 0 ? contradictionCount : null,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'tasks',
      label: 'Agentic Tasks',
      icon: ListCheck,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'report',
      label: 'Final Report',
      icon: FileCheck,
      badge: null
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-border-main flex flex-col justify-between transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-18' : 'w-64'
      } flex-shrink-0 min-h-screen sticky top-0`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="h-16 px-4 border-b border-border-main flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('overview')}>
              <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center text-white font-mono font-bold text-sm shadow-subtle">
                E
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-primary tracking-tight text-base font-sans">ECHO</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-100 text-secondary border border-border-main">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-secondary font-medium leading-none">Evidence Intelligence</p>
              </div>
            </div>
          ) : (
            <div 
              className="w-8 h-8 rounded-lg bg-navy-900 mx-auto flex items-center justify-center text-white font-mono font-bold text-sm cursor-pointer shadow-subtle"
              onClick={() => onSelectTab('overview')}
            >
              E
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-secondary hover:text-primary hover:bg-slate-100 transition-colors focus:outline-hidden"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-lg px-3 py-2.5 text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-electric-50 text-electric-600 font-semibold'
                    : 'text-secondary hover:text-primary hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-electric-600 rounded-r-full" />
                )}
                
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-electric-600' : 'text-muted group-hover:text-secondary'
                  } ${collapsed ? 'mx-auto' : 'mr-3'}`}
                />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge !== null && (
                  <span
                    className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-mono border tabular-nums ${
                      item.badgeColor || 'bg-slate-100 text-secondary border-border-main'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Case & Model Status Card */}
      <div className="p-3 border-t border-border-main bg-slate-50/50">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="p-2.5 bg-white rounded-lg border border-border-main shadow-subtle space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-secondary font-semibold">ACTIVE DOSSIER</span>
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-live-pulse" />
                  LIVE
                </span>
              </div>
              <div className="text-xs font-semibold text-primary truncate">
                {health?.case_name || 'Operation Apex Glass'}
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted pt-1 border-t border-border-subtle font-mono">
                <span>CASE #2026-SRB-09</span>
                <span className="text-electric-600 font-medium">Gemma 4</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Case #2026-SRB-09 (Active)">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-live-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
