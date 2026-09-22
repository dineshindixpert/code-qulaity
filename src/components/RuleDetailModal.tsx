import React, { useState, useEffect } from 'react';
import { 
  X, 
  Code, 
  Trash2, 
  Save, 
  Power, 
  Check, 
  AlertCircle,
  FileCode
} from 'lucide-react';
import { Rule, Severity, RuleCategory } from '../types';

interface RuleDetailModalProps {
  rule: Rule | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRule: (updatedRule: Rule) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const RuleDetailModal: React.FC<RuleDetailModalProps> = ({
  rule,
  isOpen,
  onClose,
  onUpdateRule,
  onDeleteRule
}) => {
  if (!isOpen || !rule) return null;

  const [name, setName] = useState(rule.name);
  const [description, setDescription] = useState(rule.description);
  const [severity, setSeverity] = useState<Severity>(rule.severity);
  const [category, setCategory] = useState<RuleCategory>(rule.category);
  const [enabled, setEnabled] = useState(rule.enabled);
  const [configuration, setConfiguration] = useState(rule.configuration || '{\n  "mode": "standard"\n}');
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setDescription(rule.description);
      setSeverity(rule.severity);
      setCategory(rule.category);
      setEnabled(rule.enabled);
      setConfiguration(rule.configuration || '{\n  "mode": "standard"\n}');
      setConfigError(null);
    }
  }, [rule]);

  const handleSave = () => {
    if (rule.is_custom) {
      try {
        JSON.parse(configuration);
        setConfigError(null);
      } catch (err: any) {
        setConfigError(`Invalid JSON: ${err.message}`);
        return;
      }
    }

    const updated: Rule = {
      ...rule,
      name,
      description,
      severity,
      category,
      enabled,
      configuration: rule.is_custom ? configuration : rule.configuration
    };

    onUpdateRule(updated);
    onClose();
  };

  const handleToggleState = () => {
    setEnabled(prev => !prev);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-lg border shadow-2xl overflow-hidden my-8"
        style={{ 
          backgroundColor: '#121722', 
          borderColor: 'var(--cqt-border)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-start justify-between bg-[#0e131d]" style={{ borderColor: 'var(--cqt-border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {rule.rule_id}
              </span>
              {rule.is_custom ? (
                <span className="cqt-badge cqt-badge-custom text-[11px]">Custom Rule</span>
              ) : (
                <span className="cqt-badge cqt-badge-neutral text-[11px]">Built-in ({rule.source})</span>
              )}
              <span className={`cqt-badge uppercase text-[10px] ${
                enabled ? 'cqt-badge-completed' : 'cqt-badge-neutral'
              }`}>
                {enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">Rule Details</h2>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              PUT /api/rules/{rule.rule_id}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Rule Name
            </label>
            <input
              type="text"
              disabled={!rule.is_custom}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cqt-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              disabled={!rule.is_custom}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="cqt-input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Source</span>
              <div className="text-xs font-mono text-slate-200 mt-1">{rule.source}</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Language</span>
              <div className="text-xs font-mono text-slate-200 mt-1">{rule.language}</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Category</span>
              <div className="text-xs font-mono text-slate-200 mt-1">{rule.category}</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Severity</span>
              <div className="text-xs font-mono text-amber-400 uppercase mt-1">{rule.severity}</div>
            </div>
          </div>

          {/* Configuration Editor for custom rule */}
          {rule.is_custom && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                AST Configuration (JSON)
              </label>
              <div className="rounded-md border border-slate-800 bg-[#090d13] overflow-hidden">
                <textarea
                  rows={6}
                  value={configuration}
                  onChange={(e) => setConfiguration(e.target.value)}
                  className="w-full bg-transparent p-3 font-mono text-xs text-indigo-200 outline-none leading-relaxed"
                />
              </div>
              {configError && (
                <div className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {configError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t flex items-center justify-between bg-[#0e131d]" style={{ borderColor: 'var(--cqt-border)' }}>
          <div>
            {rule.is_custom ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete custom rule ${rule.rule_id}?`)) {
                    onDeleteRule(rule.id);
                    onClose();
                  }
                }}
                className="cqt-btn cqt-btn-danger cqt-btn-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-mono">
                Built-in analyzer rule (read-only)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleState}
              className="cqt-btn cqt-btn-outline cqt-btn-sm"
            >
              <Power className={`w-3.5 h-3.5 ${enabled ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{enabled ? 'Disable' : 'Enable'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="cqt-btn cqt-btn-primary cqt-btn-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
