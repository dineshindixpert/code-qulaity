import { ApiEndpointSpec } from './types';

export const OPENAPI_SPEC = {
  openapi: "3.1.0",
  info: {
    title: "CQT - Code Quality Tool",
    description: "Configurable Code Quality Analysis Platform",
    version: "0.1.0"
  },
  paths: {
    "/api/runs/manual": {
      post: {
        tags: ["Runs"],
        summary: "Create Manual Run",
        description: "Run a synchronous code-quality analysis.",
        operationId: "create_manual_run_api_runs_manual_post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ManualRunRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ManualRunResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/runs/": {
      post: {
        tags: ["Runs"],
        summary: "Create Async Run",
        description: "Create an asynchronous code-quality analysis run.",
        operationId: "create_async_run_api_runs__post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AsyncRunRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AsyncRunResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/runs/{run_id}/findings": {
      get: {
        tags: ["Runs"],
        summary: "Get Run Findings",
        description: "Get findings for a run with filtering, searching and pagination.",
        operationId: "get_run_findings_api_runs__run_id__findings_get",
        parameters: [
          { name: "run_id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "severity", in: "query", required: false, schema: { type: "string" } },
          { name: "category", in: "query", required: false, schema: { type: "string" } },
          { name: "rule_id", in: "query", required: false, schema: { type: "string" } },
          { name: "search", in: "query", required: false, schema: { type: "string" } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", default: 50 } },
          { name: "offset", in: "query", required: false, schema: { type: "integer", default: 0 } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RunFindingsResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/runs/{run_id}/details": {
      get: {
        tags: ["Runs"],
        summary: "Get Run Details",
        description: "Get complete details of a code-quality analysis run.",
        operationId: "get_run_details_api_runs__run_id__details_get",
        parameters: [
          { name: "run_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RunDetailsResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/runs/{run_id}": {
      get: {
        tags: ["Runs"],
        summary: "Get Run Status",
        description: "Get the current status and score of a run.",
        operationId: "get_run_status_api_runs__run_id__get",
        parameters: [
          { name: "run_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RunStatusResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/runs/github/public": {
      post: {
        tags: ["Runs"],
        summary: "Create Public Github Run",
        description: "Run code-quality analysis against a public GitHub repository.",
        operationId: "create_public_github_run_api_runs_github_public_post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PublicGitHubRunRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PublicGitHubRunResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/runs/project/{project_id}": {
      get: {
        tags: ["Runs"],
        summary: "List Project Runs",
        operationId: "list_project_runs_api_runs_project__project_id__get",
        parameters: [
          { name: "project_id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", default: 20, minimum: 1, maximum: 100 } },
          { name: "offset", in: "query", required: false, schema: { type: "integer", default: 0, minimum: 0 } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/RunDetailsResponse" }
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/upload/zip": {
      post: {
        tags: ["Upload"],
        summary: "Upload Zip",
        operationId: "upload_zip_api_upload_zip_post",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["project_id", "file"],
                properties: {
                  project_id: { type: "string", format: "uuid" },
                  file: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UploadRunResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/pat/test": {
      get: {
        tags: ["GitHub"],
        summary: "Test Github Pat",
        operationId: "test_github_pat_api_github_pat_test_get",
        parameters: [
          { name: "owner", in: "query", required: true, schema: { type: "string" } },
          { name: "repo", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: { type: "string" }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/pat/branches": {
      get: {
        tags: ["GitHub"],
        summary: "List Github Pat Branches",
        operationId: "list_github_pat_branches_api_github_pat_branches_get",
        parameters: [
          { name: "owner", in: "query", required: true, schema: { type: "string" } },
          { name: "repo", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/pat/tree": {
      get: {
        tags: ["GitHub"],
        summary: "Get Github Pat Tree",
        operationId: "get_github_pat_tree_api_github_pat_tree_get",
        parameters: [
          { name: "owner", in: "query", required: true, schema: { type: "string" } },
          { name: "repo", in: "query", required: true, schema: { type: "string" } },
          { name: "branch", in: "query", required: false, schema: { type: "string", default: "main" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/pat/source-test": {
      get: {
        tags: ["GitHub"],
        summary: "Test Github Pat Source",
        operationId: "test_github_pat_source_api_github_pat_source_test_get",
        parameters: [
          { name: "owner", in: "query", required: true, schema: { type: "string" } },
          { name: "repo", in: "query", required: true, schema: { type: "string" } },
          { name: "branch", in: "query", required: false, schema: { type: "string", default: "main" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: { type: "string" }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/pat/scan": {
      post: {
        tags: ["GitHub"],
        summary: "Scan Github Repository With Pat",
        description: "Scan a GitHub repository using the configured GitHub PAT. The actual analysis is performed by GitHubScanService. PAT is only used as the GitHub source/authentication method.",
        operationId: "scan_github_repository_with_pat_api_github_pat_scan_post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GitHubPATScanRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: { type: "string" }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/app/repositories": {
      get: {
        tags: ["GitHub"],
        summary: "List Github App Repositories",
        operationId: "list_github_app_repositories_api_github_app_repositories_get",
        parameters: [
          { name: "installation_id", in: "query", required: true, schema: { type: "integer" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GitHubRepositoryListResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/app/branches": {
      get: {
        tags: ["GitHub"],
        summary: "List Github App Branches",
        operationId: "list_github_app_branches_api_github_app_branches_get",
        parameters: [
          { name: "installation_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "owner", in: "query", required: true, schema: { type: "string" } },
          { name: "repo", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GitHubBranchListResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/github/app/scan": {
      post: {
        tags: ["GitHub"],
        summary: "Scan Github Repository With App",
        description: "Scan a repository the GitHub App installation has access to. Unlike the PAT flow and public flow, this uses a short-lived per-installation token.",
        operationId: "scan_github_repository_with_app_api_github_app_scan_post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GitHubScanRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GitHubScanResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/projects/": {
      get: {
        tags: ["Projects"],
        summary: "List Projects",
        description: "Get all projects.",
        operationId: "list_projects_api_projects__get",
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ProjectResponse" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Projects"],
        summary: "Create Project",
        description: "Create a new project. Authentication is not implemented yet. For development, the first available user is used as the project owner.",
        operationId: "create_project_api_projects__post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProjectCreate"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProjectResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/projects/{project_id}/analytics": {
      get: {
        tags: ["Projects"],
        summary: "Get Project Analytics",
        description: "Get analytics and scan history for a project.",
        operationId: "get_project_analytics_api_projects__project_id__analytics_get",
        parameters: [
          { name: "project_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProjectAnalyticsResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/projects/{project_id}/overview": {
      get: {
        tags: ["Projects"],
        summary: "Get Project Overview",
        description: "Get project information and latest analysis summary.",
        operationId: "get_project_overview_api_projects__project_id__overview_get",
        parameters: [
          { name: "project_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProjectOverviewResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/rules/catalog": {
      get: {
        tags: ["Custom Rules"],
        summary: "Get Rule Catalog",
        operationId: "get_rule_catalog_api_rules_catalog_get",
        parameters: [
          { name: "project_id", in: "query", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RuleCatalogResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/rules": {
      get: {
        tags: ["Custom Rules"],
        summary: "List Rules",
        operationId: "list_rules_api_rules_get",
        parameters: [
          { name: "project_id", in: "query", required: false, schema: { type: "string", format: "uuid" } },
          { name: "enabled", in: "query", required: false, schema: { type: "boolean" } },
          { name: "language", in: "query", required: false, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CustomRuleResponse" }
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Custom Rules"],
        summary: "Create Rule",
        operationId: "create_rule_api_rules_post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CustomRuleCreate"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomRuleResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/rules/{rule_id}": {
      get: {
        tags: ["Custom Rules"],
        summary: "Get Rule",
        operationId: "get_rule_api_rules__rule_id__get",
        parameters: [
          { name: "rule_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomRuleResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["Custom Rules"],
        summary: "Update Rule",
        operationId: "update_rule_api_rules__rule_id__put",
        parameters: [
          { name: "rule_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CustomRuleUpdate"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomRuleResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Custom Rules"],
        summary: "Delete Rule",
        operationId: "delete_rule_api_rules__rule_id__delete",
        parameters: [
          { name: "rule_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "204": {
            description: "Successful Response"
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/rules/{rule_id}/enable": {
      patch: {
        tags: ["Custom Rules"],
        summary: "Enable Rule",
        operationId: "enable_rule_api_rules__rule_id__enable_patch",
        parameters: [
          { name: "rule_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomRuleResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/rules/{rule_id}/disable": {
      patch: {
        tags: ["Custom Rules"],
        summary: "Disable Rule",
        operationId: "disable_rule_api_rules__rule_id__disable_patch",
        parameters: [
          { name: "rule_id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomRuleResponse"
                }
              }
            }
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health Check",
        operationId: "health_check_health_get",
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    service: { type: "string" },
                    version: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/health/db": {
      get: {
        tags: ["Health"],
        summary: "Database Health Check",
        operationId: "database_health_check_health_db_get",
        responses: {
          "200": {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    database: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ManualRunRequest: {
        type: "object",
        required: ["project_id"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          workspace_path: { type: "string" },
          profile_path: { type: "string" }
        }
      },
      ManualRunResponse: {
        type: "object",
        required: ["run_id", "project_id", "status", "score", "critical_count", "high_count", "medium_count", "low_count", "total_findings", "findings"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          project_id: { type: "string", format: "uuid" },
          status: { type: "string" },
          score: { type: "number" },
          critical_count: { type: "integer" },
          high_count: { type: "integer" },
          medium_count: { type: "integer" },
          low_count: { type: "integer" },
          total_findings: { type: "integer" },
          findings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                rule_id: { type: "string" },
                message: { type: "string" },
                severity: { type: "string" },
                category: { type: "string" },
                file_path: { type: "string" },
                line_number: { type: "integer" },
                column_number: { type: "integer" }
              }
            }
          }
        }
      },
      AsyncRunRequest: {
        type: "object",
        required: ["project_id"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          workspace_path: { type: "string" },
          profile_path: { type: "string" }
        }
      },
      AsyncRunResponse: {
        type: "object",
        required: ["run_id", "project_id", "status"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          project_id: { type: "string", format: "uuid" },
          status: { type: "string" }
        }
      },
      RunFindingsResponse: {
        type: "object",
        required: ["run_id", "total", "limit", "offset", "findings"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
          findings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                run_id: { type: "string", format: "uuid" },
                rule_id: { type: "string" },
                message: { type: "string" },
                severity: { type: "string" },
                category: { type: "string" },
                file_path: { type: "string" },
                line_number: { type: "integer" },
                column_number: { type: "integer" },
                created_at: { type: "string", format: "date-time" }
              }
            }
          }
        }
      },
      RunDetailsResponse: {
        type: "object",
        required: ["run_id", "project_id", "status", "score", "started_at", "completed_at", "summary", "findings"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          project_id: { type: "string", format: "uuid" },
          status: { type: "string" },
          score: { type: "number" },
          started_at: { type: "string", format: "date-time" },
          completed_at: { type: "string", format: "date-time" },
          summary: {
            type: "object",
            properties: {
              total_findings: { type: "integer" },
              critical: { type: "integer" },
              high: { type: "integer" },
              medium: { type: "integer" },
              low: { type: "integer" }
            }
          },
          findings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                run_id: { type: "string", format: "uuid" },
                rule_id: { type: "string" },
                message: { type: "string" },
                severity: { type: "string" },
                category: { type: "string" },
                file_path: { type: "string" },
                line_number: { type: "integer" },
                column_number: { type: "integer" },
                created_at: { type: "string", format: "date-time" }
              }
            }
          }
        }
      },
      RunStatusResponse: {
        type: "object",
        required: ["run_id", "project_id", "status", "score", "started_at", "completed_at"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          project_id: { type: "string", format: "uuid" },
          status: { type: "string" },
          score: { type: "number" },
          started_at: { type: "string", format: "date-time" },
          completed_at: { type: "string", format: "date-time" }
        }
      },
      PublicGitHubRunRequest: {
        type: "object",
        required: ["project_id", "repository_url"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          repository_url: { type: "string" },
          profile_path: { type: "string" }
        }
      },
      PublicGitHubRunResponse: {
        type: "object",
        required: ["run_id", "project_id", "status", "repository", "default_branch", "files_analyzed", "score", "critical_count", "high_count", "medium_count", "low_count", "total_findings"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          project_id: { type: "string", format: "uuid" },
          status: { type: "string" },
          repository: { type: "string" },
          default_branch: { type: "string" },
          files_analyzed: { type: "integer" },
          score: { type: "number" },
          critical_count: { type: "integer" },
          high_count: { type: "integer" },
          medium_count: { type: "integer" },
          low_count: { type: "integer" },
          total_findings: { type: "integer" }
        }
      },
      UploadRunResponse: {
        type: "object",
        required: ["run_id", "filename", "status"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          filename: { type: "string" },
          status: { type: "string" }
        }
      },
      GitHubPATScanRequest: {
        type: "object",
        required: ["project_id", "owner", "repo", "branch", "selected_rule_keys", "selected_rule_ids"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          owner: { type: "string" },
          repo: { type: "string" },
          branch: { type: "string" },
          selected_rule_keys: { type: "array", items: { type: "string" } },
          selected_rule_ids: { type: "array", items: { type: "string", format: "uuid" } }
        }
      },
      GitHubRepositoryListResponse: {
        type: "object",
        required: ["repositories"],
        properties: {
          repositories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                owner: { type: "string" },
                name: { type: "string" },
                full_name: { type: "string" },
                default_branch: { type: "string" },
                private: { type: "boolean" }
              }
            }
          }
        }
      },
      GitHubBranchListResponse: {
        type: "object",
        required: ["repository", "branches"],
        properties: {
          repository: { type: "string" },
          branches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" }
              }
            }
          }
        }
      },
      GitHubScanRequest: {
        type: "object",
        required: ["project_id", "installation_id", "owner", "repo", "branch", "selected_rule_keys", "selected_rule_ids"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          installation_id: { type: "integer" },
          owner: { type: "string" },
          repo: { type: "string" },
          branch: { type: "string" },
          selected_rule_keys: { type: "array", items: { type: "string" } },
          selected_rule_ids: { type: "array", items: { type: "string", format: "uuid" } }
        }
      },
      GitHubScanResponse: {
        type: "object",
        required: ["run_id", "project_id", "repository", "default_branch", "branch", "files_analyzed", "score", "critical_count", "high_count", "medium_count", "low_count", "total_findings"],
        properties: {
          run_id: { type: "string", format: "uuid" },
          project_id: { type: "string", format: "uuid" },
          repository: { type: "string" },
          default_branch: { type: "string" },
          branch: { type: "string" },
          files_analyzed: { type: "integer" },
          score: { type: "number" },
          critical_count: { type: "integer" },
          high_count: { type: "integer" },
          medium_count: { type: "integer" },
          low_count: { type: "integer" },
          total_findings: { type: "integer" }
        }
      },
      ProjectCreate: {
        type: "object",
        required: ["name", "description", "repository_url"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          repository_url: { type: "string" },
          github_installation_id: { type: "integer" },
          github_owner: { type: "string" },
          github_repo: { type: "string" },
          github_branch: { type: "string" }
        }
      },
      ProjectResponse: {
        type: "object",
        required: ["id", "name", "description", "repository_url", "owner_id", "created_at", "updated_at"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          repository_url: { type: "string" },
          github_installation_id: { type: "integer" },
          github_owner: { type: "string" },
          github_repo: { type: "string" },
          github_branch: { type: "string" },
          owner_id: { type: "string", format: "uuid" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      ProjectAnalyticsResponse: {
        type: "object",
        required: ["project_id", "total_runs", "latest_score", "total_findings", "severity", "score_history"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          total_runs: { type: "integer" },
          latest_score: { type: "number" },
          total_findings: { type: "integer" },
          severity: {
            type: "object",
            properties: {
              critical: { type: "integer" },
              high: { type: "integer" },
              medium: { type: "integer" },
              low: { type: "integer" }
            }
          },
          score_history: {
            type: "array",
            items: {
              type: "object",
              properties: {
                run_id: { type: "string", format: "uuid" },
                score: { type: "number" },
                status: { type: "string" },
                completed_at: { type: "string", format: "date-time" }
              }
            }
          }
        }
      },
      ProjectOverviewResponse: {
        type: "object",
        required: ["project_id", "name", "description", "repository_url", "latest_run", "analytics"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          repository_url: { type: "string" },
          latest_run: {
            type: "object",
            properties: {
              run_id: { type: "string", format: "uuid" },
              status: { type: "string" },
              score: { type: "number" },
              completed_at: { type: "string", format: "date-time" }
            }
          },
          analytics: {
            type: "object",
            properties: {
              total_runs: { type: "integer" },
              total_findings: { type: "integer" },
              critical: { type: "integer" },
              high: { type: "integer" },
              medium: { type: "integer" },
              low: { type: "integer" }
            }
          }
        }
      },
      RuleCatalogResponse: {
        type: "object",
        required: ["rules"],
        properties: {
          rules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                source: { type: "string" },
                category: { type: "string" },
                severity: { type: "string" },
                builtin: { type: "boolean" },
                enabled: { type: "boolean" }
              }
            }
          }
        }
      },
      CustomRuleCreate: {
        type: "object",
        required: ["project_id", "rule_id", "name", "description", "language", "rule_type", "category", "severity", "config"],
        properties: {
          project_id: { type: "string", format: "uuid" },
          rule_id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          language: { type: "string" },
          rule_type: { type: "string" },
          category: { type: "string" },
          severity: { type: "string" },
          config: { type: "object", additionalProperties: true },
          enabled: { type: "boolean", default: true }
        }
      },
      CustomRuleUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          language: { type: "string" },
          rule_type: { type: "string" },
          category: { type: "string" },
          severity: { type: "string" },
          config: { type: "object", additionalProperties: true },
          enabled: { type: "boolean" }
        }
      },
      CustomRuleResponse: {
        type: "object",
        required: ["id", "project_id", "rule_id", "name", "description", "language", "rule_type", "category", "severity", "config", "enabled", "created_at", "updated_at"],
        properties: {
          id: { type: "string", format: "uuid" },
          project_id: { type: "string", format: "uuid" },
          rule_id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          language: { type: "string" },
          rule_type: { type: "string" },
          category: { type: "string" },
          severity: { type: "string" },
          config: { type: "object", additionalProperties: true },
          enabled: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      HTTPValidationError: {
        type: "object",
        properties: {
          detail: {
            type: "array",
            items: {
              type: "object",
              properties: {
                loc: { type: "array", items: { type: "string" } },
                msg: { type: "string" },
                type: { type: "string" }
              }
            }
          }
        }
      }
    }
  }
};

export const API_ENDPOINTS: ApiEndpointSpec[] = [
  // Runs
  {
    id: 'post-runs-manual',
    method: 'POST',
    path: '/api/runs/manual',
    summary: 'Create Manual Run',
    description: 'Run a synchronous code-quality analysis.',
    tag: 'Runs',
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        project_id: 'proj-001',
        workspace_path: '/workspace/src',
        profile_path: 'profiles/strict.yaml'
      }
    },
    sampleResponse: {
      run_id: 'run-86',
      project_id: 'proj-001',
      status: 'Completed',
      score: 84,
      critical_count: 0,
      high_count: 2,
      medium_count: 5,
      low_count: 3,
      total_findings: 10,
      findings: [
        {
          rule_id: 'CQT-SEC-01',
          message: 'Hardcoded API secret token found in initialization string',
          severity: 'high',
          category: 'Security',
          file_path: 'src/services/auth.py',
          line_number: 42,
          column_number: 12
        }
      ]
    }
  },
  {
    id: 'post-runs-async',
    method: 'POST',
    path: '/api/runs/',
    summary: 'Create Async Run',
    description: 'Create an asynchronous code-quality analysis run.',
    tag: 'Runs',
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        project_id: 'proj-001',
        workspace_path: '/workspace/src',
        profile_path: 'profiles/default.yaml'
      }
    },
    sampleResponse: {
      run_id: 'run-87',
      project_id: 'proj-001',
      status: 'queued'
    }
  },
  {
    id: 'get-runs-findings',
    method: 'GET',
    path: '/api/runs/{run_id}/findings',
    summary: 'Get Run Findings',
    description: 'Get findings for a run with filtering, searching and pagination.',
    tag: 'Runs',
    parameters: [
      { name: 'run_id', in: 'path', required: true, type: 'string', default: 'run-86' },
      { name: 'severity', in: 'query', required: false, type: 'string', default: '' },
      { name: 'category', in: 'query', required: false, type: 'string', default: '' },
      { name: 'rule_id', in: 'query', required: false, type: 'string', default: '' },
      { name: 'search', in: 'query', required: false, type: 'string', default: '' },
      { name: 'limit', in: 'query', required: false, type: 'integer', default: 50 },
      { name: 'offset', in: 'query', required: false, type: 'integer', default: 0 }
    ],
    sampleResponse: {
      run_id: 'run-86',
      total: 12,
      limit: 50,
      offset: 0,
      findings: [
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
          created_at: '2026-09-22T08:30:00.000Z'
        }
      ]
    }
  },
  {
    id: 'get-runs-details',
    method: 'GET',
    path: '/api/runs/{run_id}/details',
    summary: 'Get Run Details',
    description: 'Get complete details of a code-quality analysis run.',
    tag: 'Runs',
    parameters: [
      { name: 'run_id', in: 'path', required: true, type: 'string', default: 'run-86' }
    ],
    sampleResponse: {
      run_id: 'run-86',
      project_id: 'proj-001',
      status: 'completed',
      score: 84,
      started_at: '2026-09-22T08:29:45.000Z',
      completed_at: '2026-09-22T08:30:12.000Z',
      summary: {
        total_findings: 12,
        critical: 0,
        high: 2,
        medium: 7,
        low: 3
      },
      findings: []
    }
  },
  {
    id: 'get-runs-status',
    method: 'GET',
    path: '/api/runs/{run_id}',
    summary: 'Get Run Status',
    description: 'Get the current status and score of a run.',
    tag: 'Runs',
    parameters: [
      { name: 'run_id', in: 'path', required: true, type: 'string', default: 'run-86' }
    ],
    sampleResponse: {
      run_id: 'run-86',
      project_id: 'proj-001',
      status: 'completed',
      score: 84,
      started_at: '2026-09-22T08:29:45.000Z',
      completed_at: '2026-09-22T08:30:12.000Z'
    }
  },
  {
    id: 'post-runs-github-public',
    method: 'POST',
    path: '/api/runs/github/public',
    summary: 'Create Public Github Run',
    description: 'Run code-quality analysis against a public GitHub repository.',
    tag: 'Runs',
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        project_id: 'proj-001',
        repository_url: 'https://github.com/fastapi/fastapi',
        profile_path: 'profiles/production.yaml'
      }
    },
    sampleResponse: {
      run_id: 'run-88',
      project_id: 'proj-001',
      status: 'completed',
      repository: 'fastapi/fastapi',
      default_branch: 'master',
      files_analyzed: 184,
      score: 92,
      critical_count: 0,
      high_count: 1,
      medium_count: 3,
      low_count: 2,
      total_findings: 6
    }
  },
  {
    id: 'get-runs-project',
    method: 'GET',
    path: '/api/runs/project/{project_id}',
    summary: 'List Project Runs',
    description: 'Get all analysis runs for a given project with pagination.',
    tag: 'Runs',
    parameters: [
      { name: 'project_id', in: 'path', required: true, type: 'string', default: 'proj-001' },
      { name: 'limit', in: 'query', required: false, type: 'integer', default: 20 },
      { name: 'offset', in: 'query', required: false, type: 'integer', default: 0 }
    ],
    sampleResponse: [
      {
        run_id: 'run-86',
        project_id: 'proj-001',
        status: 'completed',
        score: 84,
        started_at: '2026-09-22T08:29:45.000Z',
        completed_at: '2026-09-22T08:30:12.000Z'
      }
    ]
  },

  // Upload
  {
    id: 'post-upload-zip',
    method: 'POST',
    path: '/api/upload/zip',
    summary: 'Upload Zip',
    description: 'Upload a ZIP archive containing source code for static analysis.',
    tag: 'Upload',
    requestBody: {
      required: true,
      contentType: 'multipart/form-data',
      example: {
        project_id: 'proj-001',
        file: '(binary zip file)'
      }
    },
    sampleResponse: {
      run_id: 'run-90',
      filename: 'microservice-src.zip',
      status: 'completed'
    }
  },

  // GitHub
  {
    id: 'get-github-pat-test',
    method: 'GET',
    path: '/api/github/pat/test',
    summary: 'Test Github Pat',
    description: 'Verify GitHub Personal Access Token permissions against target repo.',
    tag: 'GitHub',
    parameters: [
      { name: 'owner', in: 'query', required: true, type: 'string', default: 'Dineshindiexpert' },
      { name: 'repo', in: 'query', required: true, type: 'string', default: 'cqt-core-engine' }
    ],
    sampleResponse: 'Valid PAT access to Dineshindiexpert/cqt-core-engine (200 OK)'
  },
  {
    id: 'get-github-pat-branches',
    method: 'GET',
    path: '/api/github/pat/branches',
    summary: 'List Github Pat Branches',
    description: 'Retrieve all accessible branches for the repository using PAT.',
    tag: 'GitHub',
    parameters: [
      { name: 'owner', in: 'query', required: true, type: 'string', default: 'Dineshindiexpert' },
      { name: 'repo', in: 'query', required: true, type: 'string', default: 'cqt-core-engine' }
    ],
    sampleResponse: ['main', 'develop', 'feat/ast-engine-v2', 'fix/bandit-parser']
  },
  {
    id: 'get-github-pat-tree',
    method: 'GET',
    path: '/api/github/pat/tree',
    summary: 'Get Github Pat Tree',
    description: 'List repository file hierarchy for selected branch.',
    tag: 'GitHub',
    parameters: [
      { name: 'owner', in: 'query', required: true, type: 'string', default: 'Dineshindiexpert' },
      { name: 'repo', in: 'query', required: true, type: 'string', default: 'cqt-core-engine' },
      { name: 'branch', in: 'query', required: false, type: 'string', default: 'main' }
    ],
    sampleResponse: [
      'src/',
      'src/main.py',
      'src/analyzers/',
      'src/analyzers/bandit.py',
      'src/analyzers/ast_custom.py',
      'requirements.txt',
      'README.md'
    ]
  },
  {
    id: 'get-github-pat-source-test',
    method: 'GET',
    path: '/api/github/pat/source-test',
    summary: 'Test Github Pat Source',
    description: 'Confirm raw content read access for branch analysis.',
    tag: 'GitHub',
    parameters: [
      { name: 'owner', in: 'query', required: true, type: 'string', default: 'Dineshindiexpert' },
      { name: 'repo', in: 'query', required: true, type: 'string', default: 'cqt-core-engine' },
      { name: 'branch', in: 'query', required: false, type: 'string', default: 'main' }
    ],
    sampleResponse: 'Repository source stream validated successfully'
  },
  {
    id: 'post-github-pat-scan',
    method: 'POST',
    path: '/api/github/pat/scan',
    summary: 'Scan Github Repository With Pat',
    description: 'Trigger full analysis using configured PAT credentials.',
    tag: 'GitHub',
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        project_id: 'proj-001',
        owner: 'Dineshindiexpert',
        repo: 'cqt-core-engine',
        branch: 'main',
        selected_rule_keys: ['cqt-sec-01', 'bandit-b101', 'radon-cc'],
        selected_rule_ids: ['rule-001', 'rule-002']
      }
    },
    sampleResponse: 'Scan initiated with 18 rules applied'
  },
  {
    id: 'get-github-app-repositories',
    method: 'GET',
    path: '/api/github/app/repositories',
    summary: 'List Github App Repositories',
    description: 'Fetch all repositories granted to the installed GitHub App.',
    tag: 'GitHub',
    parameters: [
      { name: 'installation_id', in: 'query', required: true, type: 'integer', default: 49201 }
    ],
    sampleResponse: {
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
        }
      ]
    }
  },
  {
    id: 'get-github-app-branches',
    method: 'GET',
    path: '/api/github/app/branches',
    summary: 'List Github App Branches',
    description: 'Get branches for an authorized repository via GitHub App token.',
    tag: 'GitHub',
    parameters: [
      { name: 'installation_id', in: 'query', required: true, type: 'integer', default: 49201 },
      { name: 'owner', in: 'query', required: true, type: 'string', default: 'Dineshindiexpert' },
      { name: 'repo', in: 'query', required: true, type: 'string', default: 'cqt-core-engine' }
    ],
    sampleResponse: {
      repository: 'Dineshindiexpert/cqt-core-engine',
      branches: [
        { name: 'main' },
        { name: 'develop' },
        { name: 'v1.0.0-release' }
      ]
    }
  },
  {
    id: 'post-github-app-scan',
    method: 'POST',
    path: '/api/github/app/scan',
    summary: 'Scan Github Repository With App',
    description: 'Scan repository with a short-lived per-installation GitHub token.',
    tag: 'GitHub',
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        project_id: 'proj-001',
        installation_id: 49201,
        owner: 'Dineshindiexpert',
        repo: 'cqt-core-engine',
        branch: 'main',
        selected_rule_keys: ['cqt-sec-01', 'bandit-b101', 'ruff-e', 'pip-audit'],
        selected_rule_ids: ['rule-001', 'rule-003']
      }
    },
    sampleResponse: {
      run_id: 'run-91',
      project_id: 'proj-001',
      repository: 'Dineshindiexpert/cqt-core-engine',
      default_branch: 'main',
      branch: 'main',
      files_analyzed: 94,
      score: 87,
      critical_count: 0,
      high_count: 1,
      medium_count: 4,
      low_count: 2,
      total_findings: 7
    }
  },

  // Projects
  {
    id: 'get-projects',
    method: 'GET',
    path: '/api/projects/',
    summary: 'List Projects',
    description: 'Get all configured projects and metadata.',
    tag: 'Projects',
    sampleResponse: [
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
      }
    ]
  },
  {
    id: 'post-projects',
    method: 'POST',
    path: '/api/projects/',
    summary: 'Create Project',
    description: 'Create a new project. Default developer profile is assigned as owner.',
    tag: 'Projects',
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        name: 'fastapi-backend-service',
        description: 'REST API service for user authentication and authorization.',
        repository_url: 'https://github.com/Dineshindiexpert/fastapi-backend-service',
        github_installation_id: 49201,
        github_owner: 'Dineshindiexpert',
        github_repo: 'fastapi-backend-service',
        github_branch: 'main'
      }
    },
    sampleResponse: {
      id: 'proj-002',
      name: 'fastapi-backend-service',
      description: 'REST API service for user authentication and authorization.',
      repository_url: 'https://github.com/Dineshindiexpert/fastapi-backend-service',
      github_installation_id: 49201,
      github_owner: 'Dineshindiexpert',
      github_repo: 'fastapi-backend-service',
      github_branch: 'main',
      owner_id: 'user-01',
      created_at: '2026-09-22T09:30:00.000Z',
      updated_at: '2026-09-22T09:30:00.000Z'
    }
  },
  {
    id: 'get-projects-analytics',
    method: 'GET',
    path: '/api/projects/{project_id}/analytics',
    summary: 'Get Project Analytics',
    description: 'Get analytics, findings severity distribution, and run history for a project.',
    tag: 'Projects',
    parameters: [
      { name: 'project_id', in: 'path', required: true, type: 'string', default: 'proj-001' }
    ],
    sampleResponse: {
      project_id: 'proj-001',
      total_runs: 8,
      latest_score: 84,
      total_findings: 12,
      severity: {
        critical: 0,
        high: 2,
        medium: 7,
        low: 3
      },
      score_history: [
        { run_id: 'run-80', score: 91, status: 'completed', completed_at: '2026-09-20T10:00:00Z' },
        { run_id: 'run-82', score: 87, status: 'completed', completed_at: '2026-09-21T12:00:00Z' },
        { run_id: 'run-86', score: 84, status: 'completed', completed_at: '2026-09-22T08:30:00Z' }
      ]
    }
  },
  {
    id: 'get-projects-overview',
    method: 'GET',
    path: '/api/projects/{project_id}/overview',
    summary: 'Get Project Overview',
    description: 'Get project information, latest analysis score and summary statistics.',
    tag: 'Projects',
    parameters: [
      { name: 'project_id', in: 'path', required: true, type: 'string', default: 'proj-001' }
    ],
    sampleResponse: {
      project_id: 'proj-001',
      name: 'cqt-core-engine',
      description: 'Core AST parser, static analyzer orchestration, and scoring pipeline.',
      repository_url: 'https://github.com/Dineshindiexpert/cqt-core-engine',
      latest_run: {
        run_id: 'run-86',
        status: 'completed',
        score: 84,
        completed_at: '2026-09-22T08:30:12.000Z'
      },
      analytics: {
        total_runs: 8,
        total_findings: 12,
        critical: 0,
        high: 2,
        medium: 7,
        low: 3
      }
    }
  },

  // Custom Rules
  {
    id: 'get-rules-catalog',
    method: 'GET',
    path: '/api/rules/catalog',
    summary: 'Get Rule Catalog',
    description: 'Retrieve built-in analyzer rules and custom defined rules for a project.',
    tag: 'Custom Rules',
    parameters: [
      { name: 'project_id', in: 'query', required: true, type: 'string', default: 'proj-001' }
    ],
    sampleResponse: {
      rules: [
        {
          key: 'CQT-SEC-01',
          name: 'Hardcoded Secret Detection',
          description: 'Detects hardcoded API keys, JWT tokens, and private keys.',
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
          source: 'FastAPI',
          category: 'Bug',
          severity: 'medium',
          builtin: true,
          enabled: true
        }
      ]
    }
  },
  {
    id: 'get-rules',
    method: 'GET',
    path: '/api/rules',
    summary: 'List Rules',
    description: 'Filter rules by project, activation status, or target language.',
    tag: 'Custom Rules',
    parameters: [
      { name: 'project_id', in: 'query', required: false, type: 'string', default: 'proj-001' },
      { name: 'enabled', in: 'query', required: false, type: 'boolean', default: true },
      { name: 'language', in: 'query', required: false, type: 'string', default: 'Python' }
    ],
    sampleResponse: [
      {
        id: 'rule-custom-01',
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
    ]
  },
  {
    id: 'post-rules',
    method: 'POST',
    path: '/api/rules',
    summary: 'Create Rule',
    description: 'Add a new custom rule with AST pattern or regex configuration.',
    tag: 'Custom Rules',
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        project_id: 'proj-001',
        rule_id: 'CUSTOM-SQL-02',
        name: 'Enforce Parameterized SQL Queries',
        description: 'Prohibits string formatting inside database query executions.',
        language: 'Python',
        rule_type: 'ast_pattern',
        category: 'Security',
        severity: 'high',
        config: {
          pattern: 'execute(*)',
          forbid_format: true
        },
        enabled: true
      }
    },
    sampleResponse: {
      id: 'rule-new-01',
      project_id: 'proj-001',
      rule_id: 'CUSTOM-SQL-02',
      name: 'Enforce Parameterized SQL Queries',
      description: 'Prohibits string formatting inside database query executions.',
      language: 'Python',
      rule_type: 'ast_pattern',
      category: 'Security',
      severity: 'high',
      config: {
        pattern: 'execute(*)',
        forbid_format: true
      },
      enabled: true,
      created_at: '2026-09-22T09:30:00.000Z',
      updated_at: '2026-09-22T09:30:00.000Z'
    }
  },
  {
    id: 'get-rules-id',
    method: 'GET',
    path: '/api/rules/{rule_id}',
    summary: 'Get Rule',
    description: 'Retrieve a specific rule definition by ID.',
    tag: 'Custom Rules',
    parameters: [
      { name: 'rule_id', in: 'path', required: true, type: 'string', default: 'rule-custom-01' }
    ],
    sampleResponse: {
      id: 'rule-custom-01',
      project_id: 'proj-001',
      rule_id: 'CUSTOM-AST-01',
      name: 'Disallow Raw SQL String Concatenation',
      description: 'Forbids string interpolation inside cursor.execute calls.',
      language: 'Python',
      rule_type: 'ast_pattern',
      category: 'Security',
      severity: 'high',
      config: {},
      enabled: true,
      created_at: '2026-09-22T08:00:00Z',
      updated_at: '2026-09-22T08:00:00Z'
    }
  },
  {
    id: 'put-rules-id',
    method: 'PUT',
    path: '/api/rules/{rule_id}',
    summary: 'Update Rule',
    description: 'Update the configuration, severity, or description of a custom rule.',
    tag: 'Custom Rules',
    parameters: [
      { name: 'rule_id', in: 'path', required: true, type: 'string', default: 'rule-custom-01' }
    ],
    requestBody: {
      required: true,
      contentType: 'application/json',
      example: {
        name: 'Disallow Raw SQL Concatenation (Updated)',
        description: 'Forbids string formatting or concatenation inside database execution calls.',
        language: 'Python',
        rule_type: 'ast_pattern',
        category: 'Security',
        severity: 'critical',
        config: { strict: true },
        enabled: true
      }
    },
    sampleResponse: {
      id: 'rule-custom-01',
      project_id: 'proj-001',
      rule_id: 'CUSTOM-AST-01',
      name: 'Disallow Raw SQL Concatenation (Updated)',
      description: 'Forbids string formatting or concatenation inside database execution calls.',
      language: 'Python',
      rule_type: 'ast_pattern',
      category: 'Security',
      severity: 'critical',
      config: { strict: true },
      enabled: true,
      created_at: '2026-09-22T08:00:00Z',
      updated_at: '2026-09-22T09:30:00.000Z'
    }
  },
  {
    id: 'delete-rules-id',
    method: 'DELETE',
    path: '/api/rules/{rule_id}',
    summary: 'Delete Rule',
    description: 'Remove a custom rule from the platform.',
    tag: 'Custom Rules',
    parameters: [
      { name: 'rule_id', in: 'path', required: true, type: 'string', default: 'rule-custom-01' }
    ],
    sampleResponse: { status: 204, message: 'No Content' }
  },
  {
    id: 'patch-rules-enable',
    method: 'PATCH',
    path: '/api/rules/{rule_id}/enable',
    summary: 'Enable Rule',
    description: 'Activate an analyzer or custom rule.',
    tag: 'Custom Rules',
    parameters: [
      { name: 'rule_id', in: 'path', required: true, type: 'string', default: 'rule-custom-01' }
    ],
    sampleResponse: {
      id: 'rule-custom-01',
      rule_id: 'CUSTOM-AST-01',
      enabled: true,
      updated_at: '2026-09-22T09:30:00.000Z'
    }
  },
  {
    id: 'patch-rules-disable',
    method: 'PATCH',
    path: '/api/rules/{rule_id}/disable',
    summary: 'Disable Rule',
    description: 'Deactivate an analyzer or custom rule.',
    tag: 'Custom Rules',
    parameters: [
      { name: 'rule_id', in: 'path', required: true, type: 'string', default: 'rule-custom-01' }
    ],
    sampleResponse: {
      id: 'rule-custom-01',
      rule_id: 'CUSTOM-AST-01',
      enabled: false,
      updated_at: '2026-09-22T09:30:00.000Z'
    }
  },

  // Health
  {
    id: 'get-health',
    method: 'GET',
    path: '/health',
    summary: 'Health Check',
    description: 'Core engine status and version probe.',
    tag: 'Health',
    sampleResponse: {
      status: 'ok',
      service: 'cqt-engine',
      version: '0.1.0'
    }
  },
  {
    id: 'get-health-db',
    method: 'GET',
    path: '/health/db',
    summary: 'Database Health Check',
    description: 'Checks database connectivity and latency.',
    tag: 'Health',
    sampleResponse: {
      status: 'connected',
      database: 'postgresql',
      latency_ms: 1.2
    }
  }
];
