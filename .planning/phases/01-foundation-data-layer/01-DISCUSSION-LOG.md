# Phase 1: Foundation & Data Layer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 1-Foundation & Data Layer
**Areas discussed:** Hosting strategy, Remix scaffolding, YAML validation boundary, CI/CD pipeline

---

## Hosting Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Cloudflare Pages | Free tier, edge SSR, official templates — but alpha Remix compatibility unknown | |
| GitHub Pages (static) | Zero-config free hosting tied to repo, but Remix would need static SPA build | |
| Vercel free tier | Strong Remix support, generous free tier, but vendor dependency outside GitHub | |
| Figure it out during research | Let the researcher investigate alpha Remix output modes and recommend | ✓ |

**User's choice:** Defer to researcher — investigate what actually works with alpha Remix
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Free + GitHub-tied (per PROJECT.md) | Must be free, must be GitHub-tied. Researcher finds best fit. | ✓ |
| Flexible — cheap is fine if free doesn't work | Researcher can consider paid-but-cheap options too | |
| GitHub Pages or nothing | Only GitHub Pages acceptable | |

**User's choice:** Free + GitHub-tied — no relaxation of PROJECT.md constraints
**Notes:** None

---

## Remix Scaffolding

| Option | Description | Selected |
|--------|-------------|----------|
| Official Remix template | Run the official Remix CLI scaffolder if available for alpha | |
| Manual setup from scratch | Set up from blank npm project, full control | |
| Researcher decides | Check what scaffolding options exist for alpha Remix | ✓ |

**User's choice:** Let researcher decide based on what's available
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Keep only data files (YAML + images) | Delete everything except recipe YAML files and images | |
| Clean slate — discard everything | Nuke entire src/ directory including old YAML | |
| Keep interfaces + data | Port Recipe/Link interfaces and YAML files, discard framework code | |

**User's choice:** (Free text) Keep only data files — but don't feel restricted to not change the YAML format, as planned
**Notes:** YAML format is mutable, not frozen. Fresh start on all code.

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated content/data directory | Put all recipe YAML into content/recipes/ or data/recipes/ | |
| Public directory (current location) | Keep in public/ like currently | |
| Whatever's idiomatic for Remix | Let researcher recommend idiomatic location | ✓ |

**User's choice:** Whatever's idiomatic for Remix
**Notes:** None

---

## YAML Validation Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Validate at load/parse time | Zod schemas validate when recipes are loaded. Bad data = build/load error. | |
| Load-time + standalone validation script | Zod + separate `npm run validate` script for PR checks | ✓ |
| CI-only validation | Validate only in GitHub Action on PR. Dev server tolerates malformed data. | |

**User's choice:** Load-time + standalone validation script
**Notes:** Both runtime safety and a standalone tool for CI/local use

| Option | Description | Selected |
|--------|-------------|----------|
| Strict — all fields required | All current fields required, reject incomplete recipes | |
| Lenient — minimal required fields | Only title, components, and directions required, others optional | |
| You decide | Let researcher/planner define based on downstream needs | ✓ |

**User's choice:** Agent's discretion
**Notes:** Agent decides schema strictness based on downstream phase needs

| Option | Description | Selected |
|--------|-------------|----------|
| Hard fail — stop the build | Fail fast with clear error message. Bad recipe = broken build. | ✓ |
| Soft fail — skip bad recipes with warning | Log warning, skip bad recipe, other recipes still render | |
| Context-dependent | Strict in CI, lenient in dev | |

**User's choice:** Hard fail — stop the build
**Notes:** No silent failures

---

## CI/CD Pipeline

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub Actions | Free tier, native to repo, widely supported | ✓ |
| Depends on hosting choice | Let researcher decide based on hosting provider | |

**User's choice:** GitHub Actions
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Main deploys, PRs check only | Push to main triggers build + deploy. PRs run checks only. | |
| Merge-to-main deploys | PR merges trigger deploy. PRs have no preview. | |
| Preview + production deploys | PRs get preview deploys, main gets production deploy | ✓ |

**User's choice:** Preview + production deploys
**Notes:** Both PR preview deploys and production deploys on main

| Option | Description | Selected |
|--------|-------------|----------|
| Types + validation + build | Minimal and fast | |
| Types + validation + build + lint | Catches style issues too | |
| Full suite (types + lint + tests + validation + build) | Future-proofs the pipeline | ✓ |

**User's choice:** Full suite — types, lint, tests, validation, build
**Notes:** Comprehensive from the start, even if tests are minimal initially

---

## Agent's Discretion

- Schema strictness (which YAML fields required vs optional)

## Deferred Ideas

None — discussion stayed within phase scope
