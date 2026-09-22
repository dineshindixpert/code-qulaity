import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Github, 
  Key, 
  Globe, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  FileCode, 
  Terminal, 
  Check, 
  Loader2, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Project, Rule, GitHubRepository, GitHubAppInstallation, Run } from '../types';

interface GitHubScanViewProps {
  project: Project;
  rules: Rule[];
  githubInstallation: GitHubAppInstallation;
  githubRepos: GitHubRepository[];
  onCompleteScan: (newRun: Run) => void;
  onCancel: () => void;
}

export const GitHubScanView: React.FC<GitHubScanViewProps> = ({
  project,
  rules,
  githubInstallation,
  githubRepos,
  onCompleteScan,
  onCancel
}) => {
  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isScanning, setIsScanning] = useState(false);

  // Step 1: Source
  const [sourceType, setSourceType] = useState<'app' | 'public' | 'pat'>('app');
  const [selectedRepo, setSelectedRepo] = useState(project.repository || githubRepos[0]?.full_name || 'Dineshindiexpert/int-code-quality-api');
  const [selectedBranch, setSelectedBranch] = useState(project.default_branch || 'dev');
  const [publicUrl, setPublicUrl] = useState('https://github.com/Dineshindiexpert/int-code-quality-api');
  const [patOwner, setPatOwner] = useState('Dineshindiexpert');
  const [patRepo, setPatRepo] = useState('int-code-quality-api');
  const [patBranch, setPatBranch] = useState('dev');

  // Step 2: Rules selection
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<string>>(() => {
    // Default select active rules (18 items)
    return new Set(rules.filter(r => r.enabled).map(r => r.id));
  });
  const [ruleSearch, setRuleSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Step 3: Scan Progress Steps
  const scanProgressSteps = [
    { id: 1, title: 'Repository connected' },
    { id: 2, title: 'Repository tree loaded' },
    { id: 3, title: 'Source files loaded' },
    { id: 4, title: 'Running Ruff' },
    { id: 5, title: 'Running Bandit' },
    { id: 6, title: 'Running Radon' },
    { id: 7, title: 'Running Duplicate Detection' },
    { id: 8, title: 'Running Security Scanners' },
    { id: 9, title: 'Running FastAPI Rules' },
    { id: 10, title: 'Running Custom Rules' },
    { id: 11, title: 'Normalizing findings' },
    { id: 12, title: 'Calculating quality score' }
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Toggle rule
  const handleToggleRule = (id: string) => {
    if (isScanning) return;
    const next = new Set(selectedRuleIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRuleIds(next);
  };

  const handleSelectAll = () => {
    if (isScanning) return;
    setSelectedRuleIds(new Set(rules.map(r => r.id)));
  };

  const handleClearAll = () => {
    if (isScanning) return;
    setSelectedRuleIds(new Set());
  };

  // Rule Filtering
  const categories = ['All', 'Security', 'Bug', 'Code Smell', 'Style', 'Complexity', 'Dependency', 'FastAPI', 'Duplicate Code', 'Custom'];

  const filteredRules = rules.filter(r => {
    const matchesSearch = 
      r.rule_id.toLowerCase().includes(ruleSearch.toLowerCase()) ||
      r.name.toLowerCase().includes(ruleSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(ruleSearch.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'All' ? true :
      categoryFilter === 'Custom' ? r.is_custom :
      r.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Start analysis trigger
  const handleStartAnalysis = () => {
    setIsScanning(true);
    setActiveStepIndex(0);
    setElapsedSeconds(0);
    setScanLogs([
      `[127.0.0.1:8000] POST /api/github/app/scan initiated`,
      `[AUTH] Authenticated as CQT App installation #${githubInstallation.id} (owner: ${githubInstallation.account_name})`,
      `[FETCH] Resolving Git ref: refs/heads/${selectedBranch} on ${selectedRepo}...`,
      `[TREE] 142 source files indexed (.py, .toml, requirements.txt)`
    ]);
  };

  // Scan simulation timer
  useEffect(() => {
    if (!isScanning) return;

    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isScanning]);

  // Step advancement simulation
  useEffect(() => {
    if (!isScanning) return;

    if (activeStepIndex < scanProgressSteps.length) {
      const stepTimer = setTimeout(() => {
        setActiveStepIndex(idx => idx + 1);
        
        // Add log messages
        const currentTitle = scanProgressSteps[activeStepIndex]?.title || '';
        const logMap: Record<string, string> = {
          'Repository connected': `[OK] Connected to GitHub remote ref [${selectedRepo}:${selectedBranch}]`,
          'Repository tree loaded': `[OK] Tree mapped. Total paths: 184, Ignored (.gitignore): 42`,
          'Source files loaded': `[OK] 142 Python AST objects parsed without fatal syntax errors`,
          'Running Ruff': `[ANALYZER:RUFF] Analyzed 142 files in 0.38s. Identified 18 formatting/style suggestions.`,
          'Running Bandit': `[ANALYZER:BANDIT] Security AST scan complete: 3 potential taint points checked.`,
          'Running Radon': `[ANALYZER:RADON] Cyclomatic complexity & Maintainability index calculated across 34 functions.`,
          'Running Duplicate Detection': `[ANALYZER:CQT-DUP] Token hash similarity computed: 1 duplicate block detected.`,
          'Running Security Scanners': `[ANALYZER:SECRETS] Shannon entropy check passed for environment templates.`,
          'Running FastAPI Rules': `[ANALYZER:FASTAPI] Verified route decorators against Pydantic response models.`,
          'Running Custom Rules': `[ANALYZER:CUSTOM] 3 project-specific AST rules executed successfully.`,
          'Normalizing findings': `[POST-PROCESS] Normalizing findings into unified SARIF/CQT schema.`,
          'Calculating quality score': `[COMPLETE] Quality score calculated: 82 / 100. Findings: 34.`
        };

        if (logMap[currentTitle]) {
          setScanLogs(prev => [...prev, logMap[currentTitle]]);
        }
      }, 700);

      return () => clearTimeout(stepTimer);
    }
  }, [isScanning, activeStepIndex]);

  // When scan finishes completely
  const isScanFinished = isScanning && activeStepIndex >= scanProgressSteps.length;

  const handleFinishAndOpenRun = () => {
    const newRunId = `run-${Math.floor(Math.random() * 800) + 100}`;
    const newRun: Run = {
      id: newRunId,
      project_id: project.id,
      project_name: project.name,
      repository: selectedRepo,
      branch: selectedBranch,
      score: 82,
      findings_count: 34,
      status: 'completed',
      started_at: 'Just now',
      completed_at: 'Just now',
      duration_seconds: elapsedSeconds || 12,
      source_type: sourceType === 'app' ? 'GitHub App' : sourceType === 'public' ? 'Public GitHub' : 'GitHub PAT',
      rules_count: selectedRuleIds.size,
      files_analyzed: 142,
      severity_counts: {
        critical: 0,
        high: 8,
        medium: 26,
        low: 4
      }
    };
    onCompleteScan(newRun);
  };

  const customRulesSelectedCount = rules.filter(r => r.is_custom && selectedRuleIds.has(r.id)).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Scan Repository</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Select a repository, branch and rules before starting analysis.
          </p>
        </div>

        {!isScanning && (
          <button
            onClick={onCancel}
            className="cqt-btn cqt-btn-outline cqt-btn-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Stepper Navigation */}
      {!isScanning && (
        <div className="grid grid-cols-3 gap-2">
          <div 
            onClick={() => setCurrentStep(1)}
            className={`cqt-card p-3 flex items-center gap-3 cursor-pointer transition-colors ${
              currentStep === 1 ? 'border-indigo-500 bg-[#141b27]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`scan-step-dot ${currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              1
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1</div>
              <div className="text-sm font-semibold text-white">Source</div>
            </div>
          </div>

          <div 
            onClick={() => setCurrentStep(2)}
            className={`cqt-card p-3 flex items-center gap-3 cursor-pointer transition-colors ${
              currentStep === 2 ? 'border-indigo-500 bg-[#141b27]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`scan-step-dot ${currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              2
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 2</div>
              <div className="text-sm font-semibold text-white">Rules ({selectedRuleIds.size})</div>
            </div>
          </div>

          <div 
            onClick={() => setCurrentStep(3)}
            className={`cqt-card p-3 flex items-center gap-3 cursor-pointer transition-colors ${
              currentStep === 3 ? 'border-indigo-500 bg-[#141b27]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`scan-step-dot ${currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              3
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 3</div>
              <div className="text-sm font-semibold text-white">Review & Scan</div>
            </div>
          </div>
        </div>
      )}

      {/* SCAN PROGRESS SCREEN (Dedicated Interface) */}
      {isScanning ? (
        <div className="cqt-card p-6 border-indigo-500/50 bg-[#0d121a] space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {isScanFinished ? 'ANALYSIS COMPLETED' : 'ANALYZING REPOSITORY'}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {selectedRepo} ({selectedBranch})
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {isScanFinished ? 'Analysis Complete' : 'Executing Quality Engine'}
              </h2>
            </div>

            {/* Metrics Counter */}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Elapsed: <strong className="text-white">{elapsedSeconds}s</strong></span>
              </div>
              <div>
                <span>Files: <strong className="text-white">142</strong></span>
              </div>
              <div>
                <span>Rules: <strong className="text-white">{selectedRuleIds.size}</strong></span>
              </div>
            </div>
          </div>

          {/* Progress Steps List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scanProgressSteps.map((step, idx) => {
              const isPast = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div 
                  key={step.id} 
                  className={`p-2.5 rounded-md border flex items-center gap-3 transition-all ${
                    isPast 
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                      : isCurrent
                      ? 'bg-indigo-950/30 border-indigo-500 text-white font-medium shadow-sm'
                      : 'bg-[#10151f] border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                        ○
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono">{step.title}</span>
                </div>
              );
            })}
          </div>

          {/* Real-time Terminal Log Console */}
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#090c12]">
            <div className="px-3 py-1.5 bg-[#0e131d] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Execution Logs (http://127.0.0.1:8000)</span>
              </div>
              <span className="text-[11px] text-slate-500">Live Sarif Stream</span>
            </div>
            <div className="p-3 font-mono text-xs text-slate-300 space-y-1 max-h-48 overflow-y-auto leading-relaxed">
              {scanLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span className={log.includes('[OK]') ? 'text-emerald-400' : log.includes('[ANALYZER') ? 'text-indigo-300' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
              {!isScanFinished && (
                <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                  <span>&gt;</span>
                  <span>Working...</span>
                </div>
              )}
            </div>
          </div>

          {/* Completion Action */}
          {isScanFinished && (
            <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> All Analyzers Completed Successfully
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Generated 34 findings across 142 files. Quality Score: 82 / 100.
                </p>
              </div>
              <button
                onClick={handleFinishAndOpenRun}
                className="cqt-btn cqt-btn-primary"
              >
                <span>View Run Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* STEP 1: SOURCE */}
      {!isScanning && currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Public Repository Card */}
            <div 
              onClick={() => setSourceType('public')}
              className={`cqt-card p-4 cursor-pointer transition-all ${
                sourceType === 'public' ? 'border-indigo-500 bg-[#131b27]' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                {sourceType === 'public' && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
              </div>
              <h3 className="text-sm font-semibold text-white">Public Repository</h3>
              <p className="text-xs text-slate-400 mt-1">
                Analyze any publicly accessible GitHub repository without credentials.
              </p>
            </div>

            {/* GitHub App Card */}
            <div 
              onClick={() => setSourceType('app')}
              className={`cqt-card p-4 cursor-pointer transition-all ${
                sourceType === 'app' ? 'border-indigo-500 bg-[#131b27]' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Github className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  CONNECTED
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">GitHub App</h3>
              <p className="text-xs text-slate-400 mt-1">
                Scan private and public repositories accessible through your installed CQT App.
              </p>
            </div>

            {/* PAT Card */}
            <div 
              onClick={() => setSourceType('pat')}
              className={`cqt-card p-4 cursor-pointer transition-all ${
                sourceType === 'pat' ? 'border-indigo-500 bg-[#131b27]' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Key className="w-5 h-5 text-indigo-400" />
                {sourceType === 'pat' && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
              </div>
              <h3 className="text-sm font-semibold text-white">Personal Access Token</h3>
              <p className="text-xs text-slate-400 mt-1">
                Scan repositories using the configured GitHub PAT (safely hidden server-side).
              </p>
            </div>
          </div>

          {/* Details per source */}
          <div className="cqt-card p-5 space-y-4">
            {sourceType === 'app' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded bg-[#0f141d] border border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-semibold">GitHub App Connected</span>
                  </div>
                  <span className="text-slate-400">
                    Installation: <strong className="text-indigo-400">{githubInstallation.account_name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Select Repository (GET /api/github/app/repositories)
                    </label>
                    <select
                      value={selectedRepo}
                      onChange={(e) => setSelectedRepo(e.target.value)}
                      className="cqt-select"
                    >
                      {githubRepos.map((r) => (
                        <option key={r.full_name} value={r.full_name}>
                          {r.full_name} {r.private ? '(Private)' : '(Public)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Select Branch (GET /api/github/app/branches)
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="cqt-select"
                    >
                      <option value="dev">dev (default)</option>
                      <option value="main">main</option>
                      <option value="master">master</option>
                      <option value="feature/fastapi-v2">feature/fastapi-v2</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Private Repository
                  </span>
                  <span>Token authenticated via GitHub App installation #{githubInstallation.id}</span>
                </div>
              </div>
            )}

            {sourceType === 'public' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    value={publicUrl}
                    onChange={(e) => setPublicUrl(e.target.value)}
                    placeholder="https://github.com/Dineshindiexpert/example"
                    className="cqt-input font-mono text-xs"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  CQT will download the public tree without authentication credentials.
                </p>
              </div>
            )}

            {sourceType === 'pat' && (
              <div className="space-y-4">
                <div className="p-3 rounded bg-[#0f141d] border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>The backend uses the configured GitHub PAT. The raw token is never exposed to the browser.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Owner</label>
                    <input
                      type="text"
                      value={patOwner}
                      onChange={(e) => setPatOwner(e.target.value)}
                      className="cqt-input text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Repository</label>
                    <input
                      type="text"
                      value={patRepo}
                      onChange={(e) => setPatRepo(e.target.value)}
                      className="cqt-input text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Branch</label>
                    <input
                      type="text"
                      value={patBranch}
                      onChange={(e) => setPatBranch(e.target.value)}
                      className="cqt-input text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="cqt-btn cqt-btn-primary"
            >
              <span>Next: Select Rules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RULE SELECTION */}
      {!isScanning && currentStep === 2 && (
        <div className="space-y-4">
          <div className="cqt-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">Rules to Run</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose which rules will be executed for this scan. Changes apply only to this scan.
                </p>
              </div>

              {/* Dynamic counter */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-semibold">
                  Rules selected: {selectedRuleIds.size} / {rules.length}
                </span>
                <button
                  onClick={handleSelectAll}
                  className="cqt-btn cqt-btn-outline cqt-btn-sm"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAll}
                  className="cqt-btn cqt-btn-outline cqt-btn-sm"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ruleSearch}
                  onChange={(e) => setRuleSearch(e.target.value)}
                  placeholder="Search rules by ID (e.g. E501, B101, RADON-CC) or name..."
                  className="cqt-input pl-9 text-xs"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors font-medium ${
                      categoryFilter === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#10151f] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rule Rows List */}
            <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredRules.map((rule) => {
                const isSelected = selectedRuleIds.has(rule.id);

                return (
                  <div
                    key={rule.id}
                    onClick={() => handleToggleRule(rule.id)}
                    className={`p-3 rounded-md border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[#131b26] border-slate-700/80' 
                        : 'bg-[#0e1219] border-slate-800/60 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by parent div
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                      />

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">
                            {rule.rule_id}
                          </span>
                          <span className="text-xs font-medium text-slate-300">
                            {rule.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {rule.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rule.is_custom && (
                        <span className="cqt-badge cqt-badge-custom text-[10px]">
                          Custom
                        </span>
                      )}
                      <span className="cqt-badge cqt-badge-neutral text-[10px]">
                        {rule.category}
                      </span>
                      <span className={`cqt-badge text-[10px] uppercase font-semibold ${
                        rule.severity === 'critical' ? 'cqt-badge-critical' :
                        rule.severity === 'high' ? 'cqt-badge-high' :
                        rule.severity === 'medium' ? 'cqt-badge-medium' :
                        'cqt-badge-low'
                      }`}>
                        {rule.severity}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                        {rule.source}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="cqt-btn cqt-btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Source</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="cqt-btn cqt-btn-primary"
            >
              <span>Next: Review & Scan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & SCAN */}
      {!isScanning && currentStep === 3 && (
        <div className="space-y-5">
          <div className="cqt-card p-6 space-y-6">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">Review Scan Configuration</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify repository source and analyzer selections before triggering analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Source</span>
                <div className="text-sm font-semibold text-white mt-1 capitalize">
                  {sourceType === 'app' ? 'GitHub App' : sourceType === 'public' ? 'Public Repository' : 'Personal Access Token'}
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Repository</span>
                <div className="text-sm font-mono font-semibold text-indigo-400 mt-1 truncate">
                  {sourceType === 'public' ? publicUrl : selectedRepo}
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Branch</span>
                <div className="text-sm font-mono font-semibold text-white mt-1">
                  {selectedBranch}
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Rules Selected</span>
                <div className="text-sm font-mono font-semibold text-emerald-400 mt-1">
                  {selectedRuleIds.size} rules active
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Custom Rules</span>
                <div className="text-sm font-mono font-semibold text-purple-400 mt-1">
                  {customRulesSelectedCount} selected
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Target Backend</span>
                <div className="text-sm font-mono text-slate-300 mt-1">
                  http://127.0.0.1:8000
                </div>
              </div>
            </div>

            {/* Expected Analyzers Checklist */}
            <div className="p-4 rounded-lg bg-[#0e131d] border border-slate-800 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Expected Analyzers to Execute
              </span>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {['Ruff', 'Bandit', 'Radon', 'Duplicate Detection', 'Secrets', 'Dependencies', 'pip-audit', 'FastAPI Rules', 'Custom Rules'].map((an) => (
                  <span key={an} className="px-2.5 py-1 rounded bg-[#131b26] border border-slate-700 text-slate-200 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {an}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="cqt-btn cqt-btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleStartAnalysis}
              className="cqt-btn cqt-btn-primary px-6"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Analysis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
