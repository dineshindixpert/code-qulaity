import React, { useState } from 'react';
import { 
  FolderGit2, 
  PlayCircle, 
  Award, 
  AlertCircle, 
  RefreshCw, 
  ArrowUpRight, 
  ShieldAlert, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Play
} from 'lucide-react';
import { Project, Run } from '../types';

interface DashboardViewProps {
  projects: Project[];
  runs: Run[];
  onSelectProject: (projectId: string) => void;
  onScanProject: (projectId: string) => void;
  onViewRun: (runId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  runs,
  onSelectProject,
  onScanProject,
  onViewRun
}) => {
  const [filterRange, setFilterRange] = useState('Last 30 days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Severity metrics aggregate
  const totalFindings = projects.reduce((acc, p) => acc + p.findings_count, 0) + 1150; // realistic total findings: ~1248
  const criticalCount = projects.reduce((acc, p) => acc + p.severity_counts.critical, 0);
  const highCount = projects.reduce((acc, p) => acc + p.severity_counts.high, 0);
  const mediumCount = projects.reduce((acc, p) => acc + p.severity_counts.medium, 0);
  const lowCount = projects.reduce((acc, p) => acc + p.severity_counts.low, 0);

  // Pagination for projects table
  const totalPages = Math.ceil(projects.length / pageSize) || 1;
  const paginatedProjects = projects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Data for Quality Overview Chart: Run 1 -> 62, Run 2 -> 68, Run 3 -> 71, Run 4 -> 78, Run 5 -> 82
  const scoreTrendData = [
    { label: 'Run 1', score: 62, date: 'Sep 10' },
    { label: 'Run 2', score: 68, date: 'Sep 13' },
    { label: 'Run 3', score: 71, date: 'Sep 16' },
    { label: 'Run 4', score: 78, date: 'Sep 19' },
    { label: 'Run 5', score: 82, date: 'Today' }
  ];

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Overview of code quality across your projects.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <select 
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value)}
            className="cqt-select text-xs py-1.5 px-3 w-auto"
          >
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 90 days">Last 90 days</option>
            <option value="All time">All time</option>
          </select>

          <button
            onClick={handleRefresh}
            className="cqt-btn cqt-btn-outline cqt-btn-sm"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="cqt-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">12</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <span className="text-emerald-400">+2</span> connected this month
            </div>
          </div>
        </div>

        {/* Total Runs */}
        <div className="cqt-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Runs</span>
            <PlayCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">86</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Across all branches
            </div>
          </div>
        </div>

        {/* Latest Quality Score */}
        <div className="cqt-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Latest Quality Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">82</span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800">
                GOOD
              </span>
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> +14 pts from baseline
            </div>
          </div>
        </div>

        {/* Total Findings */}
        <div className="cqt-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Findings</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">1,248</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              0 Critical, 32 High active
            </div>
          </div>
        </div>
      </div>

      {/* Quality Overview Line Chart */}
      <div className="cqt-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
          <div>
            <h2 className="text-base font-semibold text-white">Quality Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">Quality score progression across recent repository scans.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Quality Score (0-100)
            </span>
            <span className="text-slate-500">Target: ≥ 80</span>
          </div>
        </div>

        {/* Interactive SVG Line Chart */}
        <div className="mt-6 relative h-64 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Grid lines */}
            {[20, 40, 60, 80, 100].map((val) => {
              const y = 200 - (val / 100) * 180 - 10;
              return (
                <g key={val}>
                  <line 
                    x1="40" 
                    y1={y} 
                    x2="590" 
                    y2={y} 
                    stroke="#1e293b" 
                    strokeDasharray={val === 80 ? "4 4" : undefined}
                    strokeWidth={val === 80 ? "1.5" : "1"}
                  />
                  <text x="10" y={y + 4} fill="#64748b" fontSize="10" fontFamily="monospace">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Target 80 line label */}
            <text x="545" y={200 - (80 / 100) * 180 - 14} fill="#22c55e" fontSize="9" fontFamily="monospace">
              Pass Gate (80)
            </text>

            {/* Chart Area Gradient Path */}
            <defs>
              <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Generate points coordinates */}
            {(() => {
              const points = scoreTrendData.map((d, index) => {
                const x = 70 + index * 125;
                const y = 200 - (d.score / 100) * 180 - 10;
                return { x, y, ...d };
              });

              const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
              const areaD = `${pathD} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`;

              return (
                <g>
                  <path d={areaD} fill="url(#scoreAreaGradient)" />
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#6366F1" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  {points.map((p, idx) => (
                    <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(idx)}>
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={hoveredPoint === idx ? 7 : 5} 
                        fill={hoveredPoint === idx ? "#818cf8" : "#6366F1"} 
                        stroke="#0B0F14" 
                        strokeWidth="2" 
                      />
                      <text 
                        x={p.x} 
                        y={p.y - 12} 
                        textAnchor="middle" 
                        fill={hoveredPoint === idx ? "#ffffff" : "#cbd5e1"} 
                        fontSize="11" 
                        fontWeight={hoveredPoint === idx ? "bold" : "normal"}
                        fontFamily="monospace"
                      >
                        {p.score}
                      </text>
                      <text 
                        x={p.x} 
                        y="198" 
                        textAnchor="middle" 
                        fill="#94a3b8" 
                        fontSize="10" 
                        fontFamily="monospace"
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Selected Data Point Inspector */}
        {hoveredPoint !== null && (
          <div className="mt-4 p-3 rounded bg-[#0d1219] border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-indigo-400 font-bold">{scoreTrendData[hoveredPoint].label}</span>
              <span className="text-slate-400">Score: <strong className="text-white text-sm">{scoreTrendData[hoveredPoint].score}/100</strong></span>
              <span className="text-slate-500">Date: {scoreTrendData[hoveredPoint].date}</span>
            </div>
            <button 
              onClick={() => onViewRun('run-86')}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Inspect Run <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Findings Overview */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Findings Overview</h2>
          <span className="text-xs text-slate-400 font-mono">Current active debt</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Critical */}
          <div className="cqt-card p-3.5 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Critical</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">{criticalCount}</span>
              <span className="text-[11px] text-slate-500 font-mono">0 CVEs</span>
            </div>
          </div>

          {/* High */}
          <div className="cqt-card p-3.5 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">High</span>
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">{highCount}</span>
              <span className="text-[11px] text-orange-400/90 font-mono">Needs triage</span>
            </div>
          </div>

          {/* Medium */}
          <div className="cqt-card p-3.5 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Medium</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">{mediumCount}</span>
              <span className="text-[11px] text-slate-500 font-mono">Refactorable</span>
            </div>
          </div>

          {/* Low */}
          <div className="cqt-card p-3.5 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Low</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">{lowCount}</span>
              <span className="text-[11px] text-slate-500 font-mono">Style / Minor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="cqt-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#121822]">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Projects</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest quality results and repositories monitored by CQT.</p>
          </div>
          <button 
            onClick={() => onSelectProject('projects')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            View all projects ({projects.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="cqt-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Repository</th>
                <th>Latest Score</th>
                <th>Findings</th>
                <th>Last Scan</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map((p) => (
                <tr key={p.id} className="cqt-table-row">
                  <td>
                    <div 
                      onClick={() => onSelectProject(p.id)}
                      className="font-medium text-white hover:text-indigo-400 cursor-pointer flex items-center gap-2"
                    >
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-400">{p.repository}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        p.latest_score >= 80 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                        p.latest_score >= 70 ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                        'bg-red-950/80 text-red-400 border border-red-800'
                      }`}>
                        {p.latest_score}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-300">{p.findings_count}</span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400">{p.last_scan}</span>
                  </td>
                  <td>
                    <span className="cqt-badge cqt-badge-completed">
                      {p.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectProject(p.id)}
                        className="cqt-btn cqt-btn-outline cqt-btn-sm"
                        title="View project dashboard"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onScanProject(p.id)}
                        className="cqt-btn cqt-btn-primary cqt-btn-sm"
                        title="Run new scan"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span className="hidden sm:inline">Scan</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-[#101620] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-slate-200">{(currentPage - 1) * pageSize + 1}</strong> to <strong className="text-slate-200">{Math.min(currentPage * pageSize, projects.length)}</strong> of <strong className="text-slate-200">{projects.length}</strong> projects
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="cqt-btn cqt-btn-outline cqt-btn-sm disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 font-mono text-slate-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="cqt-btn cqt-btn-outline cqt-btn-sm disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
