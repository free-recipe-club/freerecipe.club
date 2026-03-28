---
phase: 03-cooking-mode
plan: 02
subsystem: ui
tags: [vanilla-js, css-custom-properties, dark-mode, wake-lock, accessibility, keyboard-navigation]

requires:
  - phase: 03-cooking-mode
    plan: 01
    provides: Server-rendered cooking mode HTML with DOM contract (IDs, classes, data attributes)

provides:
  - Client-side step navigation (Previous/Next) with one-step-at-a-time display
  - Keyboard navigation (Left/Right arrows, Escape to exit)
  - Wake Lock API integration for screen-on during cooking
  - Dark/light mode CSS via prefers-color-scheme with CSS custom properties
  - Progress bar animation with reduced-motion support
  - "Start Cooking" entry point button on recipe detail page
  - Focus management for screen reader announcements
  - Grouped directions schema — directions field accepts (string | string[])[] for explicit section grouping
  - Section labels in cooking mode derived from YAML groups (no smart matching)
  - Print-optimized layout for both cooking mode and recipe show page

affects: [03-03, cooking-mode-enhancements]

tech-stack:
  added: []
  patterns:
    - "Vanilla JS progressive enhancement — no build step, var-based for browser compat"
    - "CSS custom properties for dark/light theming scoped under .cook-mode"
    - "Wake Lock API with visibilitychange re-acquisition pattern"
    - "Explicit YAML grouping over smart inference — directions mirror components structure"

key-files:
  created:
    - public/cook.js
  modified:
    - app/styles/input.css
    - app/controllers/recipes/show.tsx
    - app/controllers/recipes/cook.tsx
    - app/data/recipe-schema.ts
    - data/recipes/pumpkin_doughnut.yml

key-decisions:
  - "Previous button uses visibility:hidden (not display:none) to keep layout stable"
  - "Wake Lock uses .then() instead of async/await for broader browser compat"
  - "No animations on step transitions — instant show/hide via hidden property"
  - "Focus moves to .cook-step-text on navigation for screen reader announcements"
  - "Replaced ~130 lines of ingredient-matching algorithm with explicit YAML direction groups"
  - "directions field changed from string[] to (string | string[])[] — groups use first element as section name"
  - "Section labels come from YAML, not inferred from ingredient matching"
  - "Print styles reduce font sizes: 11pt body, 14pt headings for recipe show; 14px for cooking mode"

deviations:
  - description: "Removed ingredient matching algorithm in favor of explicit YAML grouping"
    reason: "User feedback: 'not a good idea to make this thing too smart' — prefer explicit data over inference"
    impact: "Plan 03-03 Task 2 (simplify extractIngredientName regex) is now moot — function was deleted"

patterns-established:
  - "Progressive enhancement: server-rendered HTML works without JS, JS adds interactivity"
  - "Dark mode via CSS custom properties + prefers-color-scheme media query"

requirements-completed: [DISP-09, DISP-10]

duration: 5min
completed: 2026-03-24
---

# Plan 03-02: Client-side JS, Cooking Mode CSS, Start Cooking Button Summary

**Interactive cooking mode with step navigation, wake lock, dark/light theming, keyboard shortcuts, and recipe page entry point.**

## Performance

- **Duration:** ~5 min (code pre-existing from prior session)
- **Tasks:** 1 code task completed, 1 human verification checkpoint
- **Files modified:** 3

## Accomplishments
- Created vanilla JS step navigator with Previous/Next buttons and one-step-at-a-time display
- Added keyboard navigation: Left/Right arrows for steps, Escape to exit back to recipe
- Implemented Wake Lock API with automatic re-acquisition on visibility change
- Built dark/light cooking mode CSS using CSS custom properties and prefers-color-scheme
- Added reduced-motion support for progress bar transitions
- Added 44px minimum touch targets on exit button, 56px buttons for navigation
- Added safe-area-inset-bottom padding for notched phones
- Added "Start Cooking" button on recipe detail page (hidden in print)
- Focus management moves to step text for accessible screen reader announcements

## Task Commits

1. **Task 1: Client-side JS + cooking mode CSS + Start Cooking button** - `b0d8caa` (feat), `36a6666` (fix)

## Files Created/Modified
- `public/cook.js` - Step navigation, keyboard shortcuts, wake lock, visibility change handler
- `app/styles/input.css` - Cooking mode CSS variables, dark mode, responsive breakpoints, accessibility
- `app/controllers/recipes/show.tsx` - "Start Cooking" button between header and ingredients

## Decisions Made
- Used `var` instead of `let/const` for broader browser compatibility (no build step)
- Previous button visibility:hidden (not hidden attribute) keeps flex layout stable
- Wake Lock uses Promise .then() pattern instead of async/await

## Deviations from Plan
- Previous button uses `visibility: hidden` instead of `hidden` attribute — improves layout stability
- Added `.cook-section-label` and `.cook-qty` styles for ingredient annotation display from Plan 01

## Issues Encountered
None.
