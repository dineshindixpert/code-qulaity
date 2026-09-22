import React, { useState, useEffect } from 'react';
import { 
  Project, 
  Run, 
  Rule, 
  Finding, 
  RouteView 
} from './types';
import { 
  MOCK_PROJECTS, 
  MOCK_RUNS, 
  MOCK_RULES, 
  MOCK_FINDINGS, 
  MOCK_GITHUB_INSTALLATION, 
  MOCK_GITHUB_REPOSITORIES 
} from './mockData';

// Layout components
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { CommandSearchModal } from './components/CommandSearchModal';
import { FindingDrawer } from './components/FindingDrawer';
import { CreateProjectModal } from './components/CreateProjectModal';
import { RuleDetailModal } from './components/RuleDetailModal';

// Views
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectOverviewView } from './components/ProjectOverviewView';
import { GitHubScanView } from './components/GitHubScanView';
import { RunDetailsView } from './components/RunDetailsView';
import { RulesView } from './components/RulesView';
import { CreateCustomRuleView } from './components/CreateCustomRuleView';
import { RunHistoryView } from './components/RunHistoryView';
import { UploadZipView } from './components/UploadZipView';
import { ProjectSettingsView } from './components/ProjectSettingsView';
import { GitHubIntegrationView } from './components/GitHubIntegrationView';
import { SettingsView } from './components/SettingsView';
import { ApiDocsView } from './components/ApiDocsView';

export default function App() {
  // Navigation & Shell State
  const [currentView, setCurrentView] = useState<RouteView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-001');
  const [selectedRunId, setSelectedRunId] = useState<string>('run-86');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Application Data State
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [runs, setRuns] = useState<Run[]>(MOCK_RUNS);
  const [rules, setRules] = useState<Rule[]>(MOCK_RULES);
  const [findings, setFindings] = useState<Finding[]>(MOCK_FINDINGS);

  // Modals & Drawer State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [selectedRuleForEdit, setSelectedRuleForEdit] = useState<Rule | null>(null);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K for Command Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Current active records
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const currentRun = runs.find(r => r.id === selectedRunId) || runs[0];

  // Route calculation for navbar & sidebar
  const getCurrentRouteString = (): string => {
    switch (currentView) {
      case 'dashboard': return '/';
      case 'projects': return '/projects';
      case 'project_overview': return `/projects/${selectedProjectId}`;
      case 'scan': return `/projects/${selectedProjectId}/scan`;
      case 'upload': return `/projects/${selectedProjectId}/upload`;
      case 'project_settings': return `/projects/${selectedProjectId}/settings`;
      case 'runs': return '/runs';
      case 'run_details': return `/runs/${selectedRunId}`;
      case 'rules': return '/rules';
      case 'create_rule': return '/rules/create';
      case 'github': return '/github';
      case 'api_docs': return '/api-docs';
      case 'settings': return '/settings';
      default: return '/';
    }
  };

  // Route click handler from Sidebar
  const handleRouteNavigate = (route: string) => {
    if (route === '/') setCurrentView('dashboard');
    else if (route === '/projects') setCurrentView('projects');
    else if (route === '/runs') setCurrentView('runs');
    else if (route === '/rules') setCurrentView('rules');
    else if (route === '/github') setCurrentView('github');
    else if (route === '/api-docs') setCurrentView('api_docs');
    else if (route === '/settings') setCurrentView('settings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Explicit view navigation
  const handleNavigate = (view: RouteView, projectId?: string, runId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    if (runId) setSelectedRunId(runId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Project Actions
  const handleCreateProject = (newProjectData: Partial<Project>) => {
    const newId = `proj-${Date.now().toString().slice(-4)}`;
    const newProject: Project = {
      id: newId,
      name: newProjectData.name || 'New Project',
      description: newProjectData.description || 'Source code analyzed with CQT engine.',
      repository: newProjectData.repository || 'Dineshindiexpert/new-repo',
      default_branch: newProjectData.default_branch || 'main',
      latest_score: 80,
      findings_count: 12,
      last_scan: 'Just now',
      status: 'Completed',
      created_at: new Date().toISOString(),
      source_type: newProjectData.source_type || 'github_app',
      severity_counts: {
        critical: 0,
        high: 2,
        medium: 7,
        low: 3
      }
    };

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newId);
    setCurrentView('project_overview');
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setCurrentView('projects');
  };

  // Run Actions
  const handleCompleteScan = (newRun: Run) => {
    setRuns(prev => [newRun, ...prev]);
    
    // Update project metrics
    setProjects(prev => prev.map(p => {
      if (p.id === newRun.project_id) {
        return {
          ...p,
          latest_score: newRun.score,
          findings_count: newRun.findings_count,
          last_scan: 'Just now',
          status: 'Completed',
          severity_counts: newRun.severity_counts
        };
      }
      return p;
    }));

    setSelectedRunId(newRun.id);
    setCurrentView('run_details');
  };

  // Rule Actions
  const handleToggleRuleEnabled = (ruleId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return { ...r, enabled: !r.enabled };
      }
      return r;
    }));
  };

  const handleCreateRule = (newRuleData: Partial<Rule>) => {
    const newRule: Rule = {
      id: newRuleData.id || `rule-${Date.now()}`,
      rule_id: newRuleData.rule_id || 'CUSTOM-01',
      name: newRuleData.name || 'Custom Rule',
      description: newRuleData.description || 'Project specific rule',
      language: newRuleData.language || 'Python',
      rule_type: newRuleData.rule_type || 'ast_pattern',
      category: newRuleData.category || 'Custom',
      severity: newRuleData.severity || 'medium',
      enabled: newRuleData.enabled ?? true,
      is_custom: true,
      source: 'Custom',
      project_id: newRuleData.project_id,
      configuration: newRuleData.configuration
    };

    setRules(prev => [newRule, ...prev]);
    setCurrentView('rules');
  };

  const handleUpdateRule = (updatedRule: Rule) => {
    setRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const currentRoute = getCurrentRouteString();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F14] text-slate-100 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleRouteNavigate}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        apiConnected={true}
        dbConnected={true}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-all duration-200 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-60'
      }`}>
        {/* Persistent Top Navbar */}
        <TopNavbar
          currentRoute={currentRoute}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNewScan={() => handleNavigate('scan', selectedProjectId)}
          onCreateProject={() => setIsCreateProjectOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          backendUrl="http://127.0.0.1:8000"
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* View Switching */}
            {currentView === 'dashboard' && (
              <DashboardView
                projects={projects}
                runs={runs}
                onSelectProject={(id: string) => handleNavigate('project_overview', id)}
                onScanProject={(id: string) => handleNavigate('scan', id)}
                onViewRun={(id: string) => handleNavigate('run_details', undefined, id)}
              />
            )}

            {currentView === 'projects' && (
              <ProjectsView
                projects={projects}
                onSelectProject={(id: string) => handleNavigate('project_overview', id)}
                onScanProject={(id: string) => handleNavigate('scan', id)}
                onOpenSettings={(id: string) => handleNavigate('project_settings', id)}
                onCreateProjectClick={() => setIsCreateProjectOpen(true)}
              />
            )}

            {currentView === 'project_overview' && currentProject && (
              <ProjectOverviewView
                project={currentProject}
                runs={runs}
                onScanProject={(id: string) => handleNavigate('scan', id)}
                onOpenSettings={(id: string) => handleNavigate('project_settings', id)}
                onUploadZip={(id: string) => handleNavigate('upload', id)}
                onViewRun={(runId: string) => handleNavigate('run_details', undefined, runId)}
              />
            )}

            {currentView === 'scan' && currentProject && (
              <GitHubScanView
                project={currentProject}
                rules={rules}
                githubInstallation={MOCK_GITHUB_INSTALLATION}
                githubRepos={MOCK_GITHUB_REPOSITORIES}
                onCompleteScan={handleCompleteScan}
                onCancel={() => handleNavigate('project_overview', currentProject.id)}
              />
            )}

            {currentView === 'run_details' && currentRun && (
              <RunDetailsView
                run={currentRun}
                findings={findings}
                onSelectFinding={(f: Finding) => setSelectedFinding(f)}
                onBackToProject={() => handleNavigate('project_overview', currentRun.project_id)}
              />
            )}

            {currentView === 'rules' && (
              <RulesView
                rules={rules}
                projects={projects}
                onToggleRuleEnabled={handleToggleRuleEnabled}
                onOpenCreateRule={() => handleNavigate('create_rule')}
                onSelectRuleForEdit={(rule: Rule) => setSelectedRuleForEdit(rule)}
                onDeleteRule={handleDeleteRule}
              />
            )}

            {currentView === 'create_rule' && (
              <CreateCustomRuleView
                projects={projects}
                onCreateRule={handleCreateRule}
                onCancel={() => handleNavigate('rules')}
              />
            )}

            {currentView === 'runs' && (
              <RunHistoryView
                runs={runs}
                projects={projects}
                onViewRun={(runId: string) => handleNavigate('run_details', undefined, runId)}
              />
            )}

            {currentView === 'upload' && currentProject && (
              <UploadZipView
                project={currentProject}
                onCompleteUpload={handleCompleteScan}
                onCancel={() => handleNavigate('project_overview', currentProject.id)}
              />
            )}

            {currentView === 'project_settings' && currentProject && (
              <ProjectSettingsView
                project={currentProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onBack={() => handleNavigate('project_overview', currentProject.id)}
              />
            )}

            {currentView === 'github' && (
              <GitHubIntegrationView
                installation={MOCK_GITHUB_INSTALLATION}
                repos={MOCK_GITHUB_REPOSITORIES}
                onSelectProjectRepo={(repoName: string) => {
                  const matched = projects.find(p => p.repository === repoName);
                  if (matched) {
                    handleNavigate('project_overview', matched.id);
                  } else {
                    handleNavigate('projects');
                  }
                }}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView />
            )}

            {currentView === 'api_docs' && (
              <ApiDocsView />
            )}
          </div>
        </main>
      </div>

      {/* Global Command Search Overlay (Ctrl+K) */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        runs={runs}
        rules={rules}
        findings={findings}
        onSelectProject={(id: string) => {
          handleNavigate('project_overview', id);
          setIsSearchOpen(false);
        }}
        onSelectRun={(id: string) => {
          handleNavigate('run_details', undefined, id);
          setIsSearchOpen(false);
        }}
        onSelectFinding={(f: Finding) => {
          setSelectedFinding(f);
          setIsSearchOpen(false);
        }}
        onSelectRule={(ruleId: string) => {
          const matched = rules.find(r => r.id === ruleId);
          if (matched) setSelectedRuleForEdit(matched);
          setIsSearchOpen(false);
        }}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
        githubInstallation={MOCK_GITHUB_INSTALLATION}
        githubRepos={MOCK_GITHUB_REPOSITORIES}
      />

      {/* Slide-over Finding Investigation Drawer */}
      <FindingDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />

      {/* Rule Detail & Configuration Modal */}
      <RuleDetailModal
        rule={selectedRuleForEdit}
        isOpen={!!selectedRuleForEdit}
        onClose={() => setSelectedRuleForEdit(null)}
        onUpdateRule={handleUpdateRule}
        onDeleteRule={handleDeleteRule}
      />
    </div>
  );
}
