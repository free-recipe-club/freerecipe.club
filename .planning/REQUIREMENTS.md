# Requirements: freerecipe.club

**Defined:** 2026-03-23
**Core Value:** Someone finds a recipe and actually cooks from it.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Scaffolding

- [ ] **SCAF-01**: Project scaffolded with alpha Remix framework (remix-run/remix)
- [ ] **SCAF-02**: Tailwind v4 configured with CSS-first approach
- [ ] **SCAF-03**: GitHub Actions CI/CD pipeline for build and deployment
- [ ] **SCAF-04**: Hosting solution determined (static/SPA output from Remix, or fallback framework if needed)

### Recipe Display

- [ ] **DISP-01**: Clean, recipe-first layout — title, image, ingredients, steps, attribution. No preamble.
- [ ] **DISP-02**: Recipe images displayed with alt text
- [ ] **DISP-03**: Grouped ingredient lists by component (e.g., "Doughnuts", "Topping")
- [ ] **DISP-04**: Numbered steps with checkable progress
- [ ] **DISP-05**: Attribution and source links displayed prominently
- [ ] **DISP-06**: Print-friendly CSS (@media print strips navigation chrome)
- [ ] **DISP-07**: Mobile-responsive, kitchen-first design (phone-friendly, large tap targets)
- [ ] **DISP-08**: Recipes render fully via SSR — JavaScript enhances but isn't required to read
- [ ] **DISP-09**: Full cooking mode — screen wake lock, large text, step-by-step navigation, large tap targets for wet hands
- [ ] **DISP-10**: Ingredient highlighting per active step in cooking mode

### Data

- [ ] **DATA-01**: Zod schema validation for recipe YAML files at the build/load boundary
- [ ] **DATA-02**: YAML remains the recipe data format (human-readable, PR-friendly)

### SEO & Discovery

- [ ] **SEO-01**: Clean URLs for recipes (/recipes/pumpkin-doughnut)
- [ ] **SEO-02**: XML sitemap auto-generated from recipe list

### Community & Contributions

- [ ] **COMM-01**: Recipe PR template (YAML scaffold for contributors)
- [ ] **COMM-02**: CI validation of recipe format on pull requests
- [ ] **COMM-03**: Hacktoberfest-ready repo (good-first-issue labels, contributor guide, welcoming README, CODE_OF_CONDUCT)
- [ ] **COMM-04**: Community annotations — inline substitutions, tips, and modifications pinned to specific recipe ingredients or steps
- [ ] **COMM-05**: Recipe versioning — significant annotation sets can graduate to standalone recipe variants (forks)
- [ ] **COMM-06**: Non-technical contribution path documented (email/letter → maintainer creates GitHub issue → recipe added via PR)

### Themed Packs

- [ ] **PACK-01**: First themed recipe pack curated and included at launch
- [ ] **PACK-02**: CSS theme system using custom properties (switchable per pack)
- [ ] **PACK-03**: Pack landing page displaying curated recipe collection

### Core Principles

- [ ] **CORE-01**: Zero ads, zero tracking, zero third-party scripts, zero dark patterns
- [ ] **CORE-02**: No accounts required — readers are anonymous, contributors use GitHub identity
- [ ] **CORE-03**: Multi-device responsive design (phones, tablets, desktops — kitchen-first)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Data

- **DATA-V2-01**: Enhanced YAML schema (prep time, cook time, servings, cuisine, category, tags)
- **DATA-V2-02**: Structured ingredients (quantity, unit, ingredient name — enables scaling and shopping)
- **DATA-V2-03**: Schema.org/Recipe JSON-LD structured data (Google recipe carousel eligibility)
- **DATA-V2-04**: Ingredient scaling (adjust servings, quantities update proportionally)
- **DATA-V2-05**: Shopping view (ingredients reorganized by category across selected recipes)

### Enhanced SEO & Social

- **SEO-V2-01**: Open Graph / Twitter card meta tags for social sharing previews
- **SEO-V2-02**: Browse and filter recipes by tag, cuisine, category

### Enhanced Community

- **COMM-V2-01**: Contributor profiles auto-generated from git data (recipes by author)

### Advanced Features

- **ADV-V2-01**: Recipe component dependencies (sub-recipe references between recipes)
- **ADV-V2-02**: Offline support via service worker (cache visited recipes for kitchen use)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Minimal tech footprint; privacy-first; adds complexity without value |
| Ratings / star reviews | Incentivizes gaming; annotations provide richer signal |
| Flat comment sections | 90% noise; annotations pinned to recipe lines are better |
| Ads / monetization | Core brand promise — the site exists because other recipe sites have ads |
| Analytics / tracking | Zero cookies, zero surveillance; privacy is a feature |
| Email newsletter popups | Dark pattern; interrupts recipe reading |
| AI-generated recipes | Undermines community/human-sourced ethos |
| Social features (likes, follows, feeds) | Not the product; GitHub is the social layer |
| Video autoplay / embedded media | Recipe sites' biggest bloat source |
| Native mobile app | Responsive web + PWA features are sufficient |
| Server-side database | Recipes live in git as flat files; the repo IS the database |
| Paywalls / premium tiers | Every recipe is free, always |
| Mandatory JavaScript for reading | SSR ensures recipes work without JS |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAF-01 | Phase 1 | Pending |
| SCAF-02 | Phase 1 | Pending |
| SCAF-03 | Phase 1 | Pending |
| SCAF-04 | Phase 1 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| DISP-01 | Phase 2 | Pending |
| DISP-02 | Phase 2 | Pending |
| DISP-03 | Phase 2 | Pending |
| DISP-04 | Phase 2 | Pending |
| DISP-05 | Phase 2 | Pending |
| DISP-06 | Phase 2 | Pending |
| DISP-07 | Phase 2 | Pending |
| DISP-08 | Phase 2 | Pending |
| SEO-01 | Phase 2 | Pending |
| SEO-02 | Phase 2 | Pending |
| CORE-03 | Phase 2 | Pending |
| DISP-09 | Phase 3 | Pending |
| DISP-10 | Phase 3 | Pending |
| PACK-01 | Phase 4 | Pending |
| PACK-02 | Phase 4 | Pending |
| PACK-03 | Phase 4 | Pending |
| COMM-01 | Phase 5 | Pending |
| COMM-02 | Phase 5 | Pending |
| COMM-03 | Phase 5 | Pending |
| COMM-06 | Phase 5 | Pending |
| COMM-04 | Phase 6 | Pending |
| COMM-05 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30 ✓
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after initialization*
