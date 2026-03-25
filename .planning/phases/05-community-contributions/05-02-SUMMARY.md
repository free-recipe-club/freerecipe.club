---
phase: 05-community-contributions
plan: 02
subsystem: community
tags: [documentation, contributing, readme, hacktoberfest]

requires: []
provides:
  - CONTRIBUTING.md with full recipe submission walkthrough
  - CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
  - Rewritten README.md reflecting current Remix stack
  - Home page non-technical submission blurb
affects: [community, onboarding]

tech-stack:
  added: []
  patterns: []

key-files:
  created:
    - CONTRIBUTING.md
    - CODE_OF_CONDUCT.md
  modified:
    - README.md
    - app/controllers/home/controller.tsx

key-decisions:
  - "README stripped of Astro references, rewritten for current alpha Remix stack"
  - "No badges/shields in README — keeping it minimal per analog ethos"
  - "Email placeholder recipes@freerecipe.club used across all docs"
  - "Mail address marked as TBD in CONTRIBUTING.md"

patterns-established:
  - "Non-technical submission path: email + issue template + snail mail"
  - "Recipe format documented in CONTRIBUTING.md with inline field reference table"

requirements-completed: [COMM-03, COMM-06]

duration: 5min
completed: 2026-03-24
---

# Plan 05-02: Contributor Docs + Home Page Update

**Created welcoming contributor docs, rewrote README for current stack, added email submission blurb to home page.**

## Performance

- **Tasks:** 2/3 completed (Task 3 is a human-verify checkpoint)
- **Files created:** 2
- **Files modified:** 2

## Accomplishments

- CONTRIBUTING.md: Full fork-to-PR walkthrough, recipe format reference with all schema fields, non-technical paths (issue, email, mail)
- CODE_OF_CONDUCT.md: Contributor Covenant v2.1 with recipes@freerecipe.club enforcement contact
- README.md: Complete rewrite — removed all Astro references, reflects Remix/Tailwind v4/Zod/Fly.io stack
- Home page: Added small themed blurb directing non-technical visitors to email recipes

## Task Commits

1. **Task 1: Create CONTRIBUTING.md, CODE_OF_CONDUCT.md, rewrite README.md** - `b23d181` (feat)
2. **Task 2: Add non-technical submission blurb to home page** - `d61e926` (feat)
3. **Task 3: Verify Hacktoberfest GitHub setup** - checkpoint (human-verify)

## Files Created/Modified

- `CONTRIBUTING.md` - Full contributor walkthrough with recipe format reference and all submission paths
- `CODE_OF_CONDUCT.md` - Contributor Covenant v2.1
- `README.md` - Complete rewrite for current alpha Remix stack
- `app/controllers/home/controller.tsx` - Added email submission blurb

## Decisions Made

- No badges in README — fits the minimal, analog ethos of the project
- Used `recipes@freerecipe.club` consistently across all docs as the contact point

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None.
