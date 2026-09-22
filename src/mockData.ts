import { Project, Run, Finding, Rule, GitHubRepository, GitHubAppInstallation } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'CQT Backend',
    description: 'Core REST API and analysis engine for Code Quality Tool built with FastAPI & Celery.',
    repository: 'Dineshindiexpert/int-code-quality-api',
    default_branch: 'dev',
    source_type: 'github_app',
    latest_score: 82,
    findings_count: 34,
    last_scan: '2 hours ago',
    status: 'Completed',
    created_at: '2026-08-10T14:30:00Z',
    severity_counts: {
      critical: 0,
      high: 8,
      medium: 26,
      low: 4
    }
  },
  {
    id: 'proj-002',
    name: 'TaskPulse',
    description: 'Real-time task orchestration and asynchronous queue processing microservice.',
    repository: 'Dineshindiexpert/task-pulse',
    default_branch: 'main',
    source_type: 'github_app',
    latest_score: 82,
    findings_count: 34,
    last_scan: '2 hours ago',
    status: 'Completed',
    created_at: '2026-08-14T09:15:00Z',
    severity_counts: {
      critical: 0,
      high: 6,
      medium: 22,
      low: 6
    }
  },
  {
    id: 'proj-003',
    name: 'AI Klarity',
    description: 'High-throughput LLM evaluation and latency benchmarking pipeline.',
    repository: 'Dineshindiexpert/ai-klarity',
    default_branch: 'master',
    source_type: 'github_app',
    latest_score: 91,
    findings_count: 12,
    last_scan: 'Yesterday',
    status: 'Completed',
    created_at: '2026-08-18T11:00:00Z',
    severity_counts: {
      critical: 0,
      high: 1,
      medium: 7,
      low: 4
    }
  },
  {
    id: 'proj-004',
    name: 'AuthGateway',
    description: 'Central OAuth2 and JWT token verification proxy with Redis token revoking.',
    repository: 'Dineshindiexpert/auth-gateway',
    default_branch: 'main',
    source_type: 'github_public',
    latest_score: 76,
    findings_count: 58,
    last_scan: '3 days ago',
    status: 'Completed',
    created_at: '2026-07-22T16:45:00Z',
    severity_counts: {
      critical: 2,
      high: 14,
      medium: 32,
      low: 10
    }
  },
  {
    id: 'proj-005',
    name: 'DataPipeline Py',
    description: 'Distributed ETL streaming processor built on top of Apache Arrow and PySpark.',
    repository: 'Dineshindiexpert/data-pipeline-py',
    default_branch: 'main',
    source_type: 'github_pat',
    latest_score: 88,
    findings_count: 19,
    last_scan: '5 days ago',
    status: 'Completed',
    created_at: '2026-07-30T10:20:00Z',
    severity_counts: {
      critical: 0,
      high: 3,
      medium: 12,
      low: 4
    }
  }
];

export const INITIAL_RUNS: Run[] = [
  {
    id: 'run-86',
    project_id: 'proj-001',
    project_name: 'CQT Backend',
    repository: 'Dineshindiexpert/int-code-quality-api',
    branch: 'dev',
    score: 82,
    findings_count: 34,
    status: 'completed',
    started_at: '2 hours ago',
    completed_at: '1h 58m ago',
    duration_seconds: 128,
    source_type: 'GitHub App',
    rules_count: 18,
    files_analyzed: 142,
    severity_counts: {
      critical: 0,
      high: 8,
      medium: 26,
      low: 4
    }
  },
  {
    id: 'run-85',
    project_id: 'proj-001',
    project_name: 'CQT Backend',
    repository: 'Dineshindiexpert/int-code-quality-api',
    branch: 'feature/fastapi-v2',
    score: 78,
    findings_count: 42,
    status: 'completed',
    started_at: 'Yesterday at 17:40',
    completed_at: 'Yesterday at 17:42',
    duration_seconds: 145,
    source_type: 'GitHub App',
    rules_count: 18,
    files_analyzed: 140,
    severity_counts: {
      critical: 0,
      high: 11,
      medium: 27,
      low: 4
    }
  },
  {
    id: 'run-84',
    project_id: 'proj-001',
    project_name: 'CQT Backend',
    repository: 'Dineshindiexpert/int-code-quality-api',
    branch: 'dev',
    score: 71,
    findings_count: 53,
    status: 'completed',
    started_at: '3 days ago',
    completed_at: '3 days ago',
    duration_seconds: 139,
    source_type: 'GitHub App',
    rules_count: 18,
    files_analyzed: 136,
    severity_counts: {
      critical: 1,
      high: 14,
      medium: 32,
      low: 6
    }
  },
  {
    id: 'run-83',
    project_id: 'proj-001',
    project_name: 'CQT Backend',
    repository: 'Dineshindiexpert/int-code-quality-api',
    branch: 'dev',
    score: 68,
    findings_count: 61,
    status: 'completed',
    started_at: '5 days ago',
    completed_at: '5 days ago',
    duration_seconds: 152,
    source_type: 'GitHub App',
    rules_count: 16,
    files_analyzed: 132,
    severity_counts: {
      critical: 1,
      high: 17,
      medium: 36,
      low: 7
    }
  },
  {
    id: 'run-82',
    project_id: 'proj-001',
    project_name: 'CQT Backend',
    repository: 'Dineshindiexpert/int-code-quality-api',
    branch: 'main',
    score: 62,
    findings_count: 74,
    status: 'completed',
    started_at: '1 week ago',
    completed_at: '1 week ago',
    duration_seconds: 164,
    source_type: 'GitHub App',
    rules_count: 14,
    files_analyzed: 128,
    severity_counts: {
      critical: 2,
      high: 22,
      medium: 41,
      low: 9
    }
  },
  {
    id: 'run-81',
    project_id: 'proj-002',
    project_name: 'TaskPulse',
    repository: 'Dineshindiexpert/task-pulse',
    branch: 'main',
    score: 82,
    findings_count: 34,
    status: 'completed',
    started_at: '4 hours ago',
    completed_at: '3h 58m ago',
    duration_seconds: 112,
    source_type: 'GitHub App',
    rules_count: 18,
    files_analyzed: 94,
    severity_counts: {
      critical: 0,
      high: 6,
      medium: 22,
      low: 6
    }
  },
  {
    id: 'run-80',
    project_id: 'proj-003',
    project_name: 'AI Klarity',
    repository: 'Dineshindiexpert/ai-klarity',
    branch: 'master',
    score: 91,
    findings_count: 12,
    status: 'completed',
    started_at: 'Yesterday',
    completed_at: 'Yesterday',
    duration_seconds: 86,
    source_type: 'GitHub App',
    rules_count: 22,
    files_analyzed: 68,
    severity_counts: {
      critical: 0,
      high: 1,
      medium: 7,
      low: 4
    }
  }
];

export const INITIAL_RULES: Rule[] = [
  {
    id: 'rule-e501',
    rule_id: 'E501',
    name: 'Line too long',
    description: 'Line length exceeds the configured limit (standard 88 or 120 characters).',
    category: 'Style',
    severity: 'medium',
    source: 'Ruff',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-f401',
    rule_id: 'F401',
    name: 'Unused import',
    description: 'Module imported but unused in source code, leading to unnecessary memory overhead.',
    category: 'Bug',
    severity: 'medium',
    source: 'Ruff',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-f821',
    rule_id: 'F821',
    name: 'Undefined name',
    description: 'Referencing a variable or symbol that is not defined in scope.',
    category: 'Bug',
    severity: 'high',
    source: 'Ruff',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-b101',
    rule_id: 'B101',
    name: 'Use of assert',
    description: 'Use of assert detected. The assert statement is removed when compiled to optimized bytecode (-O).',
    category: 'Security',
    severity: 'high',
    source: 'Bandit',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-s105',
    rule_id: 'S105',
    name: 'Hardcoded password string',
    description: 'Possible hardcoded secret or token assignment detected in source assignment.',
    category: 'Security',
    severity: 'critical',
    source: 'Bandit',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-b904',
    rule_id: 'B904',
    name: 'Raise without from in except',
    description: 'Raise without `from err` inside except block obscures original traceback context.',
    category: 'Bug',
    severity: 'high',
    source: 'Ruff',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-radon-cc',
    rule_id: 'RADON-CC',
    name: 'Cyclomatic complexity',
    description: 'Function complexity score exceeds threshold (rank D/E/F), indicating high maintenance risk.',
    category: 'Complexity',
    severity: 'medium',
    source: 'Radon',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-radon-mi',
    rule_id: 'RADON-MI',
    name: 'Maintainability Index low',
    description: 'Maintainability Index score is under acceptable limit (< 20).',
    category: 'Complexity',
    severity: 'medium',
    source: 'Radon',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-duplicate-code',
    rule_id: 'DUPLICATE-CODE',
    name: 'Duplicate code detected',
    description: 'Similar code tokens replicated across multiple modules, violating DRY principles.',
    category: 'Code Smell',
    severity: 'medium',
    source: 'CQT',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-fastapi-007',
    rule_id: 'FASTAPI-007',
    name: 'Missing response_model in router endpoint',
    description: 'FastAPI route declared without explicit response_model, risking unintended data leakage.',
    category: 'FastAPI',
    severity: 'medium',
    source: 'FastAPI Rules',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-fastapi-012',
    rule_id: 'FASTAPI-012',
    name: 'Synchronous blocking IO in async endpoint',
    description: 'Calling blocking functions (e.g. requests.get, time.sleep) directly inside async def endpoints.',
    category: 'FastAPI',
    severity: 'high',
    source: 'FastAPI Rules',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-sec-secret-001',
    rule_id: 'SEC-SECRET-001',
    name: 'High entropy private key or token',
    description: 'High entropy string pattern matched known cloud provider API credentials.',
    category: 'Security',
    severity: 'critical',
    source: 'Secrets',
    language: 'All',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-pip-audit',
    rule_id: 'PIP-AUDIT',
    name: 'Known vulnerability in dependency',
    description: 'Installed package matches CVE advisory in PyPA advisory database.',
    category: 'Dependency',
    severity: 'high',
    source: 'pip-audit',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-b301',
    rule_id: 'B301',
    name: 'Pickle deserialization security risk',
    description: 'Pickle and modules that wrap it are unsafe when handling untrusted data.',
    category: 'Security',
    severity: 'critical',
    source: 'Bandit',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-b608',
    rule_id: 'B608',
    name: 'Hardcoded SQL string formatting',
    description: 'Possible SQL injection vector via raw string interpolation into query statement.',
    category: 'Security',
    severity: 'critical',
    source: 'Bandit',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-w291',
    rule_id: 'W291',
    name: 'Trailing whitespace',
    description: 'Trailing whitespace found at the end of code line.',
    category: 'Style',
    severity: 'low',
    source: 'Ruff',
    language: 'Python',
    enabled: true,
    is_custom: false
  },
  {
    id: 'rule-cqt-custom-01',
    rule_id: 'CUSTOM-PY-01',
    name: 'Prohibit print() statements in production',
    description: 'Project rule enforcing structured logging via logger instead of built-in print calls.',
    category: 'Custom',
    severity: 'medium',
    source: 'Custom',
    language: 'Python',
    enabled: true,
    is_custom: true,
    project_id: 'proj-001',
    rule_type: 'ast_pattern',
    configuration: '{\n  "target_node": "Call",\n  "func_name": "print",\n  "message": "Use logger.info() or logger.debug() instead of raw print()"\n}'
  },
  {
    id: 'rule-cqt-custom-02',
    rule_id: 'CUSTOM-FASTAPI-02',
    name: 'Enforce status_code parameter on POST routes',
    description: 'All @router.post handlers must declare explicit status_code=status.HTTP_201_CREATED.',
    category: 'Custom',
    severity: 'medium',
    source: 'Custom',
    language: 'Python',
    enabled: true,
    is_custom: true,
    project_id: 'proj-001',
    rule_type: 'ast_pattern',
    configuration: '{\n  "decorator": "router.post",\n  "required_kwargs": ["status_code"]\n}'
  },
  {
    id: 'rule-cqt-custom-03',
    rule_id: 'CUSTOM-SEC-03',
    name: 'Internal service token header format verification',
    description: 'Validate authorization headers against internal company format token schema.',
    category: 'Custom',
    severity: 'high',
    source: 'Custom',
    language: 'Python',
    enabled: true,
    is_custom: true,
    project_id: 'proj-001',
    rule_type: 'regex',
    configuration: '{\n  "pattern": "X-Internal-Token:\\\\s*[A-Za-z0-9_-]{32,}",\n  "scope": "headers"\n}'
  }
];

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'find-101',
    run_id: 'run-86',
    rule_id: 'B904',
    rule_name: 'Raise without from',
    severity: 'high',
    category: 'Bug',
    source: 'Ruff',
    message: 'Use raise ... from err',
    file: 'app/services/user.py',
    line: 84,
    column: 12,
    highlight_line: 84,
    snippet: `81 | def fetch_user_profile(user_id: str) -> UserProfile:\n82 |     try:\n83 |         raw = db.query(UserModel).filter_by(id=user_id).one()\n84 |         raise HTTPException(status_code=404, detail="User record missing")\n85 |     except NoResultFound as exc:\n86 |         logger.warning(f"Lookup failure for user: {user_id}")\n87 |         raise HTTPException(status_code=404, detail="Not Found")`,
    why_it_matters: 'When an exception is caught and another is raised without using the `from err` syntax, the original traceback context is masked or duplicated unpredictably, making root-cause debugging significantly harder in production monitoring.',
    recommended_fix: 'Change `raise HTTPException(...)` to `raise HTTPException(...) from exc` so Python links the exception causes explicitly.',
    cwe: 'CWE-703: Improper Check or Handling of Exceptional Conditions'
  },
  {
    id: 'find-102',
    run_id: 'run-86',
    rule_id: 'E501',
    rule_name: 'Line too long',
    severity: 'medium',
    category: 'Style',
    source: 'Ruff',
    message: 'Line too long (128 > 100 characters)',
    file: 'app/api/routes.py',
    line: 129,
    column: 5,
    highlight_line: 129,
    snippet: `127 | @router.get("/metrics/aggregate", response_model=AggregateMetricsResponse)\n128 | async def get_aggregate_metrics(start_date: datetime, end_date: datetime, group_by: Optional[str] = "day"):\n129 |     results = await metrics_service.compute_time_series_aggregations(start_date=start_date, end_date=end_date, grouping=group_by, include_zero_fills=True)\n130 |     return {"items": results, "total": len(results)}`,
    why_it_matters: 'Excessively long lines impair code readability on split-screen editors and standard code review tooling.',
    recommended_fix: 'Break method parameters across multiple formatted lines using Ruff/Black formatting standards.'
  },
  {
    id: 'find-103',
    run_id: 'run-86',
    rule_id: 'B101',
    rule_name: 'Use of assert',
    severity: 'high',
    category: 'Security',
    source: 'Bandit',
    message: 'Use of assert detected. Python optimizes away assert statements when run with -O flags.',
    file: 'app/core/security.py',
    line: 42,
    column: 5,
    highlight_line: 42,
    snippet: `40 | def verify_jwt_payload_scope(payload: dict, required_scope: str) -> bool:\n41 |     scopes = payload.get("scopes", [])\n42 |     assert required_scope in scopes, "Unauthorized scope access"\n43 |     return True`,
    why_it_matters: 'Assert statements are strictly designed for internal testing invariants. In optimized production execution (`python -O`), asserts are compiled out completely, entirely bypassing authorization checks.',
    recommended_fix: 'Replace assert with explicit `if required_scope not in scopes: raise PermissionDeniedError()`.',
    cwe: 'CWE-617: Reachable Assertion'
  },
  {
    id: 'find-104',
    run_id: 'run-86',
    rule_id: 'FASTAPI-007',
    rule_name: 'Missing response_model',
    severity: 'medium',
    category: 'FastAPI',
    source: 'FastAPI Rules',
    message: 'Missing response_model declaration on router endpoint',
    file: 'app/api/v1/auth.py',
    line: 38,
    column: 1,
    highlight_line: 38,
    snippet: `36 | @router.post("/login")\n37 | async def login_endpoint(credentials: OAuth2PasswordRequestForm = Depends()):\n38 |     user = authenticate_user(credentials.username, credentials.password)\n39 |     token = create_access_token(data={"sub": user.email})\n40 |     return {"access_token": token, "token_type": "bearer", "user": user.dict()}`,
    why_it_matters: 'Without an explicit Pydantic response_model, sensitive internal fields (e.g. hashed_password or salt in user object) can accidentally be serialized to the public API client.',
    recommended_fix: 'Add `response_model=TokenResponse` to the `@router.post` decorator and filter returned fields.'
  },
  {
    id: 'find-105',
    run_id: 'run-86',
    rule_id: 'RADON-CC',
    rule_name: 'High cyclomatic complexity',
    severity: 'medium',
    category: 'Complexity',
    source: 'Radon',
    message: 'Function `analyze_file_ast` has cyclomatic complexity score of 16 (Rank D)',
    file: 'app/services/analyzer.py',
    line: 115,
    column: 1,
    highlight_line: 115,
    snippet: `113 | def analyze_file_ast(file_path: Path, rules_config: dict):\n114 |     tree = ast.parse(file_path.read_text())\n115 |     for node in ast.walk(tree):\n116 |         if isinstance(node, ast.FunctionDef):\n117 |             if node.name.startswith("test_"):\n118 |                 continue`,
    why_it_matters: 'High cyclomatic complexity indicates branching logic that is difficult to unit test and susceptible to edge-case bugs.',
    recommended_fix: 'Refactor complex nested loops into dedicated sub-visitor methods using Python `ast.NodeVisitor` pattern.'
  },
  {
    id: 'find-106',
    run_id: 'run-86',
    rule_id: 'DUPLICATE-CODE',
    rule_name: 'Duplicate code detected',
    severity: 'medium',
    category: 'Code Smell',
    source: 'CQT',
    message: 'Duplicate block of 28 lines detected in 2 files (app/utils/serializers.py and app/utils/dto.py)',
    file: 'app/utils/serializers.py',
    line: 64,
    column: 1,
    highlight_line: 64,
    snippet: `62 | def serialize_error_envelope(code: str, message: str, details: list) -> dict:\n63 |     timestamp = datetime.utcnow().isoformat() + "Z"\n64 |     return {\n65 |         "error": {\n66 |             "code": code,\n67 |             "message": message,\n68 |             "timestamp": timestamp,\n69 |             "details": details or []\n70 |         }\n71 |     }`,
    why_it_matters: 'Duplicated code increases maintenance burden since bug fixes applied in one location are frequently missed in copies.',
    recommended_fix: 'Extract shared serialization dictionary mapping into a single helper module.'
  },
  {
    id: 'find-107',
    run_id: 'run-86',
    rule_id: 'F401',
    rule_name: 'Unused import',
    severity: 'low',
    category: 'Style',
    source: 'Ruff',
    message: '`os` imported but unused',
    file: 'app/core/config.py',
    line: 4,
    column: 8,
    highlight_line: 4,
    snippet: `2 | from typing import List, Optional\n3 | import sys\n4 | import os\n5 | from pydantic_settings import BaseSettings`,
    why_it_matters: 'Unused imports clutter modules and can occasionally trigger unexpected top-level import side effects.',
    recommended_fix: 'Remove `import os`.'
  },
  {
    id: 'find-108',
    run_id: 'run-86',
    rule_id: 'CUSTOM-PY-01',
    rule_name: 'Prohibit print() statements in production',
    severity: 'medium',
    category: 'Custom',
    source: 'Custom',
    message: 'Use logger.info() or logger.debug() instead of raw print() statement',
    file: 'app/tasks/worker.py',
    line: 92,
    column: 9,
    highlight_line: 92,
    snippet: `90 | def process_task_batch(batch_id: str):\n91 |     items = queue.pop_batch(batch_id)\n92 |     print(f"DEBUG: Processing {len(items)} items for batch {batch_id}")\n93 |     for item in items:\n94 |         execute_item(item)`,
    why_it_matters: 'Raw print statements do not write to structured log streams (JSON / CloudWatch / Datadog) and cannot be filtered by severity levels.',
    recommended_fix: 'Replace `print(...)` with `logger.debug(...)`.'
  }
];

export const MOCK_GITHUB_INSTALLATION: GitHubAppInstallation = {
  id: 162474301,
  account_name: 'Dineshindiexpert',
  installed_at: '2026-03-12T10:00:00Z',
  target_type: 'User',
  repositories_count: 5
};

export const MOCK_GITHUB_REPOSITORIES: GitHubRepository[] = [
  {
    owner: 'Dineshindiexpert',
    name: 'int-code-quality-api',
    full_name: 'Dineshindiexpert/int-code-quality-api',
    default_branch: 'dev',
    private: true,
    language: 'Python',
    updated_at: '2026-09-22T08:30:00Z'
  },
  {
    owner: 'Dineshindiexpert',
    name: 'task-pulse',
    full_name: 'Dineshindiexpert/task-pulse',
    default_branch: 'main',
    private: false,
    language: 'Python',
    updated_at: '2026-09-21T18:45:00Z'
  },
  {
    owner: 'Dineshindiexpert',
    name: 'ai-klarity',
    full_name: 'Dineshindiexpert/ai-klarity',
    default_branch: 'master',
    private: true,
    language: 'Python',
    updated_at: '2026-09-20T12:00:00Z'
  },
  {
    owner: 'Dineshindiexpert',
    name: 'auth-gateway',
    full_name: 'Dineshindiexpert/auth-gateway',
    default_branch: 'main',
    private: false,
    language: 'Python',
    updated_at: '2026-09-18T14:20:00Z'
  },
  {
    owner: 'Dineshindiexpert',
    name: 'data-pipeline-py',
    full_name: 'Dineshindiexpert/data-pipeline-py',
    default_branch: 'main',
    private: true,
    language: 'Python',
    updated_at: '2026-09-15T09:10:00Z'
  }
];

export const MOCK_PROJECT_ANALYTICS: Record<string, Array<{ run_id: string; score: number; date: string; findings: number }>> = {
  'proj-001': [
    { run_id: 'run-82', score: 62, date: 'Sep 15', findings: 74 },
    { run_id: 'run-83', score: 68, date: 'Sep 17', findings: 61 },
    { run_id: 'run-84', score: 71, date: 'Sep 19', findings: 53 },
    { run_id: 'run-85', score: 78, date: 'Sep 21', findings: 42 },
    { run_id: 'run-86', score: 82, date: 'Today', findings: 34 }
  ],
  'proj-002': [
    { run_id: 'run-75', score: 70, date: 'Sep 14', findings: 52 },
    { run_id: 'run-77', score: 75, date: 'Sep 18', findings: 44 },
    { run_id: 'run-81', score: 82, date: 'Today', findings: 34 }
  ],
  'proj-003': [
    { run_id: 'run-70', score: 84, date: 'Sep 12', findings: 24 },
    { run_id: 'run-74', score: 88, date: 'Sep 16', findings: 18 },
    { run_id: 'run-80', score: 91, date: 'Yesterday', findings: 12 }
  ]
};

export const MOCK_PROJECTS = INITIAL_PROJECTS;
export const MOCK_RUNS = INITIAL_RUNS;
export const MOCK_RULES = INITIAL_RULES;
export const MOCK_FINDINGS = INITIAL_FINDINGS;

