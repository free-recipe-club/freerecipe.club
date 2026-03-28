# Phase 4: Themed Packs - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

The site launches with a curated themed recipe pack that transforms the visual identity. This covers: a CSS theme system using custom properties, pack data model (YAML metadata + recipe tagging), pack browsing experience (index + individual pack pages), a theme picker for user-selectable themes, and the first pack (autumn/fall). The original green/cream brand identity is replaced by the pack system — there is no "default" unthemed state.

</domain>

<decisions>
## Implementation Decisions

### Theme Architecture
- **D-01:** Body class + CSS custom properties. A class like `theme-autumn-harvest` on `<body>` sets custom properties that override the base values. Pure CSS, no JS needed for server-rendered pages.
- **D-02:** Single active pack is the site-wide default. All visitors see the active pack's theme unless they override it.
- **D-03:** User-selectable theme override via a theme picker in the nav/footer. Selection persisted in localStorage. Small client-side JS for the picker and theme application.
- **D-04:** The original green `#2d5016` / cream `#fdf6e3` brand scheme is retired — there is always an active pack theme. The first pack replaces the current brand identity entirely.

### Pack Data Model
- **D-05:** Recipe YAML gets a `pack` field (string, optional) — a single pack slug. A recipe can belong to at most one pack. Recipes without a pack tag are "unaffiliated" but still display under the active theme.
- **D-06:** Pack metadata lives in dedicated YAML files at `data/packs/<slug>.yml`. Each pack file defines: name, description, theme class name, icon/badge, color palette, typography, and any custom visual properties.
- **D-07:** Active pack is determined by a config field (e.g., in a site config file or packs manifest). Changed by the maintainer when a new season/edition launches.

### Pack Landing Page
- **D-08:** URL structure: `/packs` index page + `/packs/:slug` individual pack pages.
- **D-09:** Pack index (`/packs`) shows themed preview cards — each card uses the pack's theme colors to give a visual taste. Deliberate departure from the text-list style used for recipe listings, since packs ARE visual identities.
- **D-10:** Individual pack pages (`/packs/:slug`) render with full theme immersion — the entire page applies that pack's theme, showing recipes as styled cards within the themed context.
- **D-11:** Pack discovery via both nav bar link (alongside existing "Recipes" link) and home page feature (showcase the active pack).

### Visual Identity Scope
- **D-12:** Full visual transformation per pack — colors, typography, spacing, layout adjustments, border styles, possibly background patterns or imagery. Each pack should feel like a distinct visual edition of the site.
- **D-13:** Themed cooking mode — cooking mode picks up the active theme's colors instead of using hardcoded light/dark palettes. The existing `--cook-*` CSS variables become theme-aware.
- **D-14:** Small icon/badge on recipe cards and recipe pages showing pack membership (e.g., a leaf icon for the autumn pack). Subtle but present.
- **D-15:** First pack is an autumn/fall theme ("Autumn Harvest" or similar) — natural fit for the existing pumpkin doughnut recipe.

### Agent's Discretion
- Exact CSS custom property surface area (which properties are theme-customizable)
- Pack YAML schema field names and structure
- Theme picker UI design and placement within nav/footer
- Autumn pack color palette, typography choices, and icon design
- How the home page features the active pack
- localStorage key naming and theme application logic
- How "unaffiliated" recipes (no pack tag) appear under the active theme
- Pack preview card design on the index page
- Whether pack metadata includes a hero image or just colors/typography
- Route naming conventions for pack routes

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Vision, constraints, analog ethos, anti-pattern philosophy (no ads, no tracking, no dark patterns)
- `.planning/REQUIREMENTS.md` — Phase 4 maps to PACK-01, PACK-02, PACK-03
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria

### Prior Phase Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — Framework decisions (alpha Remix, not RR7), zero third-party scripts, YAML format can evolve
- `.planning/phases/02-recipe-display-seo/02-CONTEXT.md` — Recipe page layout (compact thumbnail, no hero), text list for recipe listings, brand colors, render() pattern
- `.planning/phases/03-cooking-mode/03-CONTEXT.md` — Cooking mode CSS custom property pattern, dark/light mode via system preference, first client JS in the project

### Existing Code (theme-relevant)
- `app/styles/input.css` — Tailwind v4 `@theme` block with brand colors, cooking mode CSS variables (the pattern to extend for pack themes)
- `app/controllers/render.tsx` — HTML render helper with hardcoded `bg-brand-cream text-gray-900` body class (needs to become theme-aware)
- `app/data/recipe-schema.ts` — Zod schema for recipes (needs `pack` field added)
- `app/routes.ts` — Route definitions (needs pack routes added)
- `app/router.ts` — Router setup (needs pack controllers wired)
- `app/controllers/home/controller.tsx` — Home page (needs active pack feature added)
- `data/recipes/pumpkin_doughnut.yml` — Only current recipe (will get pack tag)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@theme` block in `input.css` — CSS custom property infrastructure already exists; pack themes extend this pattern
- `.cook-mode` CSS variables — Demonstrates the exact pattern needed: class on element → custom properties → components use `var(--*)`. Pack themes follow the same approach at the body level
- `render()` helper — Central HTML generation point; adding the theme class here applies it site-wide
- `loadRecipe()` / `loadRecipes()` — Recipe loading functions; pack filtering builds on these
- `escapeHtml()` — Available for template rendering

### Established Patterns
- Controller pattern: function receives Request, returns Response via `render()`
- Server-side rendering with minimal client JS (only cooking mode has JS so far)
- Tailwind v4 CSS-first configuration via `@theme` custom properties
- Static files served from `public/`
- Routes in `routes.ts`, wired in `router.ts`
- Recipe YAML files in `data/recipes/`, validated by Zod schema

### Integration Points
- `render()` body class — add active theme class (e.g., `theme-autumn-harvest`)
- `input.css` — add theme class blocks with CSS custom property overrides
- `recipe-schema.ts` — add optional `pack` field to Zod schema
- `routes.ts` — add `/packs` and `/packs/:slug` routes
- `router.ts` — wire new pack controllers
- `home/controller.tsx` — add active pack feature to home page
- Nav bar in `render.tsx` — add "Packs" link and theme picker
- `public/` — theme picker JS file (second client JS file after cooking mode)
- `data/packs/` — new directory for pack metadata YAML files

</code_context>

<specifics>
## Specific Ideas

- User wants the theme picker to be discoverable in nav/footer — not hidden behind a settings page
- Pack pages should be fully immersive — visiting a pack page renders with that pack's theme, not the active site theme
- The "theme symbol" (icon/badge) should be visible on recipes even if they're not from the current active pack — it indicates pack origin regardless of active theme
- The green/cream brand identity is explicitly being replaced, not preserved as a "classic" option
- This is the second piece of client-side JS in the project (after cooking mode) — theme picker + localStorage

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-themed-packs*
*Context gathered: 2026-03-24*
