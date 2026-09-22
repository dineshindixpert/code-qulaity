import { 
  Project, 
  Run, 
  Rule, 
  Finding,
  ManualRunRequest,
  ManualRunResponse,
  AsyncRunRequest,
  AsyncRunResponse,
  RunFindingsResponse,
  RunDetailsResponse,
  RunStatusResponse,
  PublicGitHubRunRequest,
  PublicGitHubRunResponse,
  GitHubPATScanRequest,
  GitHubScanRequest,
  GitHubScanResponse,
  ProjectCreate,
  ProjectResponse,
  ProjectAnalyticsResponse,
  ProjectOverviewResponse,
  RuleCatalogResponse,
  CustomRuleCreate,
  CustomRuleUpdate,
  CustomRuleResponse
} from '../types';

export const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cqt_api_base_url');
    if (saved) return saved.trim();
  }
  return ((import.meta as any).env?.VITE_API_URL as string) || DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    const clean = url.trim().replace(/\/$/, '');
    localStorage.setItem('cqt_api_base_url', clean);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const targetUrl = base ? `${base}${endpoint}` : endpoint;

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch (err) {
    // If direct absolute call failed (e.g., CORS or network restriction in browser),
    // and targetUrl was absolute, attempt relative endpoint via Vite proxy (/api, /health)
    if (base && !endpoint.startsWith('http')) {
      try {
        response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });
      } catch {
        throw new Error(`Failed to connect to CQT backend at ${base} or local proxy. Ensure the server is running on port 8000.`);
      }
    } else {
      throw new Error(`Failed to connect to CQT backend at ${targetUrl}. Ensure the server is running on port 8000.`);
    }
  }

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      }
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  // 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const cqtApi = {
  // Configuration
  getBaseUrl: getApiBaseUrl,
  setBaseUrl: setApiBaseUrl,

  // Health checks
  getHealth: async (customUrl?: string) => {
    const base = (customUrl || getApiBaseUrl()).replace(/\/$/, '');
    const startTime = performance.now();
    try {
      const res = await fetch(`${base}/health`, { method: 'GET' });
      const latency = Math.round(performance.now() - startTime);
      if (res.ok) {
        const data = await res.json();
        return { ok: true, latency, data, status: 'healthy' };
      }
      return { ok: false, latency, status: `HTTP ${res.status}`, error: `HTTP ${res.status}` };
    } catch (err: any) {
      // Try fallback to proxy
      try {
        const proxyRes = await fetch('/health', { method: 'GET' });
        const latency = Math.round(performance.now() - startTime);
        if (proxyRes.ok) {
          const data = await proxyRes.json();
          return { ok: true, latency, data, status: 'healthy (proxied)' };
        }
      } catch {
        // failed both
      }
      return { ok: false, latency: 0, status: 'offline', error: err?.message || 'Connection refused' };
    }
  },

  getDbHealth: async (customUrl?: string) => {
    const base = (customUrl || getApiBaseUrl()).replace(/\/$/, '');
    const startTime = performance.now();
    try {
      const res = await fetch(`${base}/health/db`, { method: 'GET' });
      const latency = Math.round(performance.now() - startTime);
      if (res.ok) {
        const data = await res.json();
        return { ok: true, latency, data, status: 'connected' };
      }
      return { ok: false, latency, status: `HTTP ${res.status}`, error: `HTTP ${res.status}` };
    } catch (err: any) {
      try {
        const proxyRes = await fetch('/health/db', { method: 'GET' });
        const latency = Math.round(performance.now() - startTime);
        if (proxyRes.ok) {
          const data = await proxyRes.json();
          return { ok: true, latency, data, status: 'connected (proxied)' };
        }
      } catch {
        // failed both
      }
      return { ok: false, latency: 0, status: 'offline', error: err?.message || 'Connection refused' };
    }
  },

  // Runs
  createManualRun: (data: ManualRunRequest) => 
    request<ManualRunResponse>('/api/runs/manual', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  createAsyncRun: (data: AsyncRunRequest) => 
    request<AsyncRunResponse>('/api/runs/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getRunFindings: (runId: string, params?: { severity?: string; category?: string; rule_id?: string; search?: string; limit?: number; offset?: number }) => {
    const q = new URLSearchParams();
    if (params?.severity) q.set('severity', params.severity);
    if (params?.category) q.set('category', params.category);
    if (params?.rule_id) q.set('rule_id', params.rule_id);
    if (params?.search) q.set('search', params.search);
    if (params?.limit !== undefined) q.set('limit', String(params.limit));
    if (params?.offset !== undefined) q.set('offset', String(params.offset));
    const queryStr = q.toString() ? `?${q.toString()}` : '';
    return request<RunFindingsResponse>(`/api/runs/${runId}/findings${queryStr}`);
  },

  getRunDetails: (runId: string) => 
    request<RunDetailsResponse>(`/api/runs/${runId}/details`),

  getRunStatus: (runId: string) => 
    request<RunStatusResponse>(`/api/runs/${runId}`),

  createPublicGithubRun: (data: PublicGitHubRunRequest) => 
    request<PublicGitHubRunResponse>('/api/runs/github/public', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  listProjectRuns: (projectId: string, limit = 20, offset = 0) => 
    request<Run[]>(`/api/runs/project/${projectId}?limit=${limit}&offset=${offset}`),

  // Upload
  uploadZip: async (projectId: string, file: File) => {
    const base = getApiBaseUrl().replace(/\/$/, '');
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('file', file);

    const targetUrl = base ? `${base}/api/upload/zip` : '/api/upload/zip';

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
      return res.json();
    } catch (err) {
      if (base) {
        // Fallback to proxy
        const res = await fetch('/api/upload/zip', {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
        return res.json();
      }
      throw err;
    }
  },

  // GitHub
  testGithubPat: (owner: string, repo: string) => 
    request<string>(`/api/github/pat/test?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`),

  listGithubPatBranches: (owner: string, repo: string) => 
    request<string[]>(`/api/github/pat/branches?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`),

  getGithubPatTree: (owner: string, repo: string, branch = 'main') => 
    request<string[]>(`/api/github/pat/tree?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}`),

  testGithubPatSource: (owner: string, repo: string, branch = 'main') => 
    request<string>(`/api/github/pat/source-test?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}`),

  scanGithubPat: (data: GitHubPATScanRequest) => 
    request<string>('/api/github/pat/scan', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  listGithubAppRepositories: (installationId: number) => 
    request<{ repositories: Array<{ owner: string; name: string; full_name: string; default_branch: string; private: boolean }> }>(
      `/api/github/app/repositories?installation_id=${installationId}`
    ),

  listGithubAppBranches: (installationId: number, owner: string, repo: string) => 
    request<{ repository: string; branches: Array<{ name: string }> }>(
      `/api/github/app/branches?installation_id=${installationId}&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
    ),

  scanGithubApp: (data: GitHubScanRequest) => 
    request<GitHubScanResponse>('/api/github/app/scan', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Projects
  listProjects: () => 
    request<ProjectResponse[]>('/api/projects/'),

  createProject: (data: ProjectCreate) => 
    request<ProjectResponse>('/api/projects/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getProjectAnalytics: (projectId: string) => 
    request<ProjectAnalyticsResponse>(`/api/projects/${projectId}/analytics`),

  getProjectOverview: (projectId: string) => 
    request<ProjectOverviewResponse>(`/api/projects/${projectId}/overview`),

  // Custom Rules
  getRuleCatalog: (projectId: string) => 
    request<RuleCatalogResponse>(`/api/rules/catalog?project_id=${encodeURIComponent(projectId)}`),

  createRule: (data: CustomRuleCreate) => 
    request<CustomRuleResponse>('/api/rules', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  listRules: (params?: { project_id?: string; enabled?: boolean; language?: string }) => {
    const q = new URLSearchParams();
    if (params?.project_id) q.set('project_id', params.project_id);
    if (params?.enabled !== undefined) q.set('enabled', String(params.enabled));
    if (params?.language) q.set('language', params.language);
    const queryStr = q.toString() ? `?${q.toString()}` : '';
    return request<CustomRuleResponse[]>(`/api/rules${queryStr}`);
  },

  getRule: (ruleId: string) => 
    request<CustomRuleResponse>(`/api/rules/${ruleId}`),

  updateRule: (ruleId: string, data: CustomRuleUpdate) => 
    request<CustomRuleResponse>(`/api/rules/${ruleId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteRule: (ruleId: string) => 
    request<void>(`/api/rules/${ruleId}`, {
      method: 'DELETE'
    }),

  enableRule: (ruleId: string) => 
    request<CustomRuleResponse>(`/api/rules/${ruleId}/enable`, {
      method: 'PATCH'
    }),

  disableRule: (ruleId: string) => 
    request<CustomRuleResponse>(`/api/rules/${ruleId}/disable`, {
      method: 'PATCH'
    }),

  getOpenApiSpec: () => 
    request<Record<string, unknown>>('/openapi.json')
};
