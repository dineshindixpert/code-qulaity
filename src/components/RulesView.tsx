import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Power, 
  Code, 
  CheckCircle2, 
  FileCode,
  ExternalLink
} from 'lucide-react';
import { Rule, Project } from '../types';

interface RulesViewProps {
  rules: Rule[];
  projects: Project[];
  onToggleRuleEnabled: (ruleId: string) => void;
  onOpenCreateRule: () => void;
  onSelectRuleForEdit: (rule: Rule) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const RulesView: React.FC<RulesViewProps> = ({
  rules,
  projects,
  onToggleRuleEnabled,
  onOpenCreateRule,
  onSelectRuleForEdit,
  onDeleteRule
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BUILTIN' | 'CUSTOM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [enabledFilter, setEnabledFilter] = useState('ALL');

  // Filter options
  const categories = Array.from(new Set(rules.map(r => r.category)));
  const sources = Array.from(new Set(rules.map(r => r.source)));

  const filteredRules = rules.filter(r => {
    // Tab filter
    if (activeTab === 'BUILTIN' && r.is_custom) return false;
    if (activeTab === 'CUSTOM' && !r.is_custom) return false;

    // Search filter
    const matchesSearch = 
      r.rule_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Dropdown filters
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || r.severity.toUpperCase() === severityFilter;
    const matchesSource = sourceFilter === 'ALL' || r.source === sourceFilter;
    const matchesEnabled = 
      enabledFilter === 'ALL' ? true : 
      enabledFilter === 'ENABLED' ? r.enabled : !r.enabled;

    return matchesSearch && matchesCategory && matchesSeverity && matchesSource && matchesEnabled;
  });

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Rule Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage built-in and project-specific quality rules for the CQT analyzer engine.
          </p>
        </div>

        <button
          onClick={onOpenCreateRule}
          className="cqt-btn cqt-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Rule</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'ALL'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          All Rules ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab('BUILTIN')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'BUILTIN'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Built-in Rules ({rules.filter(r => !r.is_custom).length})
        </button>
        <button
          onClick={() => setActiveTab('CUSTOM')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'CUSTOM'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Custom Rules ({rules.filter(r => r.is_custom).length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cqt-card p-3.5 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rule ID (E501, B101, FASTAPI-007) or description..."
              className="cqt-input pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="cqt-select text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="ALL">Category: All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

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

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="cqt-select text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="ALL">Source: All</option>
              {sources.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={enabledFilter}
              onChange={(e) => setEnabledFilter(e.target.value)}
              className="cqt-select text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="ALL">State: All</option>
              <option value="ENABLED">Enabled Only</option>
              <option value="DISABLED">Disabled Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="cqt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cqt-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Rule ID</th>
                <th>Name & Description</th>
                <th style={{ width: '110px' }}>Source</th>
                <th style={{ width: '90px' }}>Language</th>
                <th style={{ width: '120px' }}>Category</th>
                <th style={{ width: '100px' }}>Severity</th>
                <th style={{ width: '100px' }}>Enabled</th>
                <th style={{ width: '110px' }} className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="cqt-table-row">
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                        {rule.rule_id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-xs">
                        {rule.name}
                      </span>
                      {rule.is_custom && (
                        <span className="cqt-badge cqt-badge-custom text-[10px]">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {rule.description}
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-300">
                      {rule.source}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-400">
                      {rule.language}
                    </span>
                  </td>
                  <td>
                    <span className="cqt-badge cqt-badge-neutral text-[11px]">
                      {rule.category}
                    </span>
                  </td>
                  <td>
                    <span className={`cqt-badge ${getSeverityBadgeClass(rule.severity)} uppercase text-[10px]`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => onToggleRuleEnabled(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                      title={rule.enabled ? "Enabled - Click to disable" : "Disabled - Click to enable"}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectRuleForEdit(rule)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                        title="View / Edit rule details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {rule.is_custom && (
                        <button
                          onClick={() => onDeleteRule(rule.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                          title="Delete custom rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
