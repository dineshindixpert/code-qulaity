import React, { useState } from 'react';
import { 
  Github, 
  CheckCircle2, 
  ExternalLink, 
  Key, 
  Lock, 
  GitBranch, 
  RefreshCw, 
  ShieldCheck, 
  FolderGit2,
  Check
} from 'lucide-react';
import { GitHubAppInstallation, GitHubRepository } from '../types';

interface GitHubIntegrationViewProps {
  installation: GitHubAppInstallation;
  repos: GitHubRepository[];
  onSelectProjectRepo?: (repoFullName: string) => void;
}

export const GitHubIntegrationView: React.FC<GitHubIntegrationViewProps> = ({
  installation,
  repos,
  onSelectProjectRepo
}) => {
  const [patConfigured, setPatConfigured] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">GitHub Integration</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Configure CQT GitHub App connections and repository access credentials.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="cqt-btn cqt-btn-outline cqt-btn-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Repositories</span>
        </button>
      </div>

      {/* GitHub App Status Card */}
      <div className="cqt-card p-6 border-indigo-500/40 bg-[#111722] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">CQT GitHub App</h2>
                <span className="cqt-badge cqt-badge-completed font-mono text-[10px]">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Installed on GitHub Organization / User: <strong className="text-indigo-300 font-mono">{installation.account_name}</strong>
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 sm:text-right">
            <div>App Installation ID: <span className="text-white">#{installation.id}</span></div>
            <div>Permissions: <span className="text-emerald-400">Read repository tree & contents</span></div>
          </div>
        </div>

        <div className="p-3.5 rounded bg-[#0b1017] border border-slate-800 text-xs flex items-center justify-between font-mono">
          <span className="text-slate-400">Backend Endpoint: <span className="text-slate-200">GET /api/github/app/repositories</span></span>
          <span className="text-slate-500">Last Synced: {lastRefreshed}</span>
        </div>
      </div>

      {/* Connected Repositories */}
      <div className="cqt-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#121822]">
          <div>
            <h3 className="text-base font-semibold text-white">Accessible Repositories</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Repositories granted to CQT GitHub App installation #{installation.id}.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {repos.length} repositories
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {repos.map((repo) => (
            <div key={repo.full_name} className="p-4 flex items-center justify-between gap-4 hover:bg-[#141b26] transition-colors">
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-white text-xs hover:text-indigo-400 cursor-pointer">
                    {repo.full_name}
                  </span>
                  {repo.private ? (
                    <span className="cqt-badge cqt-badge-neutral text-[10px] flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3 text-slate-400" /> Private
                    </span>
                  ) : (
                    <span className="cqt-badge cqt-badge-neutral text-[10px] font-mono">
                      Public
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-slate-500" />
                    default: {repo.default_branch}
                  </span>
                  <span>•</span>
                  <span>Language: {repo.language}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://github.com/${repo.full_name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Access Token (PAT) Fallback */}
      <div className="cqt-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Server-Side Personal Access Token (PAT)</h3>
          </div>
          <span className="cqt-badge cqt-badge-completed font-mono text-[10px]">
            ACTIVE &amp; STORED
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          In addition to the GitHub App, CQT server maintains a scoped GitHub token for clone operations on private submodules. The token is stored strictly in server-side environment variables and is never transmitted or visible in the frontend UI.
        </p>
      </div>
    </div>
  );
};
