---
phase: 05-community-contributions
plan: 01
subsystem: community
tags: [github-templates, validation, ci]

requires: []
provides:
  - PR templates for recipe and general contributions
  - Issue templates for bugs, recipe submissions, and AI skills
  - Enhanced recipe validation with content quality and image checks
affects: [contributing, ci]

tech-stack:
  added: []
  patterns:
    - GitHub issue/PR template structure in .github/

key-files:
  created:
    - .github/PULL_REQUEST_TEMPLATE/recipe.md
    - .github/PULL_REQUEST_TEMPLATE/general.md
    - .github/ISSUE_TEMPLATE/bug_report.md
    - .github/ISSUE_TEMPLATE/recipe_submission.md
    - .github/ISSUE_TEMPLATE/ai_skills.md
    - .github/ISSUE_TEMPLATE/config.yml
  modified:
    - scripts/validate-recipes.ts

key-decisions:
  - "Used .md format for issue templates (standard GitHub template format, not YAML forms)"
  - "Image check uses exact filename match (underscore, not slug) with .jpg extension"
  - "Blank issues disabled; email contact link provided as alternative"

patterns-established:
  - "Recipe validation: Zod schema first, then content quality checks, then image presence"
  - "GitHub templates: separate PR templates for recipe vs general, issue templates for bugs/recipes/tooling"

requirements-completed: [COMM-01, COMM-02]

duration: 5min
completed: 2026-03-24
---

# Plan 05-01: PR/Issue Templates + Enhanced Validation

**Created 6 GitHub template files and enhanced validation with content quality and image presence checks.**

## Performance

- **Tasks:** 2/2 completed
- **Files created:** 6
- **Files modified:** 1

## Accomplishments

- Recipe PR template with full YAML scaffold matching RecipeSchema (all fields documented with examples)
- Issue templates for bug reports, recipe submissions (non-technical friendly), and AI skills contributions
- Blank issues disabled with email fallback (recipes@freerecipe.club)
- Validation script now checks: title length ≤100, ingredient presence, direction steps, background length, and image file existence

## Task Commits

1. **Task 1: Create PR and issue templates** - `db6650b` (feat)
2. **Task 2: Enhance validation script** - `49f913f` (feat)

## Files Created/Modified

- `.github/PULL_REQUEST_TEMPLATE/recipe.md` - Recipe PR template with full YAML scaffold and checklist
- `.github/PULL_REQUEST_TEMPLATE/general.md` - General PR template for non-recipe changes
- `.github/ISSUE_TEMPLATE/bug_report.md` - Bug report issue template
- `.github/ISSUE_TEMPLATE/recipe_submission.md` - Non-technical recipe submission via issue
- `.github/ISSUE_TEMPLATE/ai_skills.md` - AI skills/tooling contribution template
- `.github/ISSUE_TEMPLATE/config.yml` - Disables blank issues, adds email contact
- `scripts/validate-recipes.ts` - Enhanced with content quality and image checks

## Decisions Made

- Used standard Markdown issue templates instead of YAML forms for broader compatibility
- Validation script directly parses YAML + Zod rather than using loadRecipes() for per-file error reporting

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None.
