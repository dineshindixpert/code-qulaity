import React from 'react';
import { 
  Search, 
  Menu, 
  Plus, 
  Play, 
  Server, 
  Github, 
  Bell, 
  ExternalLink,
  Command
} from 'lucide-react';

interface TopNavbarProps {
  currentRoute: string;
  onOpenSearch: () => void;
  onNewScan: () => void;
  onCreateProject: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  backendUrl: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentRoute,
  onOpenSearch,
  onNewScan,
  onCreateProject,
  onToggleSidebar,
  isSidebarCollapsed,
  backendUrl
}) => {
  // Format breadcrumb title
  const getBreadcrumb = () => {
    if (currentRoute === '/') return 'Dashboard';
    if (currentRoute === '/projects') return 'Projects';
    if (currentRoute.startsWith('/projects/') && currentRoute.endsWith('/scan')) return 'Projects / Scan Repository';
    if (currentRoute.startsWith('/projects/') && currentRoute.endsWith('/settings')) return 'Projects / Settings';
    if (currentRoute.startsWith('/projects/') && currentRoute.endsWith('/upload')) return 'Projects / Upload ZIP';
    if (currentRoute.startsWith('/projects/')) return 'Projects / Overview';
    if (currentRoute.startsWith('/runs/')) return 'Runs / Run Details';
    if (currentRoute === '/runs') return 'Analysis Runs';
    if (currentRoute === '/rules/create') return 'Rules / Create Custom Rule';
    if (currentRoute === '/rules') return 'Rule Management';
    if (currentRoute === '/github') return 'GitHub Integration';
    if (currentRoute === '/settings') return 'Settings & API';
    return 'CQT';
  };

  return (
    <header 
      className="sticky top-0 z-20 h-14 border-b flex items-center justify-between px-4 sm:px-6 transition-all"
      style={{ 
        backgroundColor: '#0c1017', 
        borderColor: 'var(--cqt-border)' 
      }}
    >
      {/* Left side: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
          <span className="text-slate-500">CQT</span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Center: Command / Search Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs sm:text-sm border transition-colors text-slate-400 hover:text-slate-200"
          style={{ 
            backgroundColor: '#121721', 
            borderColor: 'var(--cqt-border)' 
          }}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">Search projects, runs, rules, finding IDs...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Action Buttons & Backend Indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend API status tag */}
        <div 
          title={`Configured Backend: ${backendUrl}`}
          className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono border"
          style={{ 
            backgroundColor: 'rgba(99, 102, 241, 0.08)', 
            borderColor: 'rgba(99, 102, 241, 0.25)',
            color: '#a5b4fc'
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>127.0.0.1:8000</span>
        </div>

        <button
          onClick={onOpenSearch}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onNewScan}
          className="cqt-btn cqt-btn-primary cqt-btn-sm"
          title="Start repository scan"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Scan Repo</span>
        </button>

        <button
          onClick={onCreateProject}
          className="cqt-btn cqt-btn-secondary cqt-btn-sm"
          title="Create new project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>
    </header>
  );
};
