import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  FileCode, 
  Terminal, 
  ShieldAlert, 
  Info,
  Code
} from 'lucide-react';
import { Finding } from '../types';

interface FindingDrawerProps {
  finding: Finding | null;
  onClose: () => void;
}

export const FindingDrawer: React.FC<FindingDrawerProps> = ({ finding, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!finding) return null;

  const handleCopyCode = () => {
    if (finding.snippet) {
      navigator.clipboard.writeText(finding.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case 'critical': return 'cqt-badge-critical';
      case 'high': return 'cqt-badge-high';
      case 'medium': return 'cqt-badge-medium';
      case 'low': return 'cqt-badge-low';
      default: return 'cqt-badge-neutral';
    }
  };

  // Parse snippet lines to handle highlighting
  const snippetLines = finding.snippet 
    ? finding.snippet.split('\n') 
    : [
        `82 | try:`,
        `83 |     raw = db.query(UserModel).filter_by(id=user_id).one()`,
        `84 |     raise HTTPException(status_code=404, detail="User record missing")`,
        `85 | except Exception as exc:`,
        `86 |     logger.warning(f"Lookup failure for user: {user_id}")`,
        `87 |     raise HTTPException(status_code=404, detail="Not Found")`
      ];

  return (
    <div 
      className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl h-full flex flex-col border-l shadow-2xl overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--cqt-card)', 
          borderColor: 'var(--cqt-border)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-start justify-between" style={{ backgroundColor: 'var(--cqt-card-hover)', borderColor: 'var(--cqt-border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {finding.rule_id}
              </span>
              <span className={`cqt-badge ${getSeverityBadgeClass(finding.severity)} uppercase text-[11px]`}>
                {finding.severity}
              </span>
              <span className="cqt-badge cqt-badge-neutral text-[11px]">
                {finding.category}
              </span>
              <span className="cqt-badge cqt-badge-neutral text-[11px]">
                {finding.source}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">
              {finding.rule_name || finding.rule_id}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Finding ID: <span className="font-mono text-slate-300">{finding.id}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors"
            title="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 flex-1">
          {/* File location card */}
          <div className="cqt-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="font-mono text-xs text-slate-200 truncate">
                {finding.file}
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400 shrink-0 ml-3 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Line {finding.line}, Col {finding.column}
            </div>
          </div>

          {/* Finding Message Box */}
          <div className="p-3.5 rounded-md border flex items-start gap-3 bg-amber-950/20 border-amber-900/40">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-amber-200 uppercase tracking-wide">Analysis Message</h4>
              <p className="text-sm text-slate-200 mt-1 font-mono">
                {finding.message}
              </p>
            </div>
          </div>

          {/* Code Snippet Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                Source Snippet
              </label>
              <button
                onClick={handleCopyCode}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy snippet'}
              </button>
            </div>

            <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#090d13] text-xs font-mono">
              <div className="px-3 py-1.5 bg-[#0e141d] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{finding.file}</span>
                <span className="text-amber-400 font-bold">Line {finding.line}</span>
              </div>
              <div className="p-3 overflow-x-auto leading-relaxed divide-y divide-transparent">
                {snippetLines.map((line, idx) => {
                  const isHighlighted = line.includes(String(finding.line)) || line.includes('HTTPException') || line.includes('assert') || line.includes('Line too long');
                  return (
                    <div 
                      key={idx} 
                      className={`px-2 py-0.5 rounded ${
                        isHighlighted 
                          ? 'bg-amber-500/15 text-amber-200 border-l-2 border-amber-400 font-semibold' 
                          : 'text-slate-300'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              Why This Matters
            </h4>
            <div className="p-3.5 rounded-md bg-[#131b26] border border-slate-800 text-sm text-slate-300 leading-relaxed">
              {finding.why_it_matters || (
                `In high-concurrency production services, this issue can directly degrade system reliability, conceal the original traceback errors, or expose the application to operational regressions.`
              )}
              {finding.cwe && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-indigo-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{finding.cwe}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Fix */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Recommended Fix
            </h4>
            <div className="p-3.5 rounded-md bg-[#111f18] border border-emerald-900/40 text-sm text-emerald-200/90 leading-relaxed font-mono">
              {finding.recommended_fix || (
                `Refactor the highlighted statement to comply with PEP 8 and project exception standards.`
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t flex items-center justify-between bg-[#0e131c]" style={{ borderColor: 'var(--cqt-border)' }}>
          <div className="text-xs text-slate-500 font-mono">
            Analyzer: {finding.source}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="cqt-btn cqt-btn-secondary cqt-btn-sm"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Navigating to GitHub repository source: ${finding.file}#L${finding.line}`)}
              className="cqt-btn cqt-btn-primary cqt-btn-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open In GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
