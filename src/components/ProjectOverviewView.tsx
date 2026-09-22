import React from 'react';
import { 
  GitBranch, 
  Settings, 
  Play, 
  UploadCloud, 
  ExternalLink, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  FileCode, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { Project, Run } from '../types';
import { MOCK_PROJECT_ANALYTICS } from '../mockData';

interface ProjectOverviewViewProps {
  project: Project;
  runs: Run[];
  onScanProject: (projectId: string) => void;
  onOpenSettings: (projectId: string) => void;
  onUploadZip: (projectId: string) => void;
  onViewRun: (runId: string) => void;
}

export const ProjectOverviewView: React.FC<ProjectOverviewViewProps> = ({
  project,
  runs,
  onScanProject,
  onOpenSettings,
  onUploadZip,
  onViewRun
}) => {
  const projectRuns = runs.filter(r => r.project_id === project.id);
  const latestRun = projectRuns[0] || runs[0];
  const analytics = MOCK_PROJECT_ANALYTICS[project.id] || [
    { run_id: 'run-82', score: 62, date: 'Sep 15', findings: 74 },
    { run_id: 'run-83', score: 68, date: 'Sep 17', findings: 61 },
    { run_id: 'run-84', score: 71, date: 'Sep 19', findings: 53 },
    { run_id: 'run-85', score: 78, date: 'Sep 21', findings: 42 },
    { run_id: 'run-86', score: 82, date: 'Today', findings: 34 }
  ];

  // Radial progress calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (project.latest_score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="cqt-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121824]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
            <span className="cqt-badge cqt-badge-completed">{project.status}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              {project.repository}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <GitBranch className="w-3.5 h-3.5 text-slate-500" />
              branch: <strong className="text-slate-200">{project.default_branch}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>Last Scan: {project.last_scan}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUploadZip(project.id)}
            className="cqt-btn cqt-btn-outline cqt-btn-sm"
            title="Upload source archive"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload ZIP</span>
          </button>
          <button
            onClick={() => onOpenSettings(project.id)}
            className="cqt-btn cqt-btn-secondary cqt-btn-sm"
            title="Project Settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={() => onScanProject(project.id)}
            className="cqt-btn cqt-btn-primary"
            title="Scan Repository"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Scan Repository</span>
          </button>
        </div>
      </div>

      {/* Top Score Section & Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quality Score Radial Card */}
        <div className="lg:col-span-5 cqt-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              QUALITY SCORE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold">
              STATUS: GOOD
            </span>
          </div>

          <div className="my-4 flex items-center justify-around gap-4">
            {/* Radial SVG Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="#22c55e"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold font-mono text-white leading-none">
                  {project.latest_score}
                </span>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5">/ 100</span>
              </div>
            </div>

            {/* Severity Pill Counts */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between gap-4 px-3 py-1.5 rounded bg-[#101621] border border-slate-800">
                <span className="text-red-400 font-medium">Critical</span>
                <strong className="text-white text-sm">{project.severity_counts.critical}</strong>
              </div>
              <div className="flex items-center justify-between gap-4 px-3 py-1.5 rounded bg-[#101621] border border-slate-800">
                <span className="text-orange-400 font-medium">High</span>
                <strong className="text-white text-sm">{project.severity_counts.high}</strong>
              </div>
              <div className="flex items-center justify-between gap-4 px-3 py-1.5 rounded bg-[#101621] border border-slate-800">
                <span className="text-amber-400 font-medium">Medium</span>
                <strong className="text-white text-sm">{project.severity_counts.medium}</strong>
              </div>
              <div className="flex items-center justify-between gap-4 px-3 py-1.5 rounded bg-[#101621] border border-slate-800">
                <span className="text-blue-400 font-medium">Low</span>
                <strong className="text-white text-sm">{project.severity_counts.low}</strong>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
            <span>Pass threshold: 80 / 100</span>
            <span className="text-emerald-400">Quality Gate Passed</span>
          </div>
        </div>

        {/* Latest Analysis Card */}
        <div className="lg:col-span-7 cqt-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Latest Analysis Summary
            </span>
            <button
              onClick={() => onViewRun(latestRun.id)}
              className="cqt-btn cqt-btn-primary cqt-btn-sm"
            >
              <span>View Run #{latestRun.id}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Run ID</span>
              <div className="text-base font-bold font-mono text-indigo-400 mt-1">
                #{latestRun.id}
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Status</span>
              <div className="text-base font-bold text-emerald-400 capitalize mt-1">
                {latestRun.status}
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Score</span>
              <div className="text-base font-bold font-mono text-white mt-1">
                {latestRun.score} / 100
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Total Findings</span>
              <div className="text-base font-bold font-mono text-amber-400 mt-1">
                {latestRun.findings_count}
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Started</span>
              <div className="text-xs font-medium text-slate-200 mt-1">
                {latestRun.started_at}
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Completed</span>
              <div className="text-xs font-medium text-slate-200 mt-1">
                {latestRun.completed_at}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Analyzers: Ruff, Bandit, Radon, FastAPI, CQT, Secrets</span>
            <span>Duration: {latestRun.duration_seconds}s</span>
          </div>
        </div>
      </div>

      {/* Quality Trend Line Chart */}
      <div className="cqt-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Quality Trend</h2>
            <p className="text-xs text-slate-400 mt-0.5">Historical quality progression from backend analytics.</p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            GET /api/projects/{project.id}/analytics
          </span>
        </div>

        <div className="mt-5 h-48 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
            {/* Grid */}
            {[50, 75, 100].map((v) => {
              const y = 150 - (v / 100) * 130 - 10;
              return (
                <g key={v}>
                  <line x1="30" y1={y} x2="490" y2={y} stroke="#1f293d" strokeDasharray="3 3" />
                  <text x="5" y={y + 3} fill="#64748b" fontSize="9" fontFamily="monospace">
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Plot line */}
            {(() => {
              const points = analytics.map((a, i) => {
                const x = 50 + i * 100;
                const y = 150 - (a.score / 100) * 130 - 10;
                return { ...a, x, y };
              });
              const lineD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
              return (
                <>
                  <path d={lineD} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#22c55e" stroke="#0B0F14" strokeWidth="2" />
                      <text x={p.x} y={p.y - 8} fill="#ffffff" fontSize="10" textAnchor="middle" fontFamily="monospace">
                        {p.score}
                      </text>
                      <text x={p.x} y="148" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        {p.date}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Recent Runs Table */}
      <div className="cqt-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#121822]">
          <h2 className="text-base font-semibold text-white">Recent Runs</h2>
          <span className="text-xs text-slate-400 font-mono">{projectRuns.length} runs recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="cqt-table">
            <thead>
              <tr>
                <th>Run</th>
                <th>Branch</th>
                <th>Score</th>
                <th>Findings</th>
                <th>Status</th>
                <th>Started</th>
                <th>Completed</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {projectRuns.map((r) => (
                <tr key={r.id} className="cqt-table-row">
                  <td>
                    <span 
                      onClick={() => onViewRun(r.id)}
                      className="font-mono text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      #{r.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-300 flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-slate-500" />
                      {r.branch}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      r.score >= 80 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                      r.score >= 70 ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                      'bg-red-950/80 text-red-400 border border-red-800'
                    }`}>
                      {r.score}/100
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-300">{r.findings_count}</span>
                  </td>
                  <td>
                    <span className="cqt-badge cqt-badge-completed capitalize">
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400">{r.started_at}</span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400">{r.completed_at}</span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => onViewRun(r.id)}
                      className="cqt-btn cqt-btn-outline cqt-btn-sm"
                    >
                      View Run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
