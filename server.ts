import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// ES Module dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store for server routes
interface FindingRecord {
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

interface RunRecord {
  run_id: string;
  project_id: string;
  status: string;
  score: number;
  started_at: string;
  completed_at: string;
  repository?: string;
  default_branch?: string;
  branch?: string;
  files_analyzed?: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_findings: number;
  findings: FindingRecord[];
}

interface ProjectRecord {
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

interface RuleRecord {
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

// Initial server data
const projectsDB: ProjectRecord[] = [
  {
    id: 'proj-001',
    name: 'cqt-core-engine',
    description: 'Core AST parser, static analyzer orchestration, and scoring pipeline.',
    repository_url: 'https://github.com/Dineshindiexpert/cqt-core-engine',
    github_installation_id: 49201,
    github_owner: 'Dineshindiexpert',
    github_repo: 'cqt-core-engine',
    github_branch: 'main',
    owner_id: 'user-01',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-09-22T08:30:00Z'
  },
  {
    id: 'proj-002',
    name: 'fastapi-backend-service',
    description: 'REST API service for user authentication, permissions, and webhook processing.',
    repository_url: 'https://github.com/Dineshindiexpert/fastapi-backend-service',
    github_installation_id: 49201,
    github_owner: 'Dineshindiexpert',
    github_repo: 'fastapi-backend-service',
    github_branch: 'main',
    owner_id: 'user-01',
    created_at: '2026-09-01T12:00:00Z',
    updated_at: '2026-09-21T16:00:00Z'
  },
  {
    id: 'proj-003',
    name: 'analyzer-plugins-pack',
    description: 'Custom AST inspection rules, FastAPI linters, and dependency CVE checks.',
    repository_url: 'https://github.com/Dineshindiexpert/analyzer-plugins-pack',
    github_installation_id: 49201,
    github_owner: 'Dineshindiexpert',
    github_repo: 'analyzer-plugins-pack',
    github_branch: 'main',
    owner_id: 'user-01',
    created_at: '2026-09-10T14:30:00Z',
    updated_at: '2026-09-22T02:00:00Z'
  }
];

const findingsDB: FindingRecord[] = [
  {
    id: 'find-001',
    run_id: 'run-86',
    rule_id: 'CQT-SEC-01',
    message: 'Hardcoded API secret token found in initialization string',
    severity: 'high',
    category: 'Security',
    file_path: 'src/services/auth.py',
    line_number: 42,
    column_number: 12,
    created_at: '2026-09-22T08:30:00Z'
  },
  {
    id: 'find-002',
    run_id: 'run-86',
    rule_id: 'FASTAPI-01',
    message: 'Missing response_model in router decorator, leaking internal schema fields',
    severity: 'medium',
    category: 'Bug',
    file_path: 'src/routes/projects.py',
    line_number: 118,
    column_number: 4,
    created_at: '2026-09-22T08:30:00Z'
  },
  {
    id: 'find-003',
    run_id: 'run-86',
    rule_id: 'BANDIT-B101',
    message: 'Use of assert detected; asserts are removed when compiling to optimized byte code',
    severity: 'low',
    category: 'Security',
    file_path: 'src/core/security.py',
    line_number: 89,
    column_number: 8,
    created_at: '2026-09-22T08:30:00Z'
  },
  {
    id: 'find-004',
    run_id: 'run-86',
    rule_id: 'RADON-CC',
    message: 'Function cyclomatic complexity exceeds threshold (score: 16, max: 10)',
    severity: 'medium',
    category: 'Complexity',
    file_path: 'src/orchestrator/pipeline.py',
    line_number: 210,
    column_number: 1,
    created_at: '2026-09-22T08:30:00Z'
  },
  {
    id: 'find-005',
    run_id: 'run-86',
    rule_id: 'PIP-AUDIT-03',
    message: 'Vulnerable dependency version: urllib3 < 2.0.7 (CVE-2023-45803)',
    severity: 'high',
    category: 'Dependency',
    file_path: 'requirements.txt',
    line_number: 14,
    column_number: 1,
    created_at: '2026-09-22T08:30:00Z'
  }
];

const runsDB: RunRecord[] = [
  {
    run_id: 'run-86',
    project_id: 'proj-001',
    status: 'completed',
    score: 84,
    started_at: '2026-09-22T08:29:45Z',
    completed_at: '2026-09-22T08:30:12Z',
    repository: 'Dineshindiexpert/cqt-core-engine',
    default_branch: 'main',
    branch: 'main',
    files_analyzed: 94,
    critical_count: 0,
    high_count: 2,
    medium_count: 7,
    low_count: 3,
    total_findings: 12,
    findings: findingsDB
  },
  {
    run_id: 'run-85',
    project_id: 'proj-001',
    status: 'completed',
    score: 89,
    started_at: '2026-09-21T18:14:00Z',
    completed_at: '2026-09-21T18:14:26Z',
    repository: 'Dineshindiexpert/cqt-core-engine',
    default_branch: 'main',
    branch: 'develop',
    files_analyzed: 91,
    critical_count: 0,
    high_count: 1,
    medium_count: 5,
    low_count: 2,
    total_findings: 8,
    findings: findingsDB.slice(0, 3)
  }
];

const rulesDB: RuleRecord[] = [
  {
    id: 'rule-001',
    project_id: 'proj-001',
    rule_id: 'CQT-SEC-01',
    name: 'Hardcoded Secret Detection',
    description: 'Detects hardcoded API keys, JWT tokens, AWS credentials and private keys.',
    language: 'Python',
    rule_type: 'regex',
    category: 'Security',
    severity: 'critical',
    config: {
      min_entropy: 4.5,
      keywords: ['secret', 'api_key', 'private_key', 'token']
    },
    enabled: true,
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'rule-002',
    project_id: 'proj-001',
    rule_id: 'FASTAPI-01',
    name: 'Missing Response Model in Router',
    description: 'Ensure all FastAPI endpoint route decorators specify an explicit response_model.',
    language: 'Python',
    rule_type: 'ast_pattern',
    category: 'Bug',
    severity: 'medium',
    config: {
      decorators: ['get', 'post', 'put', 'delete'],
      require_arg: 'response_model'
    },
    enabled: true,
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'rule-003',
    project_id: 'proj-001',
    rule_id: 'CUSTOM-AST-01',
    name: 'Disallow Raw SQL String Concatenation',
    description: 'Forbids string interpolation inside cursor.execute calls.',
    language: 'Python',
    rule_type: 'ast_pattern',
    category: 'Security',
    severity: 'high',
    config: {
      target_call: 'cursor.execute',
      disallowed_arg_types: ['FormattedValue', 'BinOp']
    },
    enabled: true,
    created_at: '2026-09-22T08:00:00Z',
    updated_at: '2026-09-22T08:00:00Z'
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger for API calls
  app.use((req, _res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path === '/openapi.json') {
      console.log(`[CQT API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ==========================================
  // Health & OpenAPI 3.1 Routes
  // ==========================================
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'cqt-engine',
      version: '0.1.0'
    });
  });

  app.get('/health/db', (_req: Request, res: Response) => {
    res.json({
      status: 'connected',
      database: 'postgresql',
      latency_ms: 1.2
    });
  });

  app.get('/openapi.json', async (_req: Request, res: Response) => {
    try {
      const openapiModule = await import('./src/openapiData.js').catch(() => import('./src/openapiData.ts'));
      res.json(openapiModule.OPENAPI_SPEC);
    } catch {
      res.json({
        openapi: '3.1.0',
        info: {
          title: 'CQT - Code Quality Tool',
          description: 'Configurable Code Quality Analysis Platform',
          version: '0.1.0'
        }
      });
    }
  });

  // ==========================================
  // Runs Endpoints
  // ==========================================

  // POST /api/runs/manual
  app.post('/api/runs/manual', (req: Request, res: Response) => {
    const { project_id, workspace_path, profile_path } = req.body;
    if (!project_id) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'project_id'], msg: 'field required', type: 'value_error.missing' }]
      });
    }

    const newRunId = `run-${Date.now().toString().slice(-4)}`;
    const manualFindings: FindingRecord[] = findingsDB.map(f => ({
      ...f,
      id: `find-${Math.random().toString(36).substring(2, 8)}`,
      run_id: newRunId
    }));

    const newRun: RunRecord = {
      run_id: newRunId,
      project_id,
      status: 'completed',
      score: 86,
      started_at: new Date(Date.now() - 15000).toISOString(),
      completed_at: new Date().toISOString(),
      critical_count: 0,
      high_count: 2,
      medium_count: 5,
      low_count: 3,
      total_findings: manualFindings.length,
      findings: manualFindings
    };

    runsDB.unshift(newRun);

    res.json({
      run_id: newRun.run_id,
      project_id: newRun.project_id,
      status: newRun.status,
      score: newRun.score,
      critical_count: newRun.critical_count,
      high_count: newRun.high_count,
      medium_count: newRun.medium_count,
      low_count: newRun.low_count,
      total_findings: newRun.total_findings,
      findings: manualFindings.map(f => ({
        rule_id: f.rule_id,
        message: f.message,
        severity: f.severity,
        category: f.category,
        file_path: f.file_path,
        line_number: f.line_number,
        column_number: f.column_number
      }))
    });
  });

  // POST /api/runs/ (Async Run)
  app.post('/api/runs/', (req: Request, res: Response) => {
    const { project_id } = req.body;
    if (!project_id) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'project_id'], msg: 'field required', type: 'value_error.missing' }]
      });
    }

    const newRunId = `run-${Date.now().toString().slice(-4)}`;
    const newRun: RunRecord = {
      run_id: newRunId,
      project_id,
      status: 'running',
      score: 0,
      started_at: new Date().toISOString(),
      completed_at: '',
      critical_count: 0,
      high_count: 0,
      medium_count: 0,
      low_count: 0,
      total_findings: 0,
      findings: []
    };

    runsDB.unshift(newRun);

    // Simulate completion after 3 seconds in memory
    setTimeout(() => {
      newRun.status = 'completed';
      newRun.score = 88;
      newRun.completed_at = new Date().toISOString();
      newRun.total_findings = 5;
      newRun.findings = findingsDB;
    }, 3000);

    res.json({
      run_id: newRun.run_id,
      project_id: newRun.project_id,
      status: newRun.status
    });
  });

  // GET /api/runs/:run_id/findings
  app.get('/api/runs/:run_id/findings', (req: Request, res: Response) => {
    const { run_id } = req.params;
    const { severity, category, rule_id, search, limit = '50', offset = '0' } = req.query;

    const run = runsDB.find(r => r.run_id === run_id);
    let results = run ? run.findings : findingsDB;

    if (severity) {
      results = results.filter(f => f.severity.toLowerCase() === String(severity).toLowerCase());
    }
    if (category) {
      results = results.filter(f => f.category.toLowerCase() === String(category).toLowerCase());
    }
    if (rule_id) {
      results = results.filter(f => f.rule_id.toLowerCase().includes(String(rule_id).toLowerCase()));
    }
    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(f => 
        f.message.toLowerCase().includes(q) || 
        f.file_path.toLowerCase().includes(q) || 
        f.rule_id.toLowerCase().includes(q)
      );
    }

    const numLimit = parseInt(String(limit), 10) || 50;
    const numOffset = parseInt(String(offset), 10) || 0;
    const paginated = results.slice(numOffset, numOffset + numLimit);

    res.json({
      run_id,
      total: results.length,
      limit: numLimit,
      offset: numOffset,
      findings: paginated
    });
  });

  // GET /api/runs/:run_id/details
  app.get('/api/runs/:run_id/details', (req: Request, res: Response) => {
    const { run_id } = req.params;
    const run = runsDB.find(r => r.run_id === run_id) || runsDB[0];

    res.json({
      run_id: run.run_id,
      project_id: run.project_id,
      status: run.status,
      score: run.score,
      started_at: run.started_at,
      completed_at: run.completed_at || new Date().toISOString(),
      summary: {
        total_findings: run.total_findings,
        critical: run.critical_count,
        high: run.high_count,
        medium: run.medium_count,
        low: run.low_count
      },
      findings: run.findings
    });
  });

  // GET /api/runs/:run_id (Status & Score)
  app.get('/api/runs/:run_id', (req: Request, res: Response) => {
    const { run_id } = req.params;
    const run = runsDB.find(r => r.run_id === run_id) || runsDB[0];

    res.json({
      run_id: run.run_id,
      project_id: run.project_id,
      status: run.status,
      score: run.score,
      started_at: run.started_at,
      completed_at: run.completed_at
    });
  });

  // POST /api/runs/github/public
  app.post('/api/runs/github/public', (req: Request, res: Response) => {
    const { project_id, repository_url } = req.body;
    if (!project_id || !repository_url) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'repository_url'], msg: 'field required', type: 'value_error.missing' }]
      });
    }

    const cleanRepo = repository_url.replace(/https?:\/\/github\.com\//, '');
    const newRunId = `run-${Date.now().toString().slice(-4)}`;

    const newRun: RunRecord = {
      run_id: newRunId,
      project_id,
      status: 'completed',
      repository: cleanRepo,
      default_branch: 'main',
      files_analyzed: 142,
      score: 87,
      started_at: new Date(Date.now() - 22000).toISOString(),
      completed_at: new Date().toISOString(),
      critical_count: 0,
      high_count: 1,
      medium_count: 4,
      low_count: 2,
      total_findings: 7,
      findings: findingsDB
    };

    runsDB.unshift(newRun);

    res.json({
      run_id: newRun.run_id,
      project_id: newRun.project_id,
      status: newRun.status,
      repository: newRun.repository,
      default_branch: newRun.default_branch,
      files_analyzed: newRun.files_analyzed,
      score: newRun.score,
      critical_count: newRun.critical_count,
      high_count: newRun.high_count,
      medium_count: newRun.medium_count,
      low_count: newRun.low_count,
      total_findings: newRun.total_findings
    });
  });

  // GET /api/runs/project/:project_id
  app.get('/api/runs/project/:project_id', (req: Request, res: Response) => {
    const { project_id } = req.params;
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
    const offset = Math.max(0, parseInt(String(req.query.offset || '0'), 10));

    const projectRuns = runsDB.filter(r => r.project_id === project_id);
    const paginated = projectRuns.slice(offset, offset + limit);

    res.json(paginated);
  });

  // ==========================================
  // Upload Endpoints
  // ==========================================
  app.post('/api/upload/zip', (req: Request, res: Response) => {
    const newRunId = `run-${Date.now().toString().slice(-4)}`;
    res.json({
      run_id: newRunId,
      filename: req.body?.filename || 'source-code.zip',
      status: 'completed'
    });
  });

  // ==========================================
  // GitHub Endpoints
  // ==========================================
  app.get('/api/github/pat/test', (req: Request, res: Response) => {
    const { owner, repo } = req.query;
    if (!owner || !repo) {
      return res.status(422).json({
        detail: [{ loc: ['query', 'owner'], msg: 'field required', type: 'value_error.missing' }]
      });
    }
    res.json(`Valid PAT access to ${owner}/${repo} (200 OK)`);
  });

  app.get('/api/github/pat/branches', (req: Request, res: Response) => {
    const { owner, repo } = req.query;
    if (!owner || !repo) {
      return res.status(422).json({
        detail: [{ loc: ['query', 'owner'], msg: 'field required', type: 'value_error.missing' }]
      });
    }
    res.json(['main', 'develop', 'feat/ast-engine-v2', 'fix/bandit-parser']);
  });

  app.get('/api/github/pat/tree', (req: Request, res: Response) => {
    const { owner, repo, branch = 'main' } = req.query;
    res.json([
      'src/',
      'src/main.py',
      'src/routes/',
      'src/routes/runs.py',
      'src/analyzers/',
      'src/analyzers/bandit.py',
      'src/analyzers/ast_custom.py',
      'requirements.txt',
      'README.md'
    ]);
  });

  app.get('/api/github/pat/source-test', (req: Request, res: Response) => {
    const { owner, repo, branch = 'main' } = req.query;
    res.json(`Repository source tree verified on branch ${branch}`);
  });

  app.post('/api/github/pat/scan', (req: Request, res: Response) => {
    const { project_id, owner, repo, branch, selected_rule_keys, selected_rule_ids } = req.body;
    res.json(`Scan initiated successfully for ${owner}/${repo}@${branch || 'main'} with ${selected_rule_keys?.length || 18} rules`);
  });

  app.get('/api/github/app/repositories', (req: Request, res: Response) => {
    const { installation_id } = req.query;
    if (!installation_id) {
      return res.status(422).json({
        detail: [{ loc: ['query', 'installation_id'], msg: 'field required', type: 'value_error.missing' }]
      });
    }

    res.json({
      repositories: [
        {
          owner: 'Dineshindiexpert',
          name: 'cqt-core-engine',
          full_name: 'Dineshindiexpert/cqt-core-engine',
          default_branch: 'main',
          private: false
        },
        {
          owner: 'Dineshindiexpert',
          name: 'fastapi-backend-service',
          full_name: 'Dineshindiexpert/fastapi-backend-service',
          default_branch: 'main',
          private: true
        },
        {
          owner: 'Dineshindiexpert',
          name: 'analyzer-plugins-pack',
          full_name: 'Dineshindiexpert/analyzer-plugins-pack',
          default_branch: 'main',
          private: false
        }
      ]
    });
  });

  app.get('/api/github/app/branches', (req: Request, res: Response) => {
    const { installation_id, owner, repo } = req.query;
    res.json({
      repository: `${owner}/${repo}`,
      branches: [
        { name: 'main' },
        { name: 'develop' },
        { name: 'release/v0.1.0' }
      ]
    });
  });

  app.post('/api/github/app/scan', (req: Request, res: Response) => {
    const { project_id, installation_id, owner, repo, branch, selected_rule_keys } = req.body;
    const newRunId = `run-${Date.now().toString().slice(-4)}`;

    const newRun: RunRecord = {
      run_id: newRunId,
      project_id,
      status: 'completed',
      repository: `${owner}/${repo}`,
      default_branch: 'main',
      branch: branch || 'main',
      files_analyzed: 94,
      score: 88,
      started_at: new Date(Date.now() - 18000).toISOString(),
      completed_at: new Date().toISOString(),
      critical_count: 0,
      high_count: 1,
      medium_count: 4,
      low_count: 2,
      total_findings: 7,
      findings: findingsDB
    };

    runsDB.unshift(newRun);

    res.json({
      run_id: newRun.run_id,
      project_id: newRun.project_id,
      repository: newRun.repository,
      default_branch: newRun.default_branch,
      branch: newRun.branch,
      files_analyzed: newRun.files_analyzed,
      score: newRun.score,
      critical_count: newRun.critical_count,
      high_count: newRun.high_count,
      medium_count: newRun.medium_count,
      low_count: newRun.low_count,
      total_findings: newRun.total_findings
    });
  });

  // ==========================================
  // Projects Endpoints
  // ==========================================
  app.get('/api/projects/', (_req: Request, res: Response) => {
    res.json(projectsDB);
  });

  app.post('/api/projects/', (req: Request, res: Response) => {
    const { name, description, repository_url, github_installation_id, github_owner, github_repo, github_branch } = req.body;
    if (!name || !description || !repository_url) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'name'], msg: 'field required', type: 'value_error.missing' }]
      });
    }

    const newProject: ProjectRecord = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      name,
      description,
      repository_url,
      github_installation_id: github_installation_id || 49201,
      github_owner: github_owner || 'Dineshindiexpert',
      github_repo: github_repo || name,
      github_branch: github_branch || 'main',
      owner_id: 'user-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    projectsDB.unshift(newProject);
    res.status(201).json(newProject);
  });

  app.get('/api/projects/:project_id/analytics', (req: Request, res: Response) => {
    const { project_id } = req.params;
    const projectRuns = runsDB.filter(r => r.project_id === project_id);
    const latestRun = projectRuns[0] || runsDB[0];

    res.json({
      project_id,
      total_runs: projectRuns.length || 8,
      latest_score: latestRun.score,
      total_findings: latestRun.total_findings,
      severity: {
        critical: latestRun.critical_count,
        high: latestRun.high_count,
        medium: latestRun.medium_count,
        low: latestRun.low_count
      },
      score_history: projectRuns.map(r => ({
        run_id: r.run_id,
        score: r.score,
        status: r.status,
        completed_at: r.completed_at
      }))
    });
  });

  app.get('/api/projects/:project_id/overview', (req: Request, res: Response) => {
    const { project_id } = req.params;
    const project = projectsDB.find(p => p.id === project_id) || projectsDB[0];
    const projectRuns = runsDB.filter(r => r.project_id === project_id);
    const latestRun = projectRuns[0] || runsDB[0];

    res.json({
      project_id: project.id,
      name: project.name,
      description: project.description,
      repository_url: project.repository_url,
      latest_run: {
        run_id: latestRun.run_id,
        status: latestRun.status,
        score: latestRun.score,
        completed_at: latestRun.completed_at
      },
      analytics: {
        total_runs: projectRuns.length || 8,
        total_findings: latestRun.total_findings,
        critical: latestRun.critical_count,
        high: latestRun.high_count,
        medium: latestRun.medium_count,
        low: latestRun.low_count
      }
    });
  });

  // ==========================================
  // Custom Rules Endpoints
  // ==========================================
  app.get('/api/rules/catalog', (req: Request, res: Response) => {
    const { project_id } = req.query;
    if (!project_id) {
      return res.status(422).json({
        detail: [{ loc: ['query', 'project_id'], msg: 'field required', type: 'value_error.missing' }]
      });
    }

    res.json({
      rules: [
        {
          key: 'CQT-SEC-01',
          name: 'Hardcoded Secret Detection',
          description: 'Detects hardcoded API keys, JWT tokens, AWS credentials and private keys.',
          source: 'Secrets',
          category: 'Security',
          severity: 'critical',
          builtin: true,
          enabled: true
        },
        {
          key: 'FASTAPI-01',
          name: 'Missing Response Model in Router',
          description: 'Ensure all FastAPI endpoint route decorators specify response_model.',
          source: 'FastAPI Rules',
          category: 'Bug',
          severity: 'medium',
          builtin: true,
          enabled: true
        },
        {
          key: 'BANDIT-B101',
          name: 'Assert Statement in Production Code',
          description: 'Detects assert statements that may be optimized out in bytecode.',
          source: 'Bandit',
          category: 'Security',
          severity: 'low',
          builtin: true,
          enabled: true
        },
        {
          key: 'RADON-CC',
          name: 'High Cyclomatic Complexity',
          description: 'Flags functions with McCabe complexity above configured threshold.',
          source: 'Radon',
          category: 'Complexity',
          severity: 'medium',
          builtin: true,
          enabled: true
        },
        {
          key: 'PIP-AUDIT',
          name: 'Known CVE Vulnerabilities in Dependencies',
          description: 'Checks PyPI dependencies against the OSV vulnerability database.',
          source: 'pip-audit',
          category: 'Dependency',
          severity: 'high',
          builtin: true,
          enabled: true
        },
        ...rulesDB.map(r => ({
          key: r.rule_id,
          name: r.name,
          description: r.description,
          source: 'Custom',
          category: r.category,
          severity: r.severity,
          builtin: false,
          enabled: r.enabled
        }))
      ]
    });
  });

  app.post('/api/rules', (req: Request, res: Response) => {
    const { project_id, rule_id, name, description, language, rule_type, category, severity, config, enabled = true } = req.body;
    if (!project_id || !rule_id || !name) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'rule_id'], msg: 'field required', type: 'value_error.missing' }]
      });
    }

    const newRule: RuleRecord = {
      id: `rule-${Date.now().toString().slice(-4)}`,
      project_id,
      rule_id,
      name,
      description,
      language: language || 'Python',
      rule_type: rule_type || 'ast_pattern',
      category: category || 'Custom',
      severity: severity || 'medium',
      config: config || {},
      enabled,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    rulesDB.unshift(newRule);
    res.status(201).json(newRule);
  });

  app.get('/api/rules', (req: Request, res: Response) => {
    const { project_id, enabled, language } = req.query;
    let list = [...rulesDB];

    if (project_id) {
      list = list.filter(r => r.project_id === project_id);
    }
    if (enabled !== undefined) {
      const isEnabled = enabled === 'true' || enabled === '1';
      list = list.filter(r => r.enabled === isEnabled);
    }
    if (language) {
      list = list.filter(r => r.language.toLowerCase() === String(language).toLowerCase());
    }

    res.json(list);
  });

  app.get('/api/rules/:rule_id', (req: Request, res: Response) => {
    const { rule_id } = req.params;
    const rule = rulesDB.find(r => r.id === rule_id || r.rule_id === rule_id);
    if (!rule) {
      return res.status(404).json({ detail: 'Rule not found' });
    }
    res.json(rule);
  });

  app.put('/api/rules/:rule_id', (req: Request, res: Response) => {
    const { rule_id } = req.params;
    const ruleIndex = rulesDB.findIndex(r => r.id === rule_id || r.rule_id === rule_id);
    if (ruleIndex === -1) {
      return res.status(404).json({ detail: 'Rule not found' });
    }

    const current = rulesDB[ruleIndex];
    const updated: RuleRecord = {
      ...current,
      ...req.body,
      updated_at: new Date().toISOString()
    };

    rulesDB[ruleIndex] = updated;
    res.json(updated);
  });

  app.delete('/api/rules/:rule_id', (req: Request, res: Response) => {
    const { rule_id } = req.params;
    const idx = rulesDB.findIndex(r => r.id === rule_id || r.rule_id === rule_id);
    if (idx !== -1) {
      rulesDB.splice(idx, 1);
    }
    res.status(204).send();
  });

  app.patch('/api/rules/:rule_id/enable', (req: Request, res: Response) => {
    const { rule_id } = req.params;
    const rule = rulesDB.find(r => r.id === rule_id || r.rule_id === rule_id);
    if (!rule) {
      return res.status(404).json({ detail: 'Rule not found' });
    }
    rule.enabled = true;
    rule.updated_at = new Date().toISOString();
    res.json(rule);
  });

  app.patch('/api/rules/:rule_id/disable', (req: Request, res: Response) => {
    const { rule_id } = req.params;
    const rule = rulesDB.find(r => r.id === rule_id || r.rule_id === rule_id);
    if (!rule) {
      return res.status(404).json({ detail: 'Rule not found' });
    }
    rule.enabled = false;
    rule.updated_at = new Date().toISOString();
    res.json(rule);
  });

  // ==========================================
  // Vite Integration (SPA Fallback)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CQT Platform] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
