import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Play, 
  Settings, 
  ExternalLink, 
  GitBranch, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  List,
  Filter
} from 'lucide-react';
import { Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onScanProject: (projectId: string) => void;
  onOpenSettings: (projectId: string) => void;
  onCreateProjectClick: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onScanProject,
  onOpenSettings,
  onCreateProjectClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || p.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage projects and code-quality analysis sources.
          </p>
        </div>

        <button
          onClick={onCreateProjectClick}
          className="cqt-btn cqt-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 cqt-card p-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, repositories, branches..."
            className="cqt-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cqt-select text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="border-l border-slate-800 pl-2 flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="cqt-card p-12 text-center max-w-md mx-auto my-8">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            {searchQuery ? "No projects match your search query." : "Create your first project to start analyzing code quality."}
          </p>
          <button
            onClick={onCreateProjectClick}
            className="cqt-btn cqt-btn-primary cqt-btn-sm inline-flex"
          >
            <Plus className="w-3.5 h-3.5" /> Create Project
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => (
            <div 
              key={p.id}
              className="cqt-card cqt-card-hover p-5 flex flex-col justify-between transition-all"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="overflow-hidden">
                    <h3 
                      onClick={() => onSelectProject(p.id)}
                      className="text-base font-semibold text-white hover:text-indigo-400 cursor-pointer truncate"
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1 truncate">
                      <span>{p.repository}</span>
                    </div>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${
                      p.latest_score >= 80 
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' 
                        : p.latest_score >= 70
                        ? 'border-amber-500 bg-amber-950/40 text-amber-400'
                        : 'border-red-500 bg-red-950/40 text-red-400'
                    }`}>
                      {p.latest_score}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">Score</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* Metadata strip */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                    {p.default_branch}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {p.last_scan}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    {p.findings_count} findings
                  </span>
                </div>

                {/* Severity Breakdown Bar */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-red-400">{p.severity_counts.critical} crit</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-orange-400">{p.severity_counts.high} high</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400">{p.severity_counts.medium} med</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-blue-400">{p.severity_counts.low} low</span>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="cqt-badge cqt-badge-completed text-[11px]">
                  {p.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenSettings(p.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Project Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onScanProject(p.id)}
                    className="cqt-btn cqt-btn-outline cqt-btn-sm"
                    title="Start new scan"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Scan</span>
                  </button>
                  <button
                    onClick={() => onSelectProject(p.id)}
                    className="cqt-btn cqt-btn-primary cqt-btn-sm"
                  >
                    <span>Open</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredProjects.length > 0 && (
        <div className="cqt-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="cqt-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Repository</th>
                  <th>Branch</th>
                  <th>Score</th>
                  <th>Findings</th>
                  <th>Last Scan</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="cqt-table-row">
                    <td>
                      <div 
                        onClick={() => onSelectProject(p.id)}
                        className="font-medium text-white hover:text-indigo-400 cursor-pointer"
                      >
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">{p.description}</div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-300">{p.repository}</span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-slate-500" />
                        {p.default_branch}
                      </span>
                    </td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                        p.latest_score >= 80 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                        p.latest_score >= 70 ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                        'bg-red-950/80 text-red-400 border border-red-800'
                      }`}>
                        {p.latest_score}/100
                      </span>
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
                        >
                          Open
                        </button>
                        <button
                          onClick={() => onScanProject(p.id)}
                          className="cqt-btn cqt-btn-primary cqt-btn-sm"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Scan</span>
                        </button>
                        <button
                          onClick={() => onOpenSettings(p.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
