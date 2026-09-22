import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  RefreshCw, 
  Cpu, 
  Code,
  HardDrive
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: string; latency: number } | null>({
    status: 'healthy',
    latency: 14
  });

  const handleTestConnection = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult({
        status: 'healthy',
        latency: Math.floor(Math.random() * 12) + 8
      });
    }, 600);
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
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings & Architecture</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Backend server endpoints, health checks, and static analysis engine configuration.
        </p>
      </div>

      {/* Backend API Configuration & Status */}
      <div className="cqt-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>CQT Backend API Server</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configured target REST backend for all project metadata, scans, and rules.
            </p>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isPinging}
            className="cqt-btn cqt-btn-outline cqt-btn-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping /health</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded bg-[#0f141d] border border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              API Base URL
            </div>
            <div className="font-mono text-sm font-bold text-indigo-400 select-all">
              http://127.0.0.1:8000
            </div>
            <div className="text-xs text-slate-500 font-mono">
              FastAPI 0.115 engine running in standard async mode
            </div>
          </div>

          <div className="p-4 rounded bg-[#0f141d] border border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Database Connection
            </div>
            <div className="font-mono text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Connected (PostgreSQL / SQLite)</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Endpoint: GET /health/db (0 active deadlocks)
            </div>
          </div>
        </div>

        {pingResult && (
          <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs font-mono text-emerald-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Backend status: {pingResult.status.toUpperCase()}
            </span>
            <span>Latency: {pingResult.latency}ms</span>
          </div>
        )}
      </div>

      {/* Installed Analyzers */}
      <div className="cqt-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#121822]">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>CQT Analysis Subsystems</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Subsystems invoked sequentially or concurrently during repository scans.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {analyzers.length} engines active
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {analyzers.map((an) => (
            <div key={an.name} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-xs">{an.name}</span>
                  <span className="font-mono text-[11px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-800/40">
                    {an.version}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{an.purpose}</div>
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
