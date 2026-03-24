# Phase 2: Recipe Display & SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 02-Recipe Display & SEO
**Areas discussed:** Recipe page layout, Recipe listing page, Step checkboxes & interaction, Print & SEO details

---

## Recipe Page Layout

### Composition

| Option | Description | Selected |
|--------|-------------|----------|
| Top-down single column | Image at top, then title/meta, then ingredients and steps in a single column below. Simple, mobile-native. | |
| Two-column (image + ingredients) | Image and ingredients side by side at the top, steps below. Uses horizontal space on desktop. | |
| Compact header with thumbnail | Small image beside the title as a thumbnail, then full-width ingredients and steps below. De-emphasizes the photo. | ✓ |

**User's choice:** Compact header with thumbnail
**Notes:** De-emphasizes photo in favor of recipe content — deliberate anti-pattern to mainstream recipe sites.

### Background/Flavor Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Below recipe, muted style | Show background and flavor text in a muted section below the recipe steps — present but secondary. | ✓ |
| Hidden entirely | Don't show background/flavor at all on the recipe page. | |
| Brief intro above recipe | Show as a brief italic intro above the recipe (risks 'preamble' feel). | |

**User's choice:** Below recipe, muted style
**Notes:** Keeps "no preamble" principle — story is there but doesn't compete with the recipe.

### Attribution

| Option | Description | Selected |
|--------|-------------|----------|
| Footer section with source links | Links section at the bottom after background/flavor — clear attribution. | ✓ |
| Prominent header attribution | Byline and source link directly under the title, before ingredients. | |

**User's choice:** Footer section with source links

### Sticky Ingredients

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — sticky ingredients sidebar on desktop | Ingredients in a sticky sidebar while steps scroll. Collapses on mobile. | |
| No — simple linear flow | Keep ingredients and steps in the same single flow. No sticky behavior. | ✓ |

**User's choice:** No — simple linear flow

---

## Recipe Listing Page

### Listing Style

| Option | Description | Selected |
|--------|-------------|----------|
| Card grid with thumbnails | Visual grid of recipe cards with thumbnail, title, and short blurb. Responsive columns. | |
| Simple text list | Recipe titles as links with supporting text. Minimal, fast, ultra-clean. | ✓ |
| Full-width rows | Each recipe gets a full-width row with image, title, and excerpt. Magazine-style. | |

**User's choice:** Simple text list

### Info Per Recipe

| Option | Description | Selected |
|--------|-------------|----------|
| Title only | Just the recipe title, clickable. Maximum simplicity. | |
| Title + byline | Title plus byline (author name). | |
| Title + byline + flavor | Title, byline, and flavor text (tagline). More info but still text-only. | ✓ |

**User's choice:** Title + byline + flavor

---

## Step Checkboxes & Interaction

### Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| Ephemeral (session only) | Checkboxes disappear on page reload. No localStorage, no state tracking. | ✓ |
| Persist in localStorage | Save checked state to localStorage so returning remembers progress. | |

**User's choice:** Ephemeral (session only)

### Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Dimmed opacity | Checked steps get reduced opacity to push focus to unchecked steps. | |
| Strikethrough + check icon | Checked steps get a strikethrough on the text + a check icon. | ✓ |
| Background color change | Checked steps get a subtle background color change. | |

**User's choice:** Strikethrough + check icon

### JavaScript Requirement

| Option | Description | Selected |
|--------|-------------|----------|
| Progressive enhancement | Checkboxes require JS. Without JS, steps display as numbered list but aren't interactive. | |
| Native HTML checkboxes | Render `<input type="checkbox">` in HTML, functional without scripts. | ✓ |

**User's choice:** Native HTML checkboxes
**Notes:** Aligns with DISP-08 (JS enhances but isn't required to read). CSS `:checked` pseudo-class can handle strikethrough styling without JS.

---

## Print & SEO Details

### Print Stylesheet

| Option | Description | Selected |
|--------|-------------|----------|
| Recipe essentials only | Title, ingredients, steps, attribution. No image, no background, no chrome. | |
| Full page minus chrome | Everything on the page minus nav chrome. | |
| Recipe + image, no story | Recipe + image, strips background and flavor. | |

**User's choice:** Initially selected "Full page minus chrome" — then revised via free text.
**Revised to:** Title, ingredients, steps, flavor text, attribution. No image, no background story. Text-only.
**Notes:** User wants text-only print. Also mentioned wanting a small pack icon (like MTG set symbols) in print — deferred to Phase 4 (Themed Packs).

### Meta Description

| Option | Description | Selected |
|--------|-------------|----------|
| Flavor text as description | Use 'flavor' field as meta description. Fall back to truncated 'background' if no flavor. | ✓ |
| Auto-generated from title + components | Auto-generate from recipe title + first ingredient group name. | |
| You decide | Agent decides. | |

**User's choice:** Flavor text as description
**Notes:** User suggested making `flavor` a required field in the schema.

### Sitemap Generation

| Option | Description | Selected |
|--------|-------------|----------|
| Dynamic SSR sitemap | Auto-generate sitemap.xml from recipe slug list at request time. | |
| Static build-time sitemap | Generate sitemap.xml as static file during build/CI. | ✓ |

**User's choice:** Static build-time sitemap

---

## Agent's Discretion

- Page title format for recipe pages
- Typography sizing and spacing for kitchen readability
- Responsive breakpoints and tap target sizing
- robots.txt content

## Deferred Ideas

- Pack icon in print output (Phase 4 — Themed Packs)
- Making `flavor` a required schema field (schema cleanup)
