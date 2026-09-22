import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  GitBranch, 
  Github, 
  ShieldAlert, 
  Check, 
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { Project } from '../types';
import { cqtApi } from '../api/client';

interface ProjectSettingsViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onBack: () => void;
}

export const ProjectSettingsView: React.FC<ProjectSettingsViewProps> = ({
  project,
  onUpdateProject,
  onDeleteProject,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'repository' | 'rules' | 'danger'>('general');

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [repository, setRepository] = useState(project.repository);
  const [defaultBranch, setDefaultBranch] = useState(project.default_branch);
  const [ruleProfile, setRuleProfile] = useState('enterprise-recommended');
  const [savedNotice, setSavedNotice] = useState(false);

  // Danger zone state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Project = {
      ...project,
      name,
      description,
      repository,
      default_branch: defaultBranch
    };
    onUpdateProject(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleDelete = () => {
    if (confirmDeleteInput === project.name) {
      onDeleteProject(project.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Project
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-white">Project Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure metadata, default branches, and rule evaluation profiles for <span className="text-white font-medium">{project.name}</span>.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500">
          PUT /api/projects/{project.id}
        </span>
      </div>

      {/* Nav Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-6">
        <button
          onClick={() => setActiveSection('general')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeSection === 'general'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveSection('repository')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeSection === 'repository'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Repository & GitHub
        </button>
        <button
          onClick={() => setActiveSection('rules')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeSection === 'rules'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Rule Profiles
        </button>
        <button
          onClick={() => setActiveSection('danger')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeSection === 'danger'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Danger Zone
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-md bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Project settings saved successfully.</span>
        </div>
      )}

      {/* Content Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeSection === 'general' && (
          <div className="cqt-card p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                required
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
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="cqt-input resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="cqt-btn cqt-btn-primary">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {activeSection === 'repository' && (
          <div className="cqt-card p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Repository Identifier / Path
              </label>
              <input
                type="text"
                required
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
                className="cqt-input font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Default Branch
              </label>
              <input
                type="text"
                required
                value={defaultBranch}
                onChange={(e) => setDefaultBranch(e.target.value)}
                className="cqt-input font-mono text-xs"
              />
            </div>

            <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Github className="w-4 h-4 text-indigo-400" />
                <span>GitHub Webhook Integration</span>
              </div>
              <p className="text-slate-400">
                To trigger automatic CQT quality checks on GitHub Pull Requests, configure a webhook pointing to:
              </p>
              <div className="p-2 rounded bg-black/40 font-mono text-[11px] text-indigo-300 select-all border border-slate-800">
                {cqtApi.getBaseUrl()}/api/webhooks/github?project_id={project.id}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="cqt-btn cqt-btn-primary">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {activeSection === 'rules' && (
          <div className="cqt-card p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Default Rule Profile
              </label>
              <select
                value={ruleProfile}
                onChange={(e) => setRuleProfile(e.target.value)}
                className="cqt-select text-xs"
              >
                <option value="enterprise-recommended">Enterprise Recommended (34 rules active)</option>
                <option value="strict-security">Strict Security & OWASP (Bandit + Secrets + pip-audit)</option>
                <option value="pep8-fastapi">FastAPI Microservice Quality (Ruff + Radon + FastAPI rules)</option>
                <option value="custom">Custom configured profile</option>
              </select>
            </div>

            <p className="text-xs text-slate-400">
              New scans for this project will pre-select rules belonging to this profile.
            </p>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="cqt-btn cqt-btn-primary">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {activeSection === 'danger' && (
          <div className="cqt-card p-6 border-red-900/50 bg-[#140f12] space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Delete Project</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Once deleted, all historical quality scores, scan runs, and custom rule bindings for <strong className="text-white">{project.name}</strong> will be permanently removed.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-red-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="cqt-btn cqt-btn-danger"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-lg border border-red-900 bg-[#120e14] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white">Are you sure?</h3>
            <p className="text-xs text-slate-300">
              This action cannot be undone. Please type <span className="font-mono text-red-400 font-bold">{project.name}</span> to confirm deletion.
            </p>

            <input
              type="text"
              value={confirmDeleteInput}
              onChange={(e) => setConfirmDeleteInput(e.target.value)}
              placeholder={project.name}
              className="cqt-input font-mono text-xs border-red-900/70"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="cqt-btn cqt-btn-secondary cqt-btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmDeleteInput !== project.name}
                onClick={handleDelete}
                className="cqt-btn cqt-btn-danger cqt-btn-sm disabled:opacity-40"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
