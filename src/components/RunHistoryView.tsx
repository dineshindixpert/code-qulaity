import React, { useState } from 'react';
import { 
  PlayCircle, 
  Search, 
  Filter, 
  GitBranch, 
  Clock, 
  ArrowUpRight,
  FolderGit2
} from 'lucide-react';
import { Run, Project } from '../types';

interface RunHistoryViewProps {
  runs: Run[];
  projects: Project[];
  onViewRun: (runId: string) => void;
}

export const RunHistoryView: React.FC<RunHistoryViewProps> = ({
  runs,
  projects,
  onViewRun
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRuns = runs.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.project_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = projectFilter === 'ALL' || r.project_id === projectFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesProject && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Analysis Runs</h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical log of quality scans across connected GitHub repositories and source packages.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="cqt-card p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Run ID (e.g. run-86), branch, or repo..."
              className="cqt-input pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="cqt-select text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cqt-select text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="RUNNING">Running</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Runs Table */}
      <div className="cqt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cqt-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Run ID</th>
                <th>Project</th>
                <th>Repository</th>
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
              {filteredRuns.map((r) => (
                <tr key={r.id} className="cqt-table-row">
                  <td>
                    <span 
                      onClick={() => onViewRun(r.id)}
                      className="font-mono text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      #{r.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-medium text-white text-xs">
                      {r.project_name}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-300">
                      {r.repository}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
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
                    <span className="font-mono text-xs text-slate-300">
                      {r.findings_count}
                    </span>
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
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
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
