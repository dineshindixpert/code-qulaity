import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Code, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  FileCode,
  Terminal
} from 'lucide-react';
import { Project, Rule, RuleCategory, Severity } from '../types';

interface CreateCustomRuleViewProps {
  projects: Project[];
  onCreateRule: (rule: Partial<Rule>) => void;
  onCancel: () => void;
}

export const CreateCustomRuleView: React.FC<CreateCustomRuleViewProps> = ({
  projects,
  onCreateRule,
  onCancel
}) => {
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-001');
  const [ruleId, setRuleId] = useState('CUSTOM-PY-04');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('Python');
  const [ruleType, setRuleType] = useState<'regex' | 'ast_pattern' | 'dependency_check' | 'header_check'>('ast_pattern');
  const [category, setCategory] = useState<RuleCategory>('Custom');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [enabled, setEnabled] = useState(true);
  const [configuration, setConfiguration] = useState(
    JSON.stringify({
      target_node: "Call",
      func_name: "subprocess.Popen",
      check_kwargs: {
        shell: true
      },
      message: "Do not pass shell=True to subprocess invocations to prevent command injection"
    }, null, 2)
  );
  const [configError, setConfigError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify valid JSON
    try {
      JSON.parse(configuration);
      setConfigError(null);
    } catch (err: any) {
      setConfigError(`Invalid JSON configuration: ${err.message}`);
      return;
    }

    const newRule: Partial<Rule> = {
      id: `rule-${Date.now()}`,
      rule_id: ruleId.toUpperCase().trim(),
      name: name.trim(),
      description: description.trim(),
      language,
      rule_type: ruleType,
      category,
      severity,
      enabled,
      is_custom: true,
      source: 'Custom',
      project_id: projectId,
      configuration
    };

    onCreateRule(newRule);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Rules
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Custom Rule</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Define a project-specific AST pattern or regex rule evaluated by the CQT engine.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500">
          POST /api/rules
        </span>
      </div>

      <form onSubmit={handleSubmit} className="cqt-card p-6 space-y-6">
        {/* Project & Rule ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Project <span className="text-red-400">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="cqt-select"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.repository})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Rule ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={ruleId}
              onChange={(e) => setRuleId(e.target.value)}
              placeholder="e.g. CUSTOM-PY-04"
              className="cqt-input font-mono uppercase"
            />
          </div>
        </div>

        {/* Rule Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Rule Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ban shell=True in subprocess calls"
            className="cqt-input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what the violation indicates and why it creates quality/security risk..."
            className="cqt-input resize-none"
          />
        </div>

        {/* Language, Rule Type, Category, Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="cqt-select"
            >
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="YAML/JSON">YAML/JSON</option>
              <option value="All">All Languages</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Rule Type
            </label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value as any)}
              className="cqt-select"
            >
              <option value="ast_pattern">AST Pattern Matcher</option>
              <option value="regex">Regular Expression</option>
              <option value="dependency_check">Dependency Check</option>
              <option value="header_check">Header Check</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RuleCategory)}
              className="cqt-select"
            >
              <option value="Custom">Custom</option>
              <option value="Security">Security</option>
              <option value="Bug">Bug</option>
              <option value="Code Smell">Code Smell</option>
              <option value="Style">Style</option>
              <option value="FastAPI">FastAPI</option>
              <option value="Complexity">Complexity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
              className="cqt-select"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* JSON Configuration Editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              Rule Configuration (JSON AST Schema)
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Valid JSON required
            </span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090d13] overflow-hidden">
            <div className="px-3 py-1.5 bg-[#0e141e] border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>config.json</span>
              <span>schema: cqt/rule-v1</span>
            </div>
            <textarea
              rows={8}
              value={configuration}
              onChange={(e) => {
                setConfiguration(e.target.value);
                setConfigError(null);
              }}
              className="w-full bg-transparent p-3 font-mono text-xs text-indigo-200 outline-none resize-y leading-relaxed"
            />
          </div>

          {configError && (
            <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              {configError}
            </div>
          )}
        </div>

        {/* Enabled Checkbox */}
        <div className="flex items-center gap-2.5 pt-2">
          <input
            type="checkbox"
            id="ruleEnabledCheckbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="ruleEnabledCheckbox" className="text-sm text-slate-300 cursor-pointer">
            Enable rule immediately for subsequent scans
          </label>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cqt-btn cqt-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cqt-btn cqt-btn-primary"
          >
            <Check className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>
      </form>
    </div>
  );
};
