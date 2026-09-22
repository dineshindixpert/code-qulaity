import React, { useState } from 'react';
import { 
  GitBranch, 
  Clock, 
  Search, 
  Filter, 
  X, 
  FileCode, 
  Download, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { Run, Finding } from '../types';

interface RunDetailsViewProps {
  run: Run;
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onBackToProject?: () => void;
}

export const RunDetailsView: React.FC<RunDetailsViewProps> = ({
  run,
  findings,
  onSelectFinding,
  onBackToProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [ruleFilter, setRuleFilter] = useState('ALL');
  const [fileFilter, setFileFilter] = useState('ALL');

  // Filter options lists
  const categories = Array.from(new Set(findings.map(f => f.category)));
  const uniqueRules = Array.from(new Set(findings.map(f => f.rule_id)));
  const uniqueFiles = Array.from(new Set(findings.map(f => f.file)));

  // Filter application
  const filteredFindings = findings.filter(f => {
    const matchesSearch = 
      f.rule_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.file.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || f.severity.toUpperCase() === severityFilter;
    const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesRule = ruleFilter === 'ALL' || f.rule_id === ruleFilter;
    const matchesFile = fileFilter === 'ALL' || f.file === fileFilter;

    return matchesSearch && matchesSeverity && matchesCategory && matchesRule && matchesFile;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setCategoryFilter('ALL');
    setRuleFilter('ALL');
    setFileFilter('ALL');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    severityFilter !== 'ALL' || 
    categoryFilter !== 'ALL' || 
    ruleFilter !== 'ALL' || 
    fileFilter !== 'ALL';

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case 'critical': return 'cqt-badge-critical';
      case 'high': return 'cqt-badge-high';
      case 'medium': return 'cqt-badge-medium';
      case 'low': return 'cqt-badge-low';
      default: return 'cqt-badge-neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="cqt-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121824]">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
              RUN #{run.id}
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Run Details</h1>
            <span className="cqt-badge cqt-badge-completed capitalize">{run.status}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-2">
            <span className="text-slate-300">{run.repository}</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-slate-500" />
              branch: <strong className="text-slate-200">{run.branch}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>Started: {run.started_at}</span>
            <span className="text-slate-600">•</span>
            <span>Completed: {run.completed_at} ({run.duration_seconds}s)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToProject && (
            <button
              onClick={onBackToProject}
              className="cqt-btn cqt-btn-outline cqt-btn-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Project Overview</span>
            </button>
          )}
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(findings, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `cqt-run-${run.id}-sarif.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="cqt-btn cqt-btn-secondary cqt-btn-sm"
            title="Export JSON report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SARIF</span>
          </button>
        </div>
      </div>

      {/* Main Score Card & Severity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Quality Score */}
        <div className="md:col-span-4 cqt-card p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quality Score
          </span>
          <div className="my-3 flex items-baseline gap-3">
            <span className="text-4xl font-bold font-mono text-white">{run.score}</span>
            <span className="text-sm font-mono text-slate-400">/ 100</span>
            <span className="ml-auto cqt-badge cqt-badge-completed font-mono text-xs">
              PASSED
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Analyzed {run.files_analyzed} files</span>
            <span>18 active rules</span>
          </div>
        </div>

        {/* Severity Summary */}
        <div className="md:col-span-8 cqt-card p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Findings by Severity
          </span>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800/80 border-t-2 border-t-red-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Critical</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {run.severity_counts.critical}
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800/80 border-t-2 border-t-orange-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">High</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {run.severity_counts.high}
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800/80 border-t-2 border-t-amber-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Medium</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {run.severity_counts.medium}
              </div>
            </div>
            <div className="p-3 rounded bg-[#0f141d] border border-slate-800/80 border-t-2 border-t-blue-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">Low</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {run.severity_counts.low}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Explorer */}
      <div className="cqt-card overflow-hidden">
        {/* Explorer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#121822]">
          <div>
            <h2 className="text-base font-semibold text-white">Findings Explorer</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed violation breakdown. Click any finding to inspect code snippet and suggested fix.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Showing {filteredFindings.length} of {findings.length} findings
          </span>
        </div>

        {/* Multi-faceted Filter Toolbar */}
        <div className="p-3.5 border-b border-slate-800 bg-[#0f141d] space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search findings message, rule ID, or filename..."
                className="cqt-input pl-9 text-xs"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Severity */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="cqt-select text-xs py-1.5 px-2.5 w-auto"
              >
                <option value="ALL">Severity: All</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="cqt-select text-xs py-1.5 px-2.5 w-auto"
              >
                <option value="ALL">Category: All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Rule */}
              <select
                value={ruleFilter}
                onChange={(e) => setRuleFilter(e.target.value)}
                className="cqt-select text-xs py-1.5 px-2.5 w-auto font-mono"
              >
                <option value="ALL">Rule: All</option>
                {uniqueRules.map((ru) => (
                  <option key={ru} value={ru}>{ru}</option>
                ))}
              </select>

              {/* File */}
              <select
                value={fileFilter}
                onChange={(e) => setFileFilter(e.target.value)}
                className="cqt-select text-xs py-1.5 px-2.5 w-auto font-mono max-w-[180px]"
              >
                <option value="ALL">File: All</option>
                {uniqueFiles.map((fi) => (
                  <option key={fi} value={fi}>{fi}</option>
                ))}
              </select>

              {/* Clear filters button */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="cqt-btn cqt-btn-outline cqt-btn-sm text-xs text-slate-400 hover:text-white"
                  title="Reset all filters"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Findings Table */}
        <div className="overflow-x-auto">
          {filteredFindings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-200">No findings found</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your filters may be hiding results. Try clearing search filters above.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="cqt-btn cqt-btn-outline cqt-btn-sm mt-3 inline-flex"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <table className="cqt-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Severity</th>
                  <th style={{ width: '130px' }}>Rule</th>
                  <th>Message</th>
                  <th>Category</th>
                  <th>File</th>
                  <th style={{ width: '80px' }}>Line</th>
                  <th style={{ width: '80px' }}>Column</th>
                </tr>
              </thead>
              <tbody>
                {filteredFindings.map((f) => (
                  <tr 
                    key={f.id} 
                    onClick={() => onSelectFinding(f)}
                    className="cqt-table-row cursor-pointer"
                  >
                    <td>
                      <span className={`cqt-badge ${getSeverityBadgeClass(f.severity)} uppercase text-[10px]`}>
                        {f.severity}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-semibold text-indigo-300 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-800/40">
                        {f.rule_id}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs text-slate-200 font-mono hover:text-indigo-400 transition-colors">
                        {f.message}
                      </div>
                    </td>
                    <td>
                      <span className="cqt-badge cqt-badge-neutral text-[11px]">
                        {f.category}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-300">
                        {f.file}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-400">
                        {f.line}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-400">
                        {f.column}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
