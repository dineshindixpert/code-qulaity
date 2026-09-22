import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  CheckCircle2, 
  XCircle,
  RefreshCw, 
  Cpu, 
  Save,
  AlertTriangle,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { cqtApi, getApiBaseUrl, setApiBaseUrl } from '../api/client';

export const SettingsView: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [savedUrl, setSavedUrl] = useState(getApiBaseUrl());
  const [isPinging, setIsPinging] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    tested: boolean;
    ok: boolean;
    latency: number;
    serviceName?: string;
    version?: string;
    dbOk?: boolean;
    dbStatus?: string;
    error?: string;
  }>({
    tested: false,
    ok: false,
    latency: 0
  });

  const checkConnection = async (targetUrl?: string) => {
    setIsPinging(true);
    const urlToTest = targetUrl || apiUrl;
    try {
      const [apiRes, dbRes] = await Promise.all([
        cqtApi.getHealth(urlToTest),
        cqtApi.getDbHealth(urlToTest)
      ]);

      setHealthStatus({
        tested: true,
        ok: apiRes.ok,
        latency: apiRes.latency,
        serviceName: apiRes.data?.service || 'cqt-engine',
        version: apiRes.data?.version || '0.1.0',
        dbOk: dbRes.ok,
        dbStatus: dbRes.status,
        error: apiRes.ok ? undefined : (apiRes.error || 'Server not responding on port 8000')
      });
    } catch (err: any) {
      setHealthStatus({
        tested: true,
        ok: false,
        latency: 0,
        error: err?.message || 'Connection failed'
      });
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    checkConnection(savedUrl);
  }, []);

  const handleSaveAndTest = () => {
    setApiBaseUrl(apiUrl);
    setSavedUrl(apiUrl);
    checkConnection(apiUrl);
  };

  const handleResetDefault = () => {
    const defaultUrl = 'http://127.0.0.1:8000';
    setApiUrl(defaultUrl);
    setApiBaseUrl(defaultUrl);
    setSavedUrl(defaultUrl);
    checkConnection(defaultUrl);
  };

  const analyzers = [
    { name: 'Ruff', version: 'v0.3.4', purpose: 'Lightning-fast Python linter & style checker', status: 'Operational' },
    { name: 'Bandit', version: 'v1.7.8', purpose: 'Security AST vulnerability scanner', status: 'Operational' },
    { name: 'Radon', version: 'v6.0.1', purpose: 'Cyclomatic complexity & maintainability index', status: 'Operational' },
    { name: 'CQT Duplicate Engine', version: 'v2.1', purpose: 'Token-hash duplicate code matrix analyzer', status: 'Operational' },
    { name: 'pip-audit', version: 'v2.7.2', purpose: 'PyPI vulnerability advisory dependency scanner', status: 'Operational' },
    { name: 'Secrets Scanner', version: 'v1.4', purpose: 'Shannon entropy & regex token scanner', status: 'Operational' },
    { name: 'FastAPI Rules Engine', version: 'v1.0', purpose: 'Route decorators & Pydantic response models', status: 'Operational' },
    { name: 'Custom AST Evaluator', version: 'v2.0', purpose: 'Project-specific dynamic AST visitor rules', status: 'Operational' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b" style={{ borderColor: 'var(--cqt-border)' }}>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings & Architecture</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Backend server configuration, health checks, and active static analysis engines.
        </p>
      </div>

      {/* Backend API Configuration & Status */}
      <div className="cqt-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3" style={{ borderColor: 'var(--cqt-border)' }}>
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>CQT Backend API Server Configuration</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live FastAPI backend endpoint running on port 8000 for repository scans, project persistence, and custom rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => checkConnection()}
              disabled={isPinging}
              className="cqt-btn cqt-btn-outline cqt-btn-sm"
              title="Ping /health and /health/db"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Ping /health</span>
            </button>
          </div>
        </div>

        {/* URL Configuration Form */}
        <div className="p-4 rounded border space-y-3" style={{ backgroundColor: 'var(--cqt-card-hover)', borderColor: 'var(--cqt-border)' }}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Backend API Endpoint URL
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000"
              className="cqt-input font-mono text-sm flex-1"
            />
            <button
              onClick={handleSaveAndTest}
              disabled={isPinging}
              className="cqt-btn cqt-btn-primary cqt-btn-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Connect</span>
            </button>
            <button
              onClick={handleResetDefault}
              className="cqt-btn cqt-btn-secondary cqt-btn-sm text-xs"
              title="Reset to http://127.0.0.1:8000"
            >
              Reset to 8000
            </button>
          </div>
          <p className="text-xs text-slate-500">
            When running locally, your backend starts at <code className="cqt-code">http://127.0.0.1:8000</code>. Vite automatically proxies requests via <code className="cqt-code">/api</code>, avoiding browser CORS blocks.
          </p>
        </div>

        {/* Live Diagnostics Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded border space-y-2" style={{ backgroundColor: 'var(--cqt-card-hover)', borderColor: 'var(--cqt-border)' }}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              API Server Status
            </div>
            {healthStatus.tested ? (
              healthStatus.ok ? (
                <div className="font-mono text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Online ({healthStatus.latency}ms latency)</span>
                </div>
              ) : (
                <div className="font-mono text-sm font-bold text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Offline / Waiting for port 8000</span>
                </div>
              )
            ) : (
              <div className="font-mono text-sm text-slate-400">Testing connection...</div>
            )}
            <div className="text-xs text-slate-500 font-mono">
              Target: {savedUrl}/health
            </div>
          </div>

          <div className="p-4 rounded border space-y-2" style={{ backgroundColor: 'var(--cqt-card-hover)', borderColor: 'var(--cqt-border)' }}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Database Connection
            </div>
            {healthStatus.tested ? (
              healthStatus.dbOk ? (
                <div className="font-mono text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Connected ({healthStatus.dbStatus || 'OK'})</span>
                </div>
              ) : (
                <div className="font-mono text-sm font-bold text-slate-500 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Pending local server startup</span>
                </div>
              )
            ) : (
              <div className="font-mono text-sm text-slate-400">Checking DB status...</div>
            )}
            <div className="text-xs text-slate-500 font-mono">
              Endpoint: {savedUrl}/health/db
            </div>
          </div>
        </div>

        {/* Start Server Helper if offline */}
        {healthStatus.tested && !healthStatus.ok && (
          <div className="p-4 rounded border border-amber-200 bg-amber-50/60 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-800">
              <Terminal className="w-4 h-4" />
              <span>How to start your local CQT API on port 8000:</span>
            </div>
            <p className="text-slate-700">
              Open your backend terminal window and run:
            </p>
            <pre className="p-2.5 rounded bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto select-all">
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
            </pre>
            <p className="text-slate-600">
              Once running, click <strong className="font-semibold text-slate-900">Ping /health</strong> above to confirm active communication.
            </p>
          </div>
        )}
      </div>

      {/* Installed Analyzers */}
      <div className="cqt-card overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: 'var(--cqt-card-hover)', borderColor: 'var(--cqt-border)' }}>
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>CQT Analysis Subsystems</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Subsystems invoked sequentially or concurrently by the backend on port 8000.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500">
            {analyzers.length} engines active
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--cqt-border)' }}>
          {analyzers.map((an) => (
            <div key={an.name} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-xs">{an.name}</span>
                  <span className="font-mono text-[11px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                    {an.version}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{an.purpose}</div>
              </div>

              <span className="cqt-badge cqt-badge-completed text-[11px] font-mono">
                {an.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
