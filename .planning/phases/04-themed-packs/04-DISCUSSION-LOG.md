# Phase 4: Themed Packs - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 04-themed-packs
**Areas discussed:** Theme architecture, Pack data model, Pack landing page, Visual identity scope

---

## Theme Architecture

### How should theme switching work?

| Option | Description | Selected |
|--------|-------------|----------|
| Body class + CSS custom properties | A body class sets custom properties. Default theme is the base. Pack themes override. Simple, no JS needed — class set at render time. | |
| Per-pack CSS files | Each pack folder has a CSS file with @theme overrides. Server loads the right one. | |
| Inline CSS variables from data | Theme values stored in pack YAML and injected as inline CSS variables on the body. | |

**User's choice:** Free text — "whatever fits nice balance of feng shui dev experience for this app and idiomatic, web standards, new remix alpha stuff"
**Notes:** Resolved to body class + CSS custom properties as the most idiomatic approach for the stack (Tailwind v4 @theme, SSR, existing cook-mode pattern).

### Should a pack theme apply site-wide or only on pack-related pages?

| Option | Description | Selected |
|--------|-------------|----------|
| Single active pack (site-wide) | One pack is active site-wide at any time. Config determines which. | ✓ (partial) |
| Pack theme scoped to pack pages | Default theme on most pages, pack theme only on pack landing page. | |
| Landing page only | Only the pack landing page gets themed. | |

**User's choice:** Free text — "note that all recipes are available - there is a single active pack theme, but the theme symbol is visible on recipes, even if it's not from the current pack. users can switch to other themes if they prefer, getting a 'retro' look if they like the old themes"
**Notes:** Single active pack site-wide, but users can switch themes. Theme symbol visible on all recipes regardless of active theme. User override via theme picker.

### How should users switch themes?

| Option | Description | Selected |
|--------|-------------|----------|
| Theme picker in nav/footer | Small theme switcher in the nav or footer. Lists available themes. Selection stored in localStorage. | ✓ |
| Button on pack pages | Each pack landing page has a "Use this theme" button. | |
| You decide | Let the agent figure out the best UX. | |

**User's choice:** Theme picker in nav/footer
**Notes:** None

---

## Pack Data Model

### Where should pack definitions live and how are recipes associated?

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated pack YAML files | A YAML file per pack with metadata. Recipes don't need to know about packs. | |
| Pack folders with recipe references | A pack/ folder containing pack metadata YAML plus symlinks or references. | |
| Tags on recipe YAML | Add a 'packs' or 'tags' field to recipe YAML. Recipes self-declare pack membership. | ✓ |

**User's choice:** Tags on recipe YAML
**Notes:** Led to follow-up about where pack-level metadata lives.

### Where does pack-level metadata live?

| Option | Description | Selected |
|--------|-------------|----------|
| Pack metadata in separate files + tags on recipes | Separate pack definition file (data/packs/) holds metadata. Recipes tag themselves with pack slug. | ✓ |
| Single packs manifest file | All pack info in one file. | |
| Convention-only | Derive everything from tag values and conventions. | |

**User's choice:** Pack metadata in separate files + tags on recipes
**Notes:** Dual approach — recipes get a pack tag, packs get their own metadata YAML files.

### Can a recipe belong to multiple packs?

| Option | Description | Selected |
|--------|-------------|----------|
| Single pack per recipe | A recipe can only belong to one pack. Simpler model, clear identity. | ✓ |
| Multiple packs per recipe | A recipe can appear in multiple packs. More flexible but more complex. | |

**User's choice:** Single pack per recipe
**Notes:** None

### How is the currently-active pack determined?

| Option | Description | Selected |
|--------|-------------|----------|
| Config/manifest active pack field | A config field marks which pack is active. Changed by maintainer. | ✓ |
| Auto-detect newest pack | Most recently dated pack is automatically active. | |
| You decide | Agent decides best mechanism. | |

**User's choice:** Config/manifest active pack field
**Notes:** None

---

## Pack Landing Page

### Pack browsing URL structure?

| Option | Description | Selected |
|--------|-------------|----------|
| Individual pack pages (/packs/:slug) | Each pack gets its own URL at /packs/:slug. | |
| Single packs index page | A single /packs page listing all packs. | |
| Index + individual pages | Both /packs index and /packs/:slug detail pages. | ✓ |

**User's choice:** Index + individual pages
**Notes:** None

### What does the /packs index page show?

| Option | Description | Selected |
|--------|-------------|----------|
| Text list (consistent with recipe listing) | Pack name, description, recipe count, link. Simple text list. | |
| Themed preview cards | Visual cards with pack theme colors as preview. | ✓ |
| You decide | Agent decides based on design language. | |

**User's choice:** Themed preview cards
**Notes:** Deliberate departure from text-list recipe listing style — packs ARE visual identities so cards make sense.

### What does an individual pack page look like?

| Option | Description | Selected |
|--------|-------------|----------|
| Description header + recipe text list | Pack description at top, recipe list below in text style. | |
| Fully themed page with styled recipe cards | Full themed immersion — pack page renders with its own theme applied. | ✓ |
| Light theme accent hints | Description header plus recipes with pack accent colors. | |

**User's choice:** Fully themed page with styled recipe cards
**Notes:** Pack pages are fully immersive previews of the visual identity.

### How do users discover packs?

| Option | Description | Selected |
|--------|-------------|----------|
| Nav bar link | Add "Packs" link alongside "Recipes" in nav. | |
| Home page feature | Feature active pack on home page with link to browse all. | |
| Both nav and home page | Nav link + home page feature. | ✓ |

**User's choice:** Both nav and home page
**Notes:** None

---

## Visual Identity Scope

### How much does a theme change?

| Option | Description | Selected |
|--------|-------------|----------|
| Colors + typography + accents | Colors, fonts, link/button styling. Layout stays the same. | |
| Colors only | Swap palette, keep everything else. | |
| Full visual transformation | Colors, typography, spacing, layout adjustments, possibly custom imagery. | ✓ |

**User's choice:** Full visual transformation
**Notes:** Each pack is a distinct visual edition of the site.

### Should the theme extend into cooking mode?

| Option | Description | Selected |
|--------|-------------|----------|
| Themed cooking mode | Cooking mode picks up active theme colors. Cook-mode variables become theme-aware. | ✓ |
| Neutral cooking mode | Cooking mode stays neutral with hardcoded palettes. | |
| You decide | Agent decides based on complexity. | |

**User's choice:** Themed cooking mode
**Notes:** None

### What happens to the current brand identity?

| Option | Description | Selected |
|--------|-------------|----------|
| Classic/default theme (always available) | Green/cream becomes "classic" theme, always available in picker. | |
| Replaced by first pack | Green/cream scheme retired. Always an active pack theme. | ✓ |

**User's choice:** Replaced by first pack
**Notes:** Bold move — pack system IS the visual identity system from day one.

### Theme symbol on recipes?

| Option | Description | Selected |
|--------|-------------|----------|
| Small icon/badge on recipes | Visual badge or icon on recipe cards/pages showing pack membership. Subtle. | ✓ |
| Text label in attribution | Text label (e.g., "From: Autumn Harvest") in attribution area. | |
| No per-recipe indicator | Pack page is the only place association is shown. | |

**User's choice:** Small icon/badge on recipes
**Notes:** None

### First pack vibe?

| Option | Description | Selected |
|--------|-------------|----------|
| Autumn/Fall theme | "Autumn Harvest" or similar — natural fit for pumpkin doughnut. | ✓ |
| Non-seasonal launch theme | Generic "Launch" or "Founding" pack. | |
| Let me describe it | User has specific vision. | |

**User's choice:** Autumn/Fall theme (matches pumpkin doughnut)
**Notes:** None

---

## Agent's Discretion

- CSS custom property surface area
- Pack YAML schema structure
- Theme picker UI design
- Autumn pack color palette and typography
- Home page active pack feature design
- localStorage key naming
- "Unaffiliated" recipe treatment under active theme
- Pack preview card design
- Whether packs include hero images
- Route naming for pack routes

## Deferred Ideas

None — discussion stayed within phase scope
