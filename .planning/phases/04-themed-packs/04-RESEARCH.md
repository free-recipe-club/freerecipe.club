# Phase 4: Themed Packs — Research

**Researched:** 2026-03-24
**Phase Requirements:** PACK-01, PACK-02, PACK-03

## Research Question

What do I need to know to PLAN a CSS theme system, pack data model, pack pages, and theme picker for this server-rendered alpha Remix app?

---

## Standard Stack

This phase builds on established patterns — no new external dependencies needed.

| Concern | Approach | Rationale |
|---------|----------|-----------|
| Theme system | CSS custom properties + body class | Already proven by cooking mode `.cook-mode` pattern in `input.css` |
| Pack data | YAML files in `data/packs/` + Zod schema | Matches existing recipe data pattern exactly |
| Theme picker | Vanilla JS + localStorage | Project already has one client JS file (`cook.js`); same pattern |
| Pack routes | Server-rendered HTML via `render()` helper | Matches all existing routes |
| Active pack config | Simple YAML file `data/packs/_active.yml` | Consistent with flat-file data model |

**No new npm packages required.** The existing `yaml`, `zod`, and `tailwindcss` dependencies cover everything.

---

## Architecture Patterns

### 1. CSS Custom Property Theme System

**How it works:** A CSS class on `<body>` (e.g., `theme-autumn-harvest`) overrides custom property values. All components consume `var(--theme-*)` tokens.

**Existing pattern to extend:** The `.cook-mode` block in `input.css` already demonstrates this exact approach:
```css
.cook-mode {
  --cook-bg: #fdf6e3;
  --cook-surface: #f0ead4;
  /* ... */
}
```

**What changes for themes:**
1. Define base `--theme-*` properties in `@theme` block (or as CSS defaults on `body`)
2. Define `.theme-autumn-harvest` class with overrides
3. Replace hardcoded `bg-brand-cream text-gray-900` in `render()` with theme-aware `var()` values
4. Cooking mode `.cook-mode` variables become theme-aware (set within the theme class)

**Key consideration — Tailwind v4 integration:** The `@theme` block in `input.css` currently defines brand colors as `--color-brand-green` and `--color-brand-cream`. These are Tailwind design tokens that generate utility classes (`bg-brand-cream`, `text-brand-green`).

**Approach for theme-aware Tailwind:** Define `--theme-*` custom properties as CSS variables, then use them via inline `style` attributes or direct `var()` in CSS. Tailwind v4's `@theme` block can reference CSS variables, but the simplest approach is:
- Keep `@theme` for structural tokens (font families, spacing)
- Use `var(--theme-*)` directly in templates via `style` attributes on body
- Use Tailwind utilities for layout/spacing, CSS variables for colors/typography

This avoids needing to regenerate Tailwind classes per theme and keeps theme switching instant (class swap only).

### 2. Pack Data Model

**Schema pattern:** Mirrors the recipe schema approach:
```
data/packs/
  _active.yml        # { active: "autumn-harvest" }
  autumn-harvest.yml  # Pack metadata
```

**Loading pattern:** Mirror `loadRecipe()` / `loadRecipes()` from `app/data/recipes.ts`:
- `loadPack(slug)` → reads and validates single pack YAML
- `loadPacks()` → reads all pack files (excluding `_active.yml`)
- `getActivePack()` → reads `_active.yml`, returns slug
- `loadActivePackThemeClass()` → returns the theme class name for `render()`

**Zod schema fields:**
```typescript
const PackSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  theme_class: z.string().min(1),
  colors: z.object({
    bg: z.string(),
    bg_muted: z.string(),
    surface: z.string(),
    accent: z.string(),
    accent_hover: z.string(),
    text: z.string(),
    text_secondary: z.string(),
    border: z.string(),
  }),
  typography: z.object({
    heading_font: z.string(),
    body_font: z.string(),
  }),
})
```

**Recipe pack field:** Add optional `pack: z.string().optional()` to `RecipeSchema`. Recipes with a pack slug get a badge; recipes without are "unaffiliated" but still display under the active theme.

### 3. Theme-Aware render() Function

**Current state:** `render()` outputs hardcoded `bg-brand-cream text-gray-900 font-sans`. This is the single point of integration for the site-wide theme.

**Target state:**
```html
<body class="theme-autumn-harvest min-h-screen"
      style="background:var(--theme-bg);color:var(--theme-text);font-family:var(--theme-body-font)">
```

**How to provide the theme class:** `render()` needs to know the active theme class. Options:
1. **Module-level cache:** Load `_active.yml` once at startup, export the theme class. Simple, works for single-pack v1.
2. **Pass as parameter:** Add `themeClass` to `render()` options. More flexible but requires threading through all controllers.

**Recommendation:** Option 1 — module-level. Load the active pack at module initialization in a new `app/data/packs.ts`. Export `getActiveThemeClass()`. The `render()` function calls it internally. When the active pack changes (maintainer updates `_active.yml`), server restart picks it up. This is fine for v1.

### 4. Theme Picker Client JS

**Existing pattern:** `cook.js` at 75 lines — vanilla JS, `DOMContentLoaded`, direct DOM manipulation. The theme picker follows the same approach.

**Key behaviors:**
1. **Blocking `<script>` in `<head>`** — reads `frc-theme` from localStorage and sets body class BEFORE first paint. This prevents flash of wrong theme (FOWT).
2. **`public/theme.js`** — handles picker toggle, selection, persistence. Loaded with `defer`.

**Head script (inline in render()):**
```html
<script>
(function(){var t=localStorage.getItem('frc-theme');if(t)document.documentElement.className=t})()
</script>
```

Actually, since the theme class goes on `<body>`, and `<body>` hasn't been parsed when `<head>` scripts run, the approach is:
- Set a CSS class on `<html>` element in the head script
- OR use the `<body>` `onload` attribute
- OR set a `data-theme` attribute on `<html>` and use CSS `:root[data-theme="autumn-harvest"]`

**Recommended approach:** Set the class on `<html>` via the inline head script, and also set it on `<body>` server-side. The head script prevents FOWT for returning visitors with a localStorage override. Server-rendered body class handles first-time visitors.

```html
<head>
  <script>(function(){var t=localStorage.getItem('frc-theme');if(t)document.documentElement.className=t})()</script>
</head>
<body class="theme-autumn-harvest ...">
```

CSS selectors work on either:
```css
.theme-autumn-harvest { --theme-bg: #faf5eb; }
/* Applied to <html> OR <body> — both work since properties cascade */
```

### 5. Pack Routes and Controllers

**URL structure:** `/packs` (index) and `/packs/:slug` (individual pack page).

**Route definition pattern (from routes.ts):**
```typescript
export let routes = route({
  // ... existing routes
  packs: {
    index: '/packs',
    show: '/packs/:slug',
  },
})
```

**Controller pattern:** Each route gets a controller function that receives a Request and returns a Response via `render()`. Exact same pattern as `recipesIndex()`, `recipeShow()`, etc.

**Pack page theme override:** Individual pack pages (`/packs/:slug`) render with their own theme class, not the site-wide active theme. The `render()` function needs to accept a theme class override:
```typescript
render(title, content, { themeClass: pack.theme_class })
```

### 6. Cooking Mode Theme Integration

**Current:** `.cook-mode` sets hardcoded light/dark color values.
**Target:** Theme class sets the cook-mode variables. The `.cook-mode` CSS just consumes `var(--cook-*)` as it already does.

In the theme CSS:
```css
.theme-autumn-harvest {
  /* site-wide */
  --theme-bg: #faf5eb;
  /* ... */
  /* cooking mode light */
  --cook-bg: #faf5eb;
  --cook-surface: #f0e6d3;
  /* ... */
}
@media (prefers-color-scheme: dark) {
  .theme-autumn-harvest .cook-mode {
    --cook-bg: #1c1917;
    /* ... */
  }
}
```

The `cook.tsx` controller doesn't use `render()` — it has its own full HTML. It needs to set the theme class on the `<body>` alongside `cook-mode`:
```html
<body class="theme-autumn-harvest cook-mode" ...>
```

### 7. Hardcoded Color Replacements

Templates currently use Tailwind color utilities that reference the old brand palette. These need to be replaced with theme-aware values:

| Current | Replacement | Files |
|---------|-------------|-------|
| `bg-brand-cream` | `style="background:var(--theme-bg)"` (on body only) | `render.tsx` |
| `text-brand-green` | `style="color:var(--theme-accent)"` or theme-aware class | `render.tsx`, `show.tsx`, `index.tsx`, `home/controller.tsx`, `not-found.tsx` |
| `text-gray-900` | `style="color:var(--theme-text)"` (on body) | `render.tsx` |
| `text-gray-600` | `var(--theme-text-secondary)` | `show.tsx`, `index.tsx`, `home/controller.tsx` |
| `bg-brand-green` | `var(--theme-accent)` | `show.tsx` (Start Cooking button) |
| `divide-brand-cream-muted` | `var(--theme-divider)` | `index.tsx` |

**Approach:** Replace Tailwind color classes with inline `style` using CSS variables where the color needs to be theme-aware. Keep Tailwind for structural layout classes (spacing, flexbox, grid, typography sizes). This is the cleanest approach because:
1. CSS custom properties cascade naturally from the body class
2. No need to re-generate Tailwind classes per theme
3. Theme switching is instant (just change the body class)

---

## Don't Hand-Roll

| Concern | Use Instead |
|---------|-------------|
| YAML parsing | `yaml` package (already installed) |
| Schema validation | `zod` (already installed) |
| CSS preprocessing | Tailwind v4 CLI (already configured) |
| Client-side framework | Vanilla JS (project convention) |

Nothing needs to be hand-rolled. Every piece uses existing dependencies and established patterns.

---

## Common Pitfalls

### 1. Flash of Wrong Theme (FOWT)
**Problem:** If the theme class is only set server-side, returning visitors with a localStorage override see the server theme flash before JS applies their choice.
**Solution:** Inline blocking `<script>` in `<head>` that reads localStorage and sets the class on `<html>` before `<body>` paints.

### 2. Tailwind Purging Theme Classes
**Problem:** Tailwind v4 might not see dynamically-generated theme class names.
**Solution:** Theme classes are defined directly in `input.css` as `.theme-autumn-harvest {}` — Tailwind sees them. The class is set server-side in HTML, so it's always present.

### 3. Cooking Mode Body Class Conflict
**Problem:** Cooking mode currently sets `<body class="cook-mode">`. Pack pages set `<body class="theme-autumn-harvest">`. Cooking mode needs BOTH classes.
**Solution:** `cook.tsx` outputs `<body class="theme-autumn-harvest cook-mode" ...>`. The theme class sets `--cook-*` variables, `.cook-mode` CSS consumes them.

### 4. Pack Page Theme Override vs. Site Theme
**Problem:** Pack pages should render with their own theme, not the active site theme. But the theme picker's localStorage value shouldn't be overridden.
**Solution:** Pack pages pass their pack's `theme_class` to `render()`, bypassing the active pack config. The theme picker JS on pack pages should show the pack's theme as temporarily active but not persist it unless the user explicitly selects it.

### 5. Recipe Loading with Pack Filter
**Problem:** Pack pages need to show only recipes tagged with that pack slug.
**Solution:** Add `loadRecipesByPack(packSlug)` function that filters `loadRecipes()` by the `pack` field. Simple filter — no complex querying needed.

---

## Validation Architecture

### Test Approach

This project has no test framework installed. Validation uses CLI commands and server response checks.

**Quick verification pattern (from prior phases):**
```bash
npx tsx scripts/validate-recipes.ts          # Recipe YAML validation
curl -s http://localhost:3000/packs | head    # Pack index renders
curl -s http://localhost:3000/packs/autumn-harvest | head  # Pack page renders
```

**Automated checks per requirement:**

| Requirement | Verification | Command |
|-------------|-------------|---------|
| PACK-01 (first themed pack) | `data/packs/autumn-harvest.yml` exists and validates | `npx tsx scripts/validate-recipes.ts` (extend to validate packs) |
| PACK-02 (CSS theme system) | Theme CSS custom properties present in `input.css` | `grep "theme-autumn-harvest" app/styles/input.css` |
| PACK-03 (pack landing page) | `/packs` and `/packs/autumn-harvest` return 200 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/packs` |

### Manual Verifications

| Behavior | Why Manual |
|----------|-----------|
| Theme visually transforms the site (colors, typography) | Visual assessment |
| Theme picker persists selection across page loads | Requires browser interaction with localStorage |
| Pack page renders with pack's own theme | Visual comparison needed |
| Cooking mode inherits theme colors | Visual + system dark mode toggle |

---

## Implementation Sequence

Recommended task grouping based on dependency analysis:

**Wave 1 — Foundation (no dependencies between these):**
1. Pack data model: Zod schema, YAML files, loader functions (`data/packs/`)
2. CSS theme system: custom properties in `input.css`, theme class definitions

**Wave 2 — Integration (depends on Wave 1):**
3. Theme-aware `render()` + update existing templates to use `var(--theme-*)` instead of hardcoded colors
4. Pack routes and controllers (index page, individual pack page)
5. Recipe schema `pack` field + pack badge on recipe pages

**Wave 3 — Enhancement (depends on Wave 2):**
6. Theme picker JS + inline head script for FOWT prevention
7. Home page active pack feature
8. Cooking mode theme integration
9. Human verification checkpoint

**Natural plan boundaries:**
- **Plan 01:** Pack data model + CSS theme system + theme-aware render() (foundational changes that everything else depends on)
- **Plan 02:** Pack routes/pages + recipe pack field + badges (the PACK-03 landing page requirement)
- **Plan 03:** Theme picker JS + home page feature + cooking mode integration + human verify (interactive enhancements)

---

## Key Interfaces

### Files Created
- `app/data/pack-schema.ts` — Zod schema for pack YAML
- `app/data/packs.ts` — Pack loader functions (loadPack, loadPacks, getActivePack, etc.)
- `data/packs/_active.yml` — Active pack config
- `data/packs/autumn-harvest.yml` — First pack YAML data
- `app/controllers/packs/index.tsx` — Pack index controller
- `app/controllers/packs/show.tsx` — Individual pack page controller
- `public/theme.js` — Theme picker + localStorage handling

### Files Modified
- `app/styles/input.css` — Theme custom properties, cooking mode theme integration
- `app/controllers/render.tsx` — Theme-aware body class, inline head script, Packs nav link
- `app/data/recipe-schema.ts` — Add optional `pack` field
- `app/routes.ts` — Add pack routes
- `app/router.ts` — Wire pack controllers
- `app/controllers/home/controller.tsx` — Active pack feature section
- `app/controllers/recipes/show.tsx` — Pack badge, theme-aware colors
- `app/controllers/recipes/index.tsx` — Theme-aware colors, pack badge on listing
- `app/controllers/recipes/cook.tsx` — Theme class on body alongside cook-mode
- `app/controllers/not-found.tsx` — Theme-aware colors
- `data/recipes/pumpkin_doughnut.yml` — Add `pack: autumn-harvest`

---

## RESEARCH COMPLETE

Phase 4 is a Level 0-1 effort — all patterns are established in the codebase. The CSS custom property theme system extends the exact pattern used by cooking mode. The pack data model mirrors the recipe data model exactly. No new dependencies, no architectural decisions needed.
