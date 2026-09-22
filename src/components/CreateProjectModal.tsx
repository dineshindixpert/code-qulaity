import React, { useState } from 'react';
import { 
  X, 
  Github, 
  UploadCloud, 
  Key, 
  CheckCircle2, 
  FileCode, 
  AlertCircle,
  FolderGit2
} from 'lucide-react';
import { Project, GitHubRepository, GitHubAppInstallation } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Partial<Project>) => void;
  githubInstallation: GitHubAppInstallation;
  githubRepos: GitHubRepository[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  githubInstallation,
  githubRepos
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceCategory, setSourceCategory] = useState<'github' | 'zip'>('github');
  const [githubMode, setGithubMode] = useState<'app' | 'public' | 'pat'>('app');

  // GitHub App fields
  const [selectedRepoFullName, setSelectedRepoFullName] = useState(githubRepos[0]?.full_name || '');
  const [selectedBranch, setSelectedBranch] = useState('dev');

  // Public repo field
  const [publicUrl, setPublicUrl] = useState('https://github.com/Dineshindiexpert/example');

  // PAT fields
  const [patOwner, setPatOwner] = useState('Dineshindiexpert');
  const [patRepo, setPatRepo] = useState('');
  const [patBranch, setPatBranch] = useState('main');

  // ZIP fields
  const [zipFileName, setZipFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let repository = '';
    let branch = 'main';

    if (sourceCategory === 'github') {
      if (githubMode === 'app') {
        repository = selectedRepoFullName;
        branch = selectedBranch;
      } else if (githubMode === 'public') {
        repository = publicUrl.replace('https://github.com/', '');
        branch = 'main';
      } else {
        repository = `${patOwner}/${patRepo}`;
        branch = patBranch;
      }
    } else {
      repository = zipFileName ? `archive://${zipFileName}` : 'archive://source-code.zip';
      branch = 'snapshot';
    }

    const newProject: Partial<Project> = {
      name: name || (repository.split('/')[1] || 'New Project'),
      description: description || 'Source code analyzed with CQT engine.',
      repository,
      default_branch: branch,
      source_type: sourceCategory === 'zip' ? 'zip' : (githubMode === 'app' ? 'github_app' : githubMode === 'public' ? 'github_public' : 'github_pat'),
      latest_score: 85,
      findings_count: 14,
      last_scan: 'Just now',
      status: 'Completed',
      severity_counts: {
        critical: 0,
        high: 2,
        medium: 9,
        low: 3
      }
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-lg border shadow-2xl overflow-hidden my-8"
        style={{ 
          backgroundColor: 'var(--cqt-card)', 
          borderColor: 'var(--cqt-border)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ backgroundColor: 'var(--cqt-card-hover)', borderColor: 'var(--cqt-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Create New Project</h2>
              <p className="text-xs text-slate-500">Configure project repository and code quality analyzer.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* General Fields */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CQT Backend Service"
              className="cqt-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the service architecture and analyzer target..."
              className="cqt-input resize-none"
            />
          </div>

          {/* Source Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Source Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSourceCategory('github')}
                className={`p-3 rounded-md border text-left flex items-center gap-3 transition-colors ${
                  sourceCategory === 'github'
                    ? 'bg-indigo-950/40 border-indigo-500 text-white'
                    : 'bg-[#0f141c] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Github className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">GitHub Repository</div>
                  <div className="text-[11px] text-slate-400">App, Public URL, or PAT</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSourceCategory('zip')}
                className={`p-3 rounded-md border text-left flex items-center gap-3 transition-colors ${
                  sourceCategory === 'zip'
                    ? 'bg-indigo-950/40 border-indigo-500 text-white'
                    : 'bg-[#0f141c] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <UploadCloud className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Upload ZIP</div>
                  <div className="text-[11px] text-slate-400">Manual source code archive</div>
                </div>
              </button>
            </div>
          </div>

          {/* GitHub Source Configuration */}
          {sourceCategory === 'github' ? (
            <div className="p-3.5 rounded-md bg-[#0e131d] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <button
                  type="button"
                  onClick={() => setGithubMode('app')}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    githubMode === 'app' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  GitHub App
                </button>
                <button
                  type="button"
                  onClick={() => setGithubMode('public')}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    githubMode === 'public' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Public Repository
                </button>
                <button
                  type="button"
                  onClick={() => setGithubMode('pat')}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    githubMode === 'pat' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Personal Access Token
                </button>
              </div>

              {githubMode === 'app' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      GitHub App Connected
                    </span>
                    <span className="text-slate-400">Org: {githubInstallation.account_name}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Repository
                    </label>
                    <select
                      value={selectedRepoFullName}
                      onChange={(e) => setSelectedRepoFullName(e.target.value)}
                      className="cqt-select text-xs"
                    >
                      {githubRepos.map((repo) => (
                        <option key={repo.full_name} value={repo.full_name}>
                          {repo.full_name} {repo.private ? '(Private)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Default Branch
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="cqt-select text-xs"
                    >
                      <option value="dev">dev</option>
                      <option value="main">main</option>
                      <option value="master">master</option>
                      <option value="feature/v2">feature/v2</option>
                    </select>
                  </div>
                </div>
              )}

              {githubMode === 'public' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Public Repository URL
                  </label>
                  <input
                    type="url"
                    value={publicUrl}
                    onChange={(e) => setPublicUrl(e.target.value)}
                    placeholder="https://github.com/Dineshindiexpert/example"
                    className="cqt-input text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    CQT will fetch code trees directly through GitHub's public API without credentials.
                  </p>
                </div>
              )}

              {githubMode === 'pat' && (
                <div className="space-y-2.5">
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Uses configured server-side PAT securely (tokens are never exposed in UI).</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Owner</label>
                      <input
                        type="text"
                        value={patOwner}
                        onChange={(e) => setPatOwner(e.target.value)}
                        className="cqt-input text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Repository Name</label>
                      <input
                        type="text"
                        value={patRepo}
                        onChange={(e) => setPatRepo(e.target.value)}
                        placeholder="e.g. backend-core"
                        className="cqt-input text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Branch</label>
                    <input
                      type="text"
                      value={patBranch}
                      onChange={(e) => setPatBranch(e.target.value)}
                      className="cqt-input text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ZIP Upload Area */
            <div className="border-2 border-dashed rounded-lg p-6 text-center border-slate-700 hover:border-indigo-500 bg-[#0c1017] transition-colors">
              <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-200">
                {zipFileName ? zipFileName : "Drag and drop your source code .zip"}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Maximum file size: 50MB (.zip archives only)
              </p>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setZipFileName(e.target.files[0].name);
                  }
                }}
                className="hidden"
                id="zipFileInputModal"
              />
              <label
                htmlFor="zipFileInputModal"
                className="cqt-btn cqt-btn-outline cqt-btn-sm mt-3 inline-flex cursor-pointer"
              >
                Browse Files
              </label>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="cqt-btn cqt-btn-secondary cqt-btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cqt-btn cqt-btn-primary cqt-btn-sm"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
