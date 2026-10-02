# Project Research Summary

**Project:** freerecipe.club
**Domain:** Community-driven recipe website (anti-bloat, no-accounts, git-native, flat-file)
**Researched:** 2026-03-23
**Confidence:** HIGH

## Executive Summary

freerecipe.club is a community-driven recipe site that deliberately rejects every pattern that makes mainstream recipe sites unusable: no ads, no login walls, no life-story preambles, no tracking. The site migrates from an existing Astro static site to **React Router v7 in framework mode** (NOT Remix — Remix merged into RR7 in Nov 2024 and the `@remix-run/*` packages are legacy). The stack is React 19 + Vite 7 + Tailwind CSS v4 + Cloudflare Pages, with recipes stored as YAML flat files in the git repo and validated by Zod schemas. All versions have been verified against npm and official templates as of today.

The recommended approach is **pre-render everything at build time** with SSR fallback via Cloudflare Workers. Since all content is flat-file and changes only on git push, pre-rendering gives free unlimited CDN delivery, avoids Workers CPU limits (10ms cap on free tier), and guarantees recipes work without JavaScript. The critical differentiator is **cooking mode** — a full-screen, step-by-step kitchen companion with Screen Wake Lock, large touch targets for wet hands, and progressive enhancement. Community annotations (substitution tips pinned to recipe steps) and themed seasonal packs are the other major differentiators, but both are complex and should come after the core recipe experience is solid.

The top risks are: (1) using legacy Remix packages instead of React Router v7 — this must be caught at scaffolding, (2) the Cloudflare Workers runtime has no file system, so recipe data must be embedded at build time or pre-rendered, not read at request time, and (3) the current YAML schema is missing 9+ fields required for Google Recipe rich results (the primary discovery channel for recipe sites). All three are resolvable with correct scaffolding and data model decisions in the first two phases.

## Key Findings

### Recommended Stack

The stack is anchored on the official React Router v7 Cloudflare template (`remix-run/react-router-templates/cloudflare`). All packages are pinned to verified stable versions — critically, **Vite 7.x** (not Vite 8, released today with unverified RR7 compatibility) and **TypeScript 5.9** (not TS 6.0, also released today).

**Core technologies:**
- **React Router 7.13.2** (framework mode): Full-stack framework — SSR, loaders, nested routing. This IS Remix, repackaged.
- **React 19.2.4**: Stable, server components support future-proofs architecture.
- **Vite 7.1.7**: Official RR7 build tool. Avoid Vite 8 (too new).
- **Tailwind CSS 4.2.2**: CSS-first config (no JS config file), native `@theme` directive for seasonal theming.
- **Cloudflare Pages + Workers**: Unlimited bandwidth, edge SSR, generous free tier, official RR7 template.
- **YAML + Zod**: Recipes as `.yml` flat files, validated at build/load time with Zod schemas for type safety.
- **Vitest + Playwright**: Unit/integration testing (Vitest) and E2E testing (Playwright).

**Version warnings:** Do NOT use Vite 8, TypeScript 6, or any `@remix-run/*` packages.

### Expected Features

**Must have (table stakes):**
- Clean recipe display — title, ingredients (grouped by component), numbered steps, image, attribution. No bloat.
- Mobile-responsive layout — kitchen use is the primary context, mobile-first design required.
- Recipe browsing/discovery — browse all, filter by tag/cuisine/category/ingredient.
- SEO: JSON-LD structured data (Schema.org/Recipe), meta tags, Open Graph, sitemap, clean URLs.
- Print-friendly CSS — low effort, high value for kitchen users.
- Accessible HTML — semantic elements, heading hierarchy, alt text, sufficient contrast.
- Fast page loads — sub-second, minimal JS, no third-party scripts.
- Attribution/source links — already in existing data model, display prominently.

**Should have (differentiators):**
- **Cooking mode** — full-screen step-by-step with Wake Lock, large touch targets (48px+), step navigation. The killer feature.
- **Structured ingredient parsing** — unlocks scaling, shopping views, and Schema.org `recipeIngredient`.
- **Ingredient scaling** — adjust servings, quantities update proportionally.
- **Git-native contribution workflow** — PR templates, CI validation, contributor guide (Hacktoberfest target).
- **Community annotations** — inline substitution tips pinned to specific steps/ingredients. Novel but complex.

**Defer (v2+):**
- Shopping view (requires robust ingredient categorization)
- Themed recipe packs (cosmetic, build after core is solid)
- Recipe versioning (depends on annotation traction)
- Offline support / service worker
- Recipe component dependencies (edge case for complex recipes)
- Contributor profiles (auto-generate from git data later)

### Architecture Approach

Hybrid pre-render + SSR fallback on Cloudflare Pages. All recipe content lives as YAML flat files in `content/` (sibling to `app/`), parsed by server-only utilities (`.server.ts` files) at build time, pre-rendered to static HTML, and served via Cloudflare CDN. The SSR Worker handles cache misses. Progressive enhancement adds cooking mode interactivity — recipes are fully readable without JavaScript. Explicit route config (`routes.ts`) over file-convention routing for clarity.

**Major components:**
1. **Content Layer** (`*.server.ts`) — parses YAML, validates with Zod, returns typed Recipe/Annotation/Pack objects. Server-only, never in client bundle.
2. **Route Loaders** — load + shape data per page. Run at build time (pre-render) and SSR time (fallback).
3. **Recipe Views** — display recipe in list, detail, and cooking modes. Separate route modules for code-splitting.
4. **Cooking Mode** (client-only) — Wake Lock API, localStorage progress, large touch targets, step navigation.
5. **Theme Engine** — CSS custom properties from active pack, injected at SSR via root loader. No runtime JS switching.
6. **Annotation Display** — inline tips rendered from separate annotation YAML files, decoupled from recipe files.

### Critical Pitfalls

1. **"Remix" is dead — use React Router v7.** Any `@remix-run/*` dependency means building on a legacy namespace. Use `react-router` and `@react-router/*` exclusively. Detection: `package.json` contains `@remix-run/*`.

2. **No file system on Cloudflare Workers.** `fs.readFileSync()` in loaders will crash in production. Recipe data must be embedded at build time (Vite plugin) or pre-rendered to static HTML. Test with `wrangler dev` early.

3. **Recipe YAML missing Schema.org fields.** Current format lacks `prepTime`, `cookTime`, `totalTime`, `servings`, `category`, `cuisine`, `keywords`, `datePublished` — 9+ fields. Without `application/ld+json` Recipe markup, the site is invisible to Google's recipe carousel.

4. **Cloudflare Workers 10ms CPU cap** on free tier. React SSR can exceed this on complex pages. Mitigation: pre-render everything — static assets are free and unlimited.

5. **Server code leaking into client bundles.** Importing YAML parsers or `fs` at route module top level bloats client bundles. All server-only code must live in `*.server.ts` files.

## Implications for Roadmap

### Phase 1: Project Scaffolding + Deployment Skeleton
**Rationale:** Every subsequent phase depends on correct framework choice and working deployment. Catches the #1 critical pitfall (Remix vs RR7) immediately.
**Delivers:** Working React Router v7 app on Cloudflare Pages with Tailwind CSS v4, TypeScript, dev/build/deploy scripts. Deployed skeleton at custom domain.
**Addresses:** Framework scaffolding, hosting setup, basic tooling.
**Avoids:** Pitfall 1 (legacy Remix), Pitfall 4 (Workers limits — confirms pre-render works early).

### Phase 2: Data Layer + Recipe Schema
**Rationale:** Content architecture must be finalized before any rendering code. Schema.org compliance must be designed in, not retrofitted. The YAML format change affects every recipe file.
**Delivers:** Enhanced recipe YAML schema (with Schema.org fields), Zod validation, `*.server.ts` content utilities, recipe type definitions, migration of existing 2 recipes.
**Addresses:** Structured ingredient lists, Schema.org compliance, data validation.
**Avoids:** Pitfall 2 (no fs in Workers — data reading strategy resolved), Pitfall 3 (missing Schema.org fields), Pitfall 15 (schema versioning).

### Phase 3: Recipe Display + SEO
**Rationale:** Core recipe rendering — the entire site promise. Depends on data layer from Phase 2. SEO must ship with the first recipe page, not after.
**Delivers:** Recipe list page, recipe detail page, JSON-LD structured data, meta tags, Open Graph, sitemap, print CSS, responsive mobile-first layout, pre-rendering of all recipes.
**Addresses:** All table-stakes display features, SEO markup, responsive design, accessibility.
**Avoids:** Pitfall 3 (Schema.org), Pitfall 5 (server/client boundary), Pitfall 10 (progressive enhancement), Pitfall 11 (image optimization).

### Phase 4: Cooking Mode
**Rationale:** The primary differentiator. Can be built independently after recipe display works. Pure client-side enhancement, doesn't affect other features.
**Delivers:** Full-screen step-by-step view, Screen Wake Lock, 48px+ touch targets, step navigation, checkable steps, native HTML fallback without JS.
**Addresses:** Cooking mode, progressive enhancement.
**Avoids:** Pitfall 6 (Wake Lock), Pitfall 7 (kitchen touch targets), Pitfall 14 (cooking-specific a11y).

### Phase 5: Contribution Workflow
**Rationale:** Enables community growth. Should ship before Hacktoberfest (October). Depends on finalized recipe data format from Phase 2.
**Delivers:** CONTRIBUTING.md, recipe PR template, CI validation (GitHub Actions), `/contribute` page, issue templates, `good-first-issue` labels.
**Addresses:** Git-native contribution, non-technical contribution path, recipe validation.
**Avoids:** Pitfall 8 (YAML contributor friction), Pitfall 12 (Hacktoberfest spam).

### Phase 6: Ingredient Parsing + Scaling
**Rationale:** Unlocks scaling feature (high user demand) and is prerequisite for shopping view. Requires structured ingredient data from Phase 2 schema.
**Delivers:** Parsed quantity/unit/ingredient data, servings-based scaling UI, updated Schema.org `recipeIngredient`.
**Addresses:** Structured ingredients, ingredient scaling.

### Phase 7: Community Annotations (Design + MVP)
**Rationale:** Novel feature, highest complexity. Needs careful architecture — git-based annotations don't scale without design forethought. Should be an MVP (recipe-level tips) before step-pinned annotations.
**Delivers:** Annotation YAML schema, display of inline tips on recipes, contributor workflow for annotation PRs.
**Addresses:** Community annotations (MVP scope).
**Avoids:** Pitfall 9 (annotation merge conflicts — decoupled files with stable step IDs).

### Phase 8: Themed Packs + Polish
**Rationale:** Cosmetic but impactful. CSS custom property theming is straightforward with Tailwind v4. Build after core experience is production-ready.
**Delivers:** Pack YAML schema, CSS theme switching, seasonal pack landing pages, curated recipe collections.
**Addresses:** Themed recipe packs, CSS theming.
**Avoids:** Pitfall 13 (CSS specificity — uses CSS custom properties exclusively).

### Phase Ordering Rationale

- **Phases 1-3 are strictly sequential** — each depends on the prior phase (scaffolding → data → display).
- **Phases 4-7 are parallelizable** after Phase 3 — cooking mode, contributions, scaling, and annotations are independent feature tracks.
- **Phase 5 (contributions) has a hard deadline** — must ship before October for Hacktoberfest.
- **Phase 7 (annotations) is deliberately late** — the most complex feature with the most architectural risk. Start with MVP, iterate based on real usage.
- **Phase 8 (theming) is deferred** — high delight but not essential for launch. Can be built anytime after Phase 3.
- **Deployment (Phase 1) ships first** — deploy a skeleton early, deploy continuously. No "big bang" launch.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Data Layer):** Cloudflare Vite plugin pre-rendering support status needs verification. If blocked, evaluate Vite build-time data embedding approaches.
- **Phase 4 (Cooking Mode):** Kitchen UX patterns — screen reader interaction during cooking, voice control feasibility, timer auto-detection from step text.
- **Phase 7 (Annotations):** No precedent for git-based annotation systems at scale. Architecture needs careful design — may need eventual external store (Cloudflare D1/KV).

Phases with standard patterns (skip research-phase):
- **Phase 1 (Scaffolding):** Official RR7 Cloudflare template exists — follow it exactly.
- **Phase 3 (Recipe Display):** Well-documented SSR + JSON-LD patterns, extensive Google docs.
- **Phase 5 (Contribution Workflow):** Standard GitHub PR template + Actions CI patterns.
- **Phase 6 (Scaling):** Straightforward quantity parsing with well-known algorithms.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm registry and official templates on 2026-03-23. Pinned to stable releases, avoided bleeding-edge (Vite 8, TS 6). |
| Features | HIGH | Table stakes validated against Schema.org/Recipe, Google structured data docs, based.cooking (direct comparable), and Cooklang ecosystem. |
| Architecture | HIGH | Pre-render + SSR fallback is the established pattern for content-driven sites on Cloudflare. RR7 docs and templates directly support it. |
| Pitfalls | HIGH | Critical pitfalls verified against Cloudflare Workers runtime docs, RR7/Remix migration guides, and Google Recipe structured data requirements. |

**Overall confidence:** HIGH

### Gaps to Address

- **Cloudflare Vite plugin pre-rendering:** The `@cloudflare/vite-plugin` may not fully support React Router v7's `prerender()` config. Needs hands-on verification in Phase 1. Fallback: embed data at build time via custom Vite plugin.
- **Structured ingredient parsing accuracy:** Converting string ingredients ("2 c all-purpose flour") into `{ quantity, unit, item }` objects is a known NLP-adjacent problem. No off-the-shelf library selected yet — evaluate during Phase 6 planning.
- **Annotation anchoring stability:** If recipe steps are reordered or edited, annotation references break. Stable step IDs help but don't fully solve the problem. Needs design iteration.
- **Image optimization pipeline:** No specific image optimization solution selected. Cloudflare Image Resizing is paid; need to evaluate Vite-based alternatives or require contributors to submit optimized images.
- **Workers free tier adequacy under viral load:** 100K requests/day is fine for early stage but could be hit during Hacktoberfest or viral sharing. Pre-rendering mitigates (static assets are unlimited), but monitor.

## Sources

### Primary (HIGH confidence)
- React Router v7 official docs — routing, data loading, pre-rendering, route modules
- Cloudflare Workers/Pages docs — pricing, limits, deployment guide, React Router integration
- Google Recipe structured data — required/recommended fields for rich results (updated Dec 2025)
- Schema.org Recipe type v30.0 (March 2026)
- npm registry — all package versions verified 2026-03-23
- Official RR7 Cloudflare template — `remix-run/react-router-templates/cloudflare`

### Secondary (MEDIUM confidence)
- based.cooking — validates git-based community recipe model (~200+ contributors)
- Cooklang ecosystem — validates demand for ingredient scaling, shopping lists, recipe dependencies
- Screen Wake Lock API MDN docs — browser support and usage patterns

### Tertiary (LOW confidence)
- Kitchen UX touch target sizing — based on UX research patterns, no single authoritative source
- Git-based annotation scaling — architecture pattern analysis, no direct precedent at scale

---
*Research completed: 2026-03-23*
*Ready for roadmap: yes*
