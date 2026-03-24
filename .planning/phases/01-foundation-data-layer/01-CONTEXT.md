# Phase 1: Foundation & Data Layer - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold an alpha Remix application with Tailwind v4, Zod-validated YAML recipes, a CI/CD pipeline via GitHub Actions, and a determined hosting solution — deployed and running. The existing Astro codebase is being fully replaced; only recipe data files (YAML + images) carry forward.

</domain>

<decisions>
## Implementation Decisions

### Hosting Strategy
- **D-01:** Hosting decision deferred to researcher. Hard constraint: must be free and tied to GitHub repo (per PROJECT.md). Researcher should investigate alpha Remix output modes (static/SPA/SSR) and recommend the best free hosting that supports it.
- **D-02:** If alpha Remix can't produce static output easily, consider fallback options — but free + GitHub-tied is non-negotiable.

### Remix Scaffolding
- **D-03:** Scaffolding approach deferred to researcher — investigate what scaffolding/template options exist for alpha Remix and recommend one.
- **D-04:** Keep only recipe data files (YAML files + matching images) from existing codebase. Everything else (Astro framework, components, configs, interfaces) is discarded. Fresh start.
- **D-05:** YAML format is not frozen — feel free to adjust the schema as needed for the new framework. Current format is a starting point, not a constraint.
- **D-06:** Recipe data file location should follow whatever is idiomatic for Remix. Researcher decides.

### YAML Validation
- **D-07:** Zod validation at load/parse time (when recipes are read from disk) PLUS a standalone validation script (e.g., `npm run validate`) for use in CI and local checks.
- **D-08:** Validation failure = hard fail. Bad recipe stops the build with a clear error message. No silent skipping.

### Agent's Discretion
- **D-09:** Schema strictness (which fields required vs optional) — agent decides based on what downstream phases need for display, cooking mode, etc.

### CI/CD Pipeline
- **D-10:** GitHub Actions as the CI/CD platform.
- **D-11:** Preview deploys on PRs + production deploy on push to main.
- **D-12:** Full PR check suite: TypeScript type checking, linting, tests (even if minimal initially), recipe YAML validation, and build success.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs or ADRs — requirements fully captured in decisions above and in project-level docs:

### Project-Level
- `.planning/PROJECT.md` — Vision, constraints, key decisions (framework is alpha Remix, not RR7)
- `.planning/REQUIREMENTS.md` — Phase 1 maps to SCAF-01–04, DATA-01–02, CORE-01–02
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria

### Codebase Maps
- `.planning/codebase/STACK.md` — Current outdated stack being replaced
- `.planning/codebase/CONCERNS.md` — Known issues in existing codebase (all being addressed by replacement)
- `.planning/codebase/CONVENTIONS.md` — Current patterns (for reference on what to improve upon)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/recipes/pumpkin_doughnut.yml` — Recipe data file to carry forward (reference for YAML schema design)
- `public/recipes/` — Recipe images to carry forward

### Established Patterns
- Current YAML schema: title, byline, location, components (nested arrays), directions, background, links, flavor
- Components field uses `string[][]` for grouped ingredients — this structure should inform the Zod schema design

### Integration Points
- No integration with existing code — this is a greenfield scaffold that replaces everything
- The YAML recipe files and images are the only bridge between old and new

</code_context>

<specifics>
## Specific Ideas

- User explicitly stated alpha Remix (`remix-run/remix`), NOT React Router v7 — this is a firm decision
- Tailwind v4 with CSS-first approach (per SCAF-02)
- The site should have zero third-party scripts, zero tracking, no auth flow in the deployed output
- YAML format can evolve — don't treat current format as sacred

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-data-layer*
*Context gathered: 2026-03-23*
