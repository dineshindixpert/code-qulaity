import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  PlayCircle, 
  ShieldCheck, 
  GitBranch, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Activity,
  Code2
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  apiConnected: boolean;
  dbConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  apiConnected,
  dbConnected
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, route: '/projects' },
    { id: 'runs', label: 'Runs', icon: PlayCircle, route: '/runs' },
    { id: 'rules', label: 'Rules', icon: ShieldCheck, route: '/rules' },
    { id: 'github', label: 'GitHub', icon: GitBranch, route: '/github' },
    { id: 'api-docs', label: 'API & Routes', icon: Code2, route: '/api-docs' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, route: '/settings' }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-30 transition-all duration-200 flex flex-col justify-between border-r shadow-xs ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ 
        backgroundColor: 'var(--cqt-sidebar)', 
        borderColor: 'var(--cqt-border)' 
      }}
    >
      {/* Top Header / Wordmark */}
      <div className="flex flex-col">
        <div className="h-14 border-b flex items-center justify-between px-3" style={{ borderColor: 'var(--cqt-border)' }}>
          {!collapsed ? (
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-xs font-bold tracking-tight">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-wide text-base leading-none text-slate-900">CQT</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">v0.1.0</span>
                </div>
                <span className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">Code Quality Tool</span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => onNavigate('/')}
              className="w-full flex justify-center cursor-pointer"
            >
              <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-xs font-bold">
                <Code2 className="w-5 h-5 text-white" />
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route));

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.route)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-indigo-600 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                } ${collapsed ? 'justify-center' : ''}`}
                style={{
                  backgroundColor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--cqt-primary)' : '3px solid transparent'
                }}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom system status & User profile */}
      <div className="p-2.5 border-t space-y-2.5" style={{ borderColor: 'var(--cqt-border)' }}>
        {!collapsed ? (
          <>
            {/* System Status Indicators */}
            <div 
              className="rounded p-2 text-xs space-y-1.5 border" 
              style={{ 
                backgroundColor: 'var(--cqt-card-hover)',
                borderColor: 'var(--cqt-border)' 
              }}
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  API Status
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-600 font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full ${apiConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {apiConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  Database
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-600 font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {dbConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center justify-between px-1.5 py-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
                  D
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-medium text-slate-900">Dinesh</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Developer</span>
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-medium">
                Admin
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <span 
              title="API & DB Connected" 
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"
            />
            <div 
              title="Dinesh (Developer)"
              className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700"
            >
              D
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
