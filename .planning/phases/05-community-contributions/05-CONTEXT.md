# Phase 5: Community & Contributions - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Contributors can submit and validate recipes through a clear, welcoming workflow. This covers: GitHub PR/issue templates, CI validation enhancements, CONTRIBUTING.md, CODE_OF_CONDUCT.md, README rewrite, Hacktoberfest readiness, and non-technical submission documentation (email/letter path). No new site features beyond a small home page blurb for non-technical submissions. No annotations (Phase 6), no new recipe display features.

</domain>

<decisions>
## Implementation Decisions

### PR & Issue Templates
- **D-01:** Full template set — recipe PR template, general PR template, issue templates (bug report, recipe submission via issue, AI skills/tooling contribution).
- **D-02:** Recipe PR template includes full YAML scaffold with inline comments explaining each field, pre-filled placeholder values, image submission instructions, and a submission checklist.
- **D-03:** AI skills/tooling contribution template — for post-v1 contributors who want to improve Copilot customizations, GSD skills, or development tooling. Future-facing but included now.
- **D-04:** Issue template for recipe submissions — allows non-GitHub-savvy users to submit a recipe as a GitHub issue (maintainer converts to PR). Bridges the gap between the full PR workflow and the email/letter path.

### CI Validation
- **D-05:** Keep Zod error messages as-is (field-level). No custom friendly translation layer — Zod's messages are clear enough.
- **D-06:** Extend validation beyond schema: basic content quality checks (non-empty directions, at least one component group, reasonable field lengths) AND image presence verification (matching image file exists).
- **D-07:** CI already runs `npm run validate` on PRs (Phase 1). Enhance the existing `validate-recipes.ts` script to include content and image checks.

### Contributor Documentation
- **D-08:** CONTRIBUTING.md is beginner-friendly — full fork/clone/edit/commit/PR walkthrough for contributors who may not be GitHub-experienced. Recipe format reference with examples.
- **D-09:** Full README rewrite — update from outdated Astro references to current alpha Remix stack, project structure, how to run locally, how to contribute (link to CONTRIBUTING.md), welcoming Hacktoberfest section.
- **D-10:** Contributor Covenant as the CODE_OF_CONDUCT.md (industry standard).
- **D-11:** Full Hacktoberfest setup — 'hacktoberfest' repo topic, pre-labeled issues with 'good first issue' and 'hacktoberfest', starter issues created (e.g., "Add your favorite recipe").

### Non-Technical Submission Path
- **D-12:** Instructions in a section of CONTRIBUTING.md explaining how to submit a recipe via email or physical mail. Covers what to include (recipe name, ingredients grouped by component, numbered steps, background/story, attribution).
- **D-13:** Small blurb on the home page with placeholder email for non-technical visitors. Discoverability without building a dedicated page.
- **D-14:** TBD placeholder email address (e.g., `recipes@freerecipe.club`) — actual address configured later.
- **D-15:** Physical mail option included (placeholder mailing address). Aligns with the project's analog ethos.
- **D-16:** Explain the process: recipe is received → maintainer creates a GitHub issue → recipe formatted and added via PR → contributor credited.

### Agent's Discretion
- Exact wording and layout of PR/issue templates
- CONTRIBUTING.md structure and section ordering
- README layout and which badges/shields to include
- Hacktoberfest starter issue titles and descriptions (should be inviting)
- How to structure the validation script enhancements (separate checks or unified)
- Home page blurb placement and styling
- Whether to include a recipe example in CONTRIBUTING.md or just link to existing YAML files

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Vision, contribution philosophy (git-first for devs, email/letter for non-technical), analog ethos, Hacktoberfest alignment
- `.planning/REQUIREMENTS.md` — Phase 5 maps to COMM-01, COMM-02, COMM-03, COMM-06
- `.planning/ROADMAP.md` — Phase 5 goal and success criteria

### Prior Phase Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — CI/CD decisions (D-07, D-08, D-11, D-12: Zod validation, hard fail, PR checks, preview deploys)
- `.planning/phases/04-themed-packs/04-CONTEXT.md` — Pack field added to recipe YAML (D-05), pack data model (D-06) — recipe template must include the optional `pack` field

### Existing Code (contribution-relevant)
- `.github/workflows/ci.yml` — Current CI pipeline (typecheck, validate, build CSS, deploy)
- `scripts/validate-recipes.ts` — Current validation script (Zod-only, needs content + image checks)
- `app/data/recipe-schema.ts` — Zod schema defining valid recipe structure (template must match this)
- `data/recipes/pumpkin_doughnut.yml` — Reference recipe format for template and docs
- `README.md` — Current README (outdated, needs full rewrite)
- `LICENSE` — MIT License (already in place)
- `app/controllers/home/controller.tsx` — Home page (needs small blurb for non-technical submissions)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/validate-recipes.ts` — Validation script to extend with content quality and image checks
- `app/data/recipe-schema.ts` — Zod schema (source of truth for PR template YAML scaffold)
- `app/data/recipes.ts` — `loadRecipes()`, `loadRecipe()` functions already used in validation
- `.github/workflows/ci.yml` — CI pipeline already wired, just needs enhanced validation

### Established Patterns
- CI runs on all PRs against main (push + pull_request triggers)
- Validation uses Zod with hard fail (Phase 1 D-08)
- Recipes live in `data/recipes/<slug>.yml` with matching images in `public/recipes/`
- Pack metadata in `data/packs/<slug>.yml`

### Integration Points
- `validate-recipes.ts` — Primary enhancement target for CI validation
- `.github/` directory — Currently only has `workflows/ci.yml`, needs PR templates, issue templates
- `README.md` — Full rewrite target
- `app/controllers/home/controller.tsx` — Small addition for non-technical submission blurb

</code_context>

<specifics>
## Specific Ideas

- AI skills/tooling contribution template is forward-looking — for post-v1 contributors improving dev tooling (Copilot customizations, GSD skills, agents)
- Physical mail option included per analog ethos — placeholder address, same as email
- Home page blurb is intentionally tiny — just a sentence and placeholder email, not a full page
- Hacktoberfest starter issues should be genuinely inviting ("Add your favorite recipe" style)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-community-contributions*
*Context gathered: 2026-03-24*
