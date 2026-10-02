# Phase 5: Community & Contributions — Research

**Researched:** 2026-03-24
**Discovery Level:** 1 (Quick Verification)
**Phase Requirements:** COMM-01, COMM-02, COMM-03, COMM-06

## Domain Assessment

Phase 5 is documentation and CI-focused — no new runtime dependencies, no external APIs, no architectural decisions. All work follows established codebase patterns (GitHub templates, markdown docs, TypeScript validation script, minor TSX change).

## Research Findings

### GitHub PR & Issue Templates

**PR Templates:**
- Location: `.github/PULL_REQUEST_TEMPLATE/` directory for multiple templates, or `.github/pull_request_template.md` for a single default
- For multiple templates: use `.github/PULL_REQUEST_TEMPLATE/recipe.md` and `.github/PULL_REQUEST_TEMPLATE/general.md`
- GitHub will present a template chooser when contributors open a PR if multiple templates exist in the directory

**Issue Templates:**
- Location: `.github/ISSUE_TEMPLATE/` directory
- Each template is a markdown file with YAML frontmatter (`name`, `description`, `title`, `labels`, `assignees`)
- Config file `.github/ISSUE_TEMPLATE/config.yml` controls blank issue creation and external links
- Labels referenced in templates must exist in the repo (created via GitHub API or UI)

### CI Validation Enhancement

**Current state:** `scripts/validate-recipes.ts` calls `loadRecipes()` which runs Zod validation. 11 lines total.

**Enhancement targets (per D-06, D-07):**
1. **Content quality checks:** Non-empty directions, at least one component group, reasonable field lengths — most of these are already covered by the Zod schema (`z.array().min(1)`, `z.string().min(1)`). Additional checks: directions shouldn't all be group headers (at least one actual step), title length capped (e.g., 100 chars).
2. **Image presence verification:** For each recipe slug, check that `public/recipes/{slug}.jpg` exists. Current code doesn't verify this.
3. **Implementation:** Enhance `validate-recipes.ts` with additional checks after Zod validation passes. Use existing `getRecipeSlug()` from `app/data/recipes.ts` to derive slug from filename.

### Contributor Covenant

- Standard CODE_OF_CONDUCT.md — use Contributor Covenant v2.1 (latest stable)
- Available at: https://www.contributor-covenant.org/version/2/1/code_of_conduct/
- Only customization needed: contact email (placeholder `recipes@freerecipe.club` per D-14)

### Hacktoberfest Setup

- Repo needs `hacktoberfest` topic added to GitHub (repo settings)
- Issues need `hacktoberfest` and `good first issue` labels
- Creating labels and topic is a GitHub API/UI action — mark as checkpoint
- Pre-created starter issues like "Add your favorite recipe" help attract contributors

### Recipe YAML Schema Reference (for PR Template)

From `app/data/recipe-schema.ts`, the template YAML scaffold must include:
- `title` (string, required)
- `byline` (string, required) 
- `location` (string, required)
- `components` (array of arrays, required, min 1 group)
- `directions` (array of strings or [group, step...] arrays, required, min 1)
- `background` (string, optional, defaults to '')
- `links` (array of {text, url}, optional, defaults to [])
- `flavor` (string, optional, defaults to '')
- `pack` (string, optional — added in Phase 4)

### Home Page Modification

Small addition to `app/controllers/home/controller.tsx`. Current home page is a simple centered layout. Per D-13, add a small blurb about non-technical submissions with placeholder email. This is HTML string concatenation in the existing `render()` call.

## Standard Stack

No new dependencies needed. All work uses:
- TypeScript (validation script)
- Markdown (docs, templates)
- YAML frontmatter (issue templates)
- TSX (home page blurb)

## Don't Hand-Roll

- CODE_OF_CONDUCT: Use Contributor Covenant verbatim (don't write custom)
- GitHub template YAML frontmatter: Follow GitHub's exact spec

## Common Pitfalls

1. **PR template directory case sensitivity:** GitHub expects `.github/PULL_REQUEST_TEMPLATE/` (uppercase) on case-sensitive filesystems
2. **Issue template labels:** Templates reference labels that may not exist yet — must create labels first or document them
3. **Image check paths:** Recipe filenames use underscores (`pumpkin_doughnut.yml`) but slugs use hyphens (`pumpkin-doughnut`). Image files use the slug format.

## Architecture Patterns

No architectural changes. All additions are leaf nodes — new files alongside existing code, minor edits to existing files.

## Validation Architecture

Not applicable — no complex validation beyond enhancing the existing script.

---

## RESEARCH COMPLETE

**Discovery Level:** 1 — Quick verification of GitHub template conventions and CI patterns
**New Dependencies:** None
**Risk Level:** Low — documentation and configuration work with one script enhancement
