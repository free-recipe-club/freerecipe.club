---
phase: 01-foundation-data-layer
plan: 03
subsystem: infra
tags: [github-actions, ci-cd, fly-io, docker, deployment]

requires:
  - phase: 01-01
    provides: package.json scripts (typecheck, validate, build:css) and server.ts entry point
  - phase: 01-02
    provides: recipe validation script (npm run validate)
provides:
  - GitHub Actions CI/CD pipeline (typecheck + validate + build:css on PRs, deploy on main)
  - Fly.io deployment configuration (fly.toml, Dockerfile, .dockerignore)
  - Containerized Node.js 20 deployment with Tailwind CSS build
affects: [phase-2, all-future-phases]

tech-stack:
  added: [github-actions, flyctl, docker]
  patterns: [ci-check-then-deploy, auto-stop-machines, containerized-tsx-runtime]

key-files:
  created:
    - .github/workflows/ci.yml
    - .dockerignore
  modified:
    - fly.toml
    - Dockerfile

key-decisions:
  - "Skip PR preview deploys for v1 — PR checks (typecheck + validate + build:css) are the gate. Preview deploys add significant complexity."
  - "Use npx tsx for runtime — avoids compile step, aligns with Remix 3 runtime philosophy"
  - "auto_stop_machines + min_machines_running=0 — zero cost when idle, cold start acceptable for recipe site"

patterns-established:
  - "CI pipeline: typecheck → validate → build:css must all pass before deploy"
  - "Containerized deploy: npm ci --production=false to include devDeps needed at build time"

requirements-completed: [SCAF-03, SCAF-04]

duration: 3min
completed: 2026-03-24
---

# Plan 01-03: CI/CD Pipeline and Fly.io Deployment Summary

**GitHub Actions CI pipeline with PR checks and auto-deploy to Fly.io via Docker container**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-24T11:25:00Z
- **Completed:** 2026-03-24T11:28:00Z
- **Tasks:** 2/3 (Task 3 is human-verify checkpoint)
- **Files modified:** 4

## Accomplishments
- GitHub Actions CI workflow runs typecheck, recipe validation, and CSS build on all PRs and pushes to main
- Deploy job auto-deploys to Fly.io on successful main branch push using FLY_API_TOKEN secret
- Fly.io configured with auto-stop machines for zero-cost idle and 256mb shared VM
- Dockerfile builds CSS at container build time and runs server via tsx

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub Actions CI/CD workflow** - `19a1606` (feat)
2. **Task 2: Create Fly.io deployment configuration** - `a83bf36` (feat)
3. **Task 3: Verify deployment setup** - checkpoint:human-verify (pending user verification)

## Files Created/Modified
- `.github/workflows/ci.yml` - CI/CD pipeline with check + deploy jobs
- `fly.toml` - Fly.io app configuration (region, ports, VM size, auto-stop)
- `Dockerfile` - Node.js 20 container with CSS build and tsx runtime
- `.dockerignore` - Excludes .planning, node_modules, .git from container

## Decisions Made
- Skipped preview deploys on PRs — adds complexity, PR checks are sufficient gate for v1
- Used `npm ci --production=false` in Dockerfile — devDeps needed for build:css and tsx runtime
- Set `auto_stop_machines = "stop"` + `min_machines_running = 0` — free when idle

## Deviations from Plan

None - plan executed exactly as written. All files already existed from prior execution; verified acceptance criteria match.

## Issues Encountered
None

## User Setup Required

**External services require manual configuration:**
- **Fly.io account:** Create at fly.io (free, no credit card required for Hobby plan)
- **flyctl CLI:** Install and run `flyctl auth login`
- **Fly.io app:** Run `flyctl apps create freerecipe-club`
- **GitHub secret:** Run `flyctl auth token` → add as repo secret `FLY_API_TOKEN`

Until FLY_API_TOKEN is configured, the deploy job will fail (expected). Check job will still pass.

## Next Phase Readiness
- All CI checks pass locally (typecheck, validate, build:css)
- Deployment pipeline is ready — just needs Fly.io account setup
- Foundation is complete: app scaffold + data layer + CI/CD

## Self-Check: PASSED

---
*Phase: 01-foundation-data-layer*
*Completed: 2026-03-24*
