export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type RuleCategory = 
  | 'Security' 
  | 'Bug' 
  | 'Code Smell' 
  | 'Style' 
  | 'Complexity' 
  | 'Dependency' 
  | 'FastAPI' 
  | 'Duplicate Code' 
  | 'Custom';

export type AnalyzerSource = 
  | 'Ruff' 
  | 'Bandit' 
  | 'Radon' 
  | 'CQT' 
  | 'pip-audit' 
  | 'Custom' 
  | 'FastAPI Rules'
  | 'Secrets';

export type RunStatus = 'completed' | 'running' | 'failed' | 'queued';

export interface Finding {
  id: string;
  run_id: string;
  rule_id: string;
  rule_name: string;
  severity: Severity;
  category: RuleCategory;
  source: AnalyzerSource;
  message: string;
  file: string;
  line: number;
  column: number;
  snippet?: string;
  highlight_line?: number;
  why_it_matters?: string;
  recommended_fix?: string;
  cwe?: string;
}

export interface Rule {
  id: string;
  rule_id: string;
  name: string;
  description: string;
  category: RuleCategory;
  severity: Severity;
  source: AnalyzerSource;
  language: string;
  enabled: boolean;
  is_custom: boolean;
  project_id?: string;
  rule_type?: 'regex' | 'ast_pattern' | 'dependency_check' | 'header_check';
  configuration?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repository: string;
  default_branch: string;
  source_type: 'github_app' | 'github_public' | 'github_pat' | 'zip';
  latest_score: number;
  findings_count: number;
  last_scan: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  created_at: string;
  severity_counts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface Run {
  id: string;
  project_id: string;
  project_name: string;
  repository: string;
  branch: string;
  score: number;
  findings_count: number;
  status: RunStatus;
  started_at: string;
  completed_at: string;
  duration_seconds: number;
  source_type: string;
  rules_count: number;
  files_analyzed: number;
  severity_counts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ProjectAnalytics {
  project_id: string;
  history: Array<{
    run_id: string;
    score: number;
    date: string;
    findings: number;
  }>;
}

export interface GitHubRepository {
  id?: string | number;
  owner: string;
  name: string;
  full_name: string;
  default_branch: string;
  private: boolean;
  language: string;
  updated_at: string;
}

export interface GitHubAppInstallation {
  id: number;
  account_name: string;
  installed_at: string;
  target_type: string;
  repositories_count: number;
}

export type RouteView = 
  | 'dashboard'
  | 'projects'
  | 'project_overview'
  | 'scan'
  | 'upload'
  | 'project_settings'
  | 'runs'
  | 'run_details'
  | 'rules'
  | 'create_rule'
  | 'github'
  | 'routes'
  | 'api_docs'
  | 'settings';

// OpenAPI 3.1 Schemas & Request/Response Types
export interface ManualRunRequest {
  project_id: string;
  workspace_path?: string;
  profile_path?: string;
}

export interface ManualRunFindingItem {
  rule_id: string;
  message: string;
  severity: string;
  category: string;
  file_path: string;
  line_number: number;
  column_number: number;
}

export interface ManualRunResponse {
  run_id: string;
  project_id: string;
  status: string;
  score: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_findings: number;
  findings: ManualRunFindingItem[];
}

export interface AsyncRunRequest {
  project_id: string;
  workspace_path?: string;
  profile_path?: string;
}

export interface AsyncRunResponse {
  run_id: string;
  project_id: string;
  status: string;
}

export interface RunFindingResponse {
  id: string;
  run_id: string;
  rule_id: string;
  message: string;
  severity: string;
  category: string;
  file_path: string;
  line_number: number;
  column_number: number;
  created_at: string;
}

export interface RunFindingsResponse {
  run_id: string;
  total: number;
  limit: number;
  offset: number;
  findings: RunFindingResponse[];
}

export interface RunDetailsSummary {
  total_findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface RunDetailsResponse {
  run_id: string;
  project_id: string;
  status: string;
  score: number;
  started_at: string;
  completed_at: string;
  summary: RunDetailsSummary;
  findings: RunFindingResponse[];
}

export interface RunStatusResponse {
  run_id: string;
  project_id: string;
  status: string;
  score: number;
  started_at: string;
  completed_at: string;
}

export interface PublicGitHubRunRequest {
  project_id: string;
  repository_url: string;
  profile_path?: string;
}

export interface PublicGitHubRunResponse {
  run_id: string;
  project_id: string;
  status: string;
  repository: string;
  default_branch: string;
  files_analyzed: number;
  score: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_findings: number;
}

export interface UploadRunResponse {
  run_id: string;
  filename: string;
  status: string;
}

export interface GitHubPATScanRequest {
  project_id: string;
  owner: string;
  repo: string;
  branch: string;
  selected_rule_keys: string[];
  selected_rule_ids: string[];
}

export interface GitHubBranchResponse {
  name: string;
}

export interface GitHubBranchListResponse {
  repository: string;
  branches: GitHubBranchResponse[];
}

export interface GitHubRepositoryListResponse {
  repositories: Array<{
    owner: string;
    name: string;
    full_name: string;
    default_branch: string;
    private: boolean;
  }>;
}

export interface GitHubScanRequest {
  project_id: string;
  installation_id: number;
  owner: string;
  repo: string;
  branch: string;
  selected_rule_keys: string[];
  selected_rule_ids: string[];
}

export interface GitHubScanResponse {
  run_id: string;
  project_id: string;
  repository: string;
  default_branch: string;
  branch: string;
  files_analyzed: number;
  score: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_findings: number;
}

export interface ProjectCreate {
  name: string;
  description: string;
  repository_url: string;
  github_installation_id?: number;
  github_owner?: string;
  github_repo?: string;
  github_branch?: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  github_installation_id: number;
  github_owner: string;
  github_repo: string;
  github_branch: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectSeveritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ProjectScoreHistoryItem {
  run_id: string;
  score: number;
  status: string;
  completed_at: string;
}

export interface ProjectAnalyticsResponse {
  project_id: string;
  total_runs: number;
  latest_score: number;
  total_findings: number;
  severity: ProjectSeveritySummary;
  score_history: ProjectScoreHistoryItem[];
}

export interface ProjectLatestRunResponse {
  run_id: string;
  status: string;
  score: number;
  completed_at: string;
}

export interface ProjectOverviewAnalytics {
  total_runs: number;
  total_findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ProjectOverviewResponse {
  project_id: string;
  name: string;
  description: string;
  repository_url: string;
  latest_run: ProjectLatestRunResponse | null;
  analytics: ProjectOverviewAnalytics;
}

export interface RuleCatalogItem {
  key: string;
  name: string;
  description: string;
  source: string;
  category: string;
  severity: string;
  builtin: boolean;
  enabled: boolean;
}

export interface RuleCatalogResponse {
  rules: RuleCatalogItem[];
}

export interface CustomRuleCreate {
  project_id: string;
  rule_id: string;
  name: string;
  description: string;
  language: string;
  rule_type: string;
  category: string;
  severity: string;
  config: Record<string, unknown>;
  enabled?: boolean;
}

export interface CustomRuleUpdate {
  name?: string;
  description?: string;
  language?: string;
  rule_type?: string;
  category?: string;
  severity?: string;
  config?: Record<string, unknown>;
  enabled?: boolean;
}

export interface CustomRuleResponse {
  id: string;
  project_id: string;
  rule_id: string;
  name: string;
  description: string;
  language: string;
  rule_type: string;
  category: string;
  severity: string;
  config: Record<string, unknown>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiEndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  description?: string;
  tag: 'Runs' | 'Upload' | 'GitHub' | 'Projects' | 'Custom Rules' | 'Health';
  parameters?: Array<{
    name: string;
    in: 'path' | 'query';
    required: boolean;
    type: string;
    description?: string;
    default?: string | number | boolean;
  }>;
  requestBody?: {
    required?: boolean;
    contentType: string;
    example: Record<string, unknown> | string;
  };
  sampleResponse: Record<string, unknown> | string | unknown[];
}

