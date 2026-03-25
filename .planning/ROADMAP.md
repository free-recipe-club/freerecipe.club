# Roadmap: freerecipe.club

## Overview

From an outdated Astro stub to a live, community-driven recipe site built on alpha Remix. Six phases: foundation and data layer first, then recipe display, cooking mode, themed packs (launches with the site), contribution workflow, and finally community annotations. Every phase delivers a coherent, verifiable capability anchored to the core value: someone finds a recipe and actually cooks from it.

**User Overrides (supersede research):**
- Framework: NEW alpha Remix (`remix-run/remix`) — NOT React Router v7
- Hosting: TBD — may consider Astro if Remix can't easily generate static/SPA output
- Data: Keep current YAML format as-is. No enhanced schema in v1. Zod validation yes.
- The site launches WITH a first themed pack

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Data Layer** - Scaffold alpha Remix with Tailwind v4, Zod-validated YAML recipes, CI/CD, and hosting determination
- [x] **Phase 2: Recipe Display & SEO** - Clean, responsive, recipe-first pages with SSR, print CSS, clean URLs, and sitemap
- [x] **Phase 3: Cooking Mode** - Immersive step-by-step kitchen experience with wake lock and ingredient highlighting
- [ ] **Phase 4: Themed Packs** - CSS theme system, first curated pack, and pack landing page for launch
- [ ] **Phase 5: Community & Contributions** - PR templates, CI validation, Hacktoberfest readiness, and non-technical contribution docs
- [ ] **Phase 6: Annotations & Versioning** - Inline community annotations pinned to recipe elements, with variant forking

## Phase Details

### Phase 1: Foundation & Data Layer
**Goal**: A working alpha Remix application with Tailwind v4, Zod-validated YAML recipes, CI/CD pipeline, and determined hosting — deployed and running
**Depends on**: Nothing (first phase)
**Requirements**: SCAF-01, SCAF-02, SCAF-03, SCAF-04, DATA-01, DATA-02, CORE-01, CORE-02
**Success Criteria** (what must be TRUE):
  1. Developer can run the dev server and see the alpha Remix app in the browser with Tailwind v4 styling applied
  2. Existing YAML recipe files are parsed and validated by Zod schemas at the build/load boundary without errors
  3. A push to the main branch triggers a CI build that succeeds and deploys to the determined hosting provider
  4. The deployed site contains zero third-party scripts, zero tracking, and no authentication flow
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Scaffold Remix 3 + Tailwind v4 + styled home page
- [ ] 01-02-PLAN.md — Zod schema + YAML loading + validation script
- [ ] 01-03-PLAN.md — GitHub Actions CI/CD + Fly.io hosting deployment

### Phase 2: Recipe Display & SEO
**Goal**: Users can browse and read recipes in a clean, responsive, recipe-first layout with proper SEO and SSR
**Depends on**: Phase 1
**Requirements**: DISP-01, DISP-02, DISP-03, DISP-04, DISP-05, DISP-06, DISP-07, DISP-08, SEO-01, SEO-02, CORE-03
**Success Criteria** (what must be TRUE):
  1. User navigates to a clean URL like `/recipes/pumpkin-doughnut` and sees a recipe with title, image, grouped ingredients, numbered steps, and attribution — no preamble, no clutter
  2. User browses all recipes from a listing page and clicks through to any recipe detail
  3. Recipe renders fully via SSR — the complete recipe is readable with JavaScript disabled
  4. User can print a recipe and gets a clean, chrome-free printout; a phone user can comfortably read and navigate with properly sized text and tap targets
  5. An XML sitemap at `/sitemap.xml` lists all recipes for search engine discovery
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Recipe detail page + render() enhancement + navigation bar
- [x] 02-02-PLAN.md — Recipe listing page + sitemap XML + 404 handler
- [x] 02-03-PLAN.md — Print stylesheet + responsive polish + human verification
**UI hint**: yes

### Phase 3: Cooking Mode
**Goal**: Users can enter a focused, step-by-step cooking experience optimized for kitchen use
**Depends on**: Phase 2
**Requirements**: DISP-09, DISP-10
**Success Criteria** (what must be TRUE):
  1. User activates cooking mode from a recipe page and sees an immersive, large-text step-by-step view
  2. The screen stays awake while cooking mode is active (Screen Wake Lock API)
  3. User can navigate between steps with large tap targets (48px+) suitable for wet or messy hands
  4. The active step highlights its relevant ingredients so the user knows what to prep
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Cooking mode route, controller, and ingredient-matched HTML
- [x] 03-02-PLAN.md — Client JS, cooking mode CSS, dark/light mode, Start Cooking button, human verify
- [x] 03-03-PLAN.md — YAML ingredient format validation and extraction fix
**UI hint**: yes

### Phase 4: Themed Packs
**Goal**: The site launches with a curated themed recipe pack that transforms the visual identity
**Depends on**: Phase 2
**Requirements**: PACK-01, PACK-02, PACK-03
**Success Criteria** (what must be TRUE):
  1. User visits the site and sees a cohesive visual theme (colors, typography) applied from the active pack
  2. User can browse a pack landing page showing the curated recipe collection with pack description
  3. The CSS theme system uses custom properties so additional packs can be added without code changes
**Plans**: TBD
**UI hint**: yes

### Phase 5: Community & Contributions
**Goal**: Contributors can submit and validate recipes through a clear, welcoming workflow
**Depends on**: Phase 1
**Requirements**: COMM-01, COMM-02, COMM-03, COMM-06
**Success Criteria** (what must be TRUE):
  1. A contributor opening a new PR sees a recipe template that scaffolds the correct YAML structure
  2. A submitted recipe PR triggers CI validation that checks format correctness and reports pass/fail
  3. The repo has Hacktoberfest labels, a contributor guide, CODE_OF_CONDUCT, and a welcoming README for first-timers
  4. A non-technical person can find clear instructions for submitting a recipe via email or letter
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — GitHub PR/issue templates + enhanced CI validation
- [x] 05-02-PLAN.md — Contributor docs (CONTRIBUTING, CODE_OF_CONDUCT, README rewrite) + home page blurb + Hacktoberfest setup

### Phase 6: Annotations & Versioning
**Goal**: Community members can contribute contextual tips on recipes, and popular annotation sets can become recipe variants
**Depends on**: Phase 2
**Requirements**: COMM-04, COMM-05
**Success Criteria** (what must be TRUE):
  1. User reading a recipe sees inline substitution tips and modifications pinned to specific ingredients or steps
  2. A contributor can submit an annotation via PR that attaches to a specific recipe element
  3. A recipe with significant accumulated annotations has a variant (fork) that incorporates popular changes
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — Annotation schema evolution + sample annotated recipe
- [ ] 06-02-PLAN.md — Annotation display rendering + client JS + cooking mode integration
- [ ] 06-03-PLAN.md — Variant forking + contribution workflow + CI validation
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6
(Phases 3, 4, 5, 6 can potentially parallelize after Phase 2, but sequential is the default for a solo developer.)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Layer | 0/3 | Planned | - |
| 2. Recipe Display & SEO | 3/3 | Complete | 2026-03-24 |
| 3. Cooking Mode | 0/2 | Planned | - |
| 4. Themed Packs | 0/TBD | Not started | - |
| 5. Community & Contributions | 0/TBD | Not started | - |
| 6. Annotations & Versioning | 0/TBD | Not started | - |
