import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FolderGit2, 
  PlayCircle, 
  ShieldCheck, 
  Bug, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Project, Run, Rule, Finding } from '../types';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  runs: Run[];
  rules: Rule[];
  findings: Finding[];
  onSelectProject: (projectId: string) => void;
  onSelectRun: (runId: string) => void;
  onSelectRule: (ruleId: string) => void;
  onSelectFinding: (finding: Finding) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  runs,
  rules,
  findings,
  onSelectProject,
  onSelectRun,
  onSelectRule,
  onSelectFinding
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.repository.toLowerCase().includes(q)
  ).slice(0, 3);

  const filteredRuns = runs.filter(r => 
    r.id.toLowerCase().includes(q) || 
    r.project_name.toLowerCase().includes(q) ||
    r.branch.toLowerCase().includes(q)
  ).slice(0, 3);

  const filteredRules = rules.filter(ru => 
    ru.rule_id.toLowerCase().includes(q) || 
    ru.name.toLowerCase().includes(q) ||
    ru.category.toLowerCase().includes(q)
  ).slice(0, 4);

  const filteredFindings = findings.filter(f => 
    f.id.toLowerCase().includes(q) || 
    f.rule_id.toLowerCase().includes(q) ||
    f.file.toLowerCase().includes(q) ||
    f.message.toLowerCase().includes(q)
  ).slice(0, 4);

  const hasResults = 
    filteredProjects.length > 0 || 
    filteredRuns.length > 0 || 
    filteredRules.length > 0 || 
    filteredFindings.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-lg border shadow-2xl overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: '#121722', 
          borderColor: 'var(--cqt-border)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: 'var(--cqt-border)' }}>
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search projects, rules (E501, B101), runs, finding IDs..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/60">
          {!hasResults && query ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching records found for "{query}". Try searching by rule ID (e.g. <span className="font-mono text-indigo-400">B904</span>, <span className="font-mono text-indigo-400">E501</span>) or repository name.
            </div>
          ) : null}

          {/* Projects Category */}
          {filteredProjects.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" /> Projects
              </div>
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p.id);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-sm text-slate-200 group-hover:text-indigo-400">
                      {p.name}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {p.repository}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-mono">
                      {p.latest_score}/100
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rules Category */}
          {filteredRules.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Rules Catalog
              </div>
              {filteredRules.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectRule(r.rule_id);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {r.rule_id}
                    </span>
                    <span className="text-sm text-slate-200 group-hover:text-white">
                      {r.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({r.source})
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono capitalize">
                    {r.category}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Findings Category */}
          {filteredFindings.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5" /> Findings
              </div>
              {filteredFindings.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelectFinding(f);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      f.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                      f.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      f.severity === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {f.severity}
                    </span>
                    <span className="font-mono text-xs text-slate-300">
                      {f.rule_id}:
                    </span>
                    <span className="text-xs text-slate-300 truncate">
                      {f.message}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 shrink-0 ml-2">
                    {f.file}:{f.line}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Runs Category */}
          {filteredRuns.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <PlayCircle className="w-3.5 h-3.5" /> Analysis Runs
              </div>
              {filteredRuns.map((rn) => (
                <div
                  key={rn.id}
                  onClick={() => {
                    onSelectRun(rn.id);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-indigo-400 font-semibold">
                      #{rn.id}
                    </span>
                    <span className="text-sm text-slate-200">
                      {rn.project_name} ({rn.branch})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <span>{rn.findings_count} findings</span>
                    <span className="text-emerald-400">{rn.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t flex items-center justify-between text-[11px] text-slate-500 bg-[#0e131b]" style={{ borderColor: 'var(--cqt-border)' }}>
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400">Enter</kbd></span>
          </div>
          <span>CQT Fast Indexer</span>
        </div>
      </div>
    </div>
  );
};
