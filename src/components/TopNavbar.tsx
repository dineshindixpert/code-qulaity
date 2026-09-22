import React from 'react';
import { 
  Search, 
  Menu, 
  Plus, 
  Play, 
  Command,
  Sun,
  Moon
} from 'lucide-react';

interface TopNavbarProps {
  currentRoute: string;
  onOpenSearch: () => void;
  onNewScan: () => void;
  onCreateProject: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  backendUrl: string;
  apiConnected?: boolean;
  onNavigateSettings?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentRoute,
  onOpenSearch,
  onNewScan,
  onCreateProject,
  onToggleSidebar,
  backendUrl,
  apiConnected = true,
  onNavigateSettings,
  theme = 'light',
  onToggleTheme
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
    if (currentRoute === '/api-docs') return 'API & Routes';
    if (currentRoute === '/settings') return 'Settings & API';
    return 'CQT';
  };

  return (
    <header 
      className="sticky top-0 z-20 h-14 border-b flex items-center justify-between px-4 sm:px-6 transition-colors shadow-xs"
      style={{ 
        backgroundColor: 'var(--cqt-sidebar)', 
        borderColor: 'var(--cqt-border)' 
      }}
    >
      {/* Left side: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="text-slate-400 font-mono">CQT</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Center: Command / Search Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs sm:text-sm border transition-colors text-slate-500 hover:text-slate-800 hover:border-slate-300"
          style={{ 
            backgroundColor: 'var(--cqt-card-hover)', 
            borderColor: 'var(--cqt-border)' 
          }}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search projects, runs, rules, finding IDs...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-slate-200/80 text-slate-600 border border-slate-300 font-mono">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Action Buttons & Backend Indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend API status tag */}
        <button
          onClick={onNavigateSettings}
          title={`Configured Backend: ${backendUrl} (${apiConnected ? 'Connected' : 'Offline / Click to configure'})`}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer hover:border-indigo-400"
          style={{ 
            backgroundColor: apiConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', 
            borderColor: apiConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
            color: apiConnected ? '#059669' : '#d97706'
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${apiConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span>{backendUrl ? backendUrl.replace(/^https?:\/\//, '') : '127.0.0.1:8000'}</span>
        </button>

        {/* Theme Toggle (Light / Dark) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="cqt-btn cqt-btn-outline cqt-btn-sm p-2 text-slate-600 hover:text-slate-900 border-slate-200"
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            aria-label="Toggle visual theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        )}

        <button
          onClick={onOpenSearch}
          className="md:hidden text-slate-500 hover:text-slate-900 p-2 rounded hover:bg-slate-100"
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
