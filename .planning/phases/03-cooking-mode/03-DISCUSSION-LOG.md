# Phase 3: Cooking Mode - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 03-cooking-mode
**Areas discussed:** Entry & exit, Step navigation, Ingredient-step linking, Visual treatment

---

## Entry & Exit

### How should users enter cooking mode?

| Option | Description | Selected |
|--------|-------------|----------|
| In-page toggle | Big "Start Cooking" button transforms current page into cooking mode (same URL) | |
| Separate URL | Button navigates to /recipes/:slug/cook — dedicated URL, bookmarkable | ✓ |
| Fullscreen overlay | Button opens overlay/modal over the recipe page | |

**User's choice:** Separate URL
**Notes:** Allows bookmarking and sharing the cooking view directly.

### How should users exit cooking mode?

| Option | Description | Selected |
|--------|-------------|----------|
| Exit button in corner | Small X or "Exit" in the corner, navigates back to recipe page | ✓ |
| Browser back only | No explicit exit UI, rely on browser back button | |
| Exit with confirmation | Exit button plus "Are you sure?" confirmation dialog | |

**User's choice:** Exit button in corner
**Notes:** Minimal chrome approach — cooking mode stays focused.

### No-JS fallback behavior?

| Option | Description | Selected |
|--------|-------------|----------|
| Graceful fallback | Cooking mode works — large text, steps displayed, no wake lock. Button still appears. | ✓ |
| Hide if no JS | Hide "Start Cooking" button entirely when JS unavailable | |
| Show with disclaimer | Show button with a note about JS requirement | |

**User's choice:** Graceful fallback
**Notes:** Aligns with progressive enhancement philosophy — base experience works, JS adds wake lock.

---

## Step Navigation

### How should steps be presented?

| Option | Description | Selected |
|--------|-------------|----------|
| One step at a time (card) | Each step fills viewport. Maximum focus, no scrolling. | ✓ |
| Scrollable list, active highlighted | All steps visible, active step enlarged/highlighted | |
| Hybrid: list + zoom | Start with all visible, tap to zoom into single step | |

**User's choice:** One step at a time (card)
**Notes:** Maximum focus for kitchen use — no scrolling distractions.

### How should users move between steps?

| Option | Description | Selected |
|--------|-------------|----------|
| Prev/Next buttons | Large buttons at the bottom. Straightforward, no gesture ambiguity. | ✓ |
| Swipe gestures | Left/right swipe on mobile, needs desktop fallback | |
| Buttons + swipe | Both — most flexible but more JS | |

**User's choice:** Prev/Next buttons
**Notes:** 48px+ tap targets, no swipe gesture complexity.

### Progress indication?

| Option | Description | Selected |
|--------|-------------|----------|
| Step counter + progress bar | "Step 3 of 8" text + thin progress bar at top | ✓ |
| Dot indicators (tappable) | Carousel-style dots, tap to jump | |
| Step counter only | Just text, no visual bar | |

**User's choice:** Step counter + progress bar
**Notes:** Minimal but informative — user always knows position.

---

## Ingredient-Step Linking

### How should ingredients be mapped to steps?

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-match (pattern matching) | Parse step text for ingredient names from components list at render time | ✓ |
| Explicit YAML annotation | New YAML field per step with ingredient references | |
| Show all ingredients per step | Full ingredient list alongside every step | |

**User's choice:** Auto-match (pattern matching)
**Notes:** Zero schema changes, works for existing recipes. May miss styled references but good enough for v1.

### How should matched ingredients be displayed?

| Option | Description | Selected |
|--------|-------------|----------|
| Ingredient panel per step | Dedicated panel alongside step text (above/below on mobile) | ✓ |
| Inline text highlighting | Bold/highlight ingredient words within step text | |
| Panel + inline highlights | Both approaches combined | |

**User's choice:** Ingredient panel per step
**Notes:** Clear visual separation — ingredients in their own space, not mixed into step text.

---

## Visual Treatment

### Color scheme for cooking mode?

| Option | Description | Selected |
|--------|-------------|----------|
| Dark mode | Dark background, light text. High contrast, reduces glare. | |
| Light mode (enlarged) | Keep cream palette with larger text and stripped chrome | |
| Follow system preference | Match system/browser dark mode setting | ✓ |

**User's choice:** Follow system preference
**Notes:** Respects user's existing device settings, no manual toggle needed.

### Site chrome in cooking mode?

| Option | Description | Selected |
|--------|-------------|----------|
| Fully stripped | No nav, no header — only cooking UI elements | ✓ |
| Minimal branding | Site name in corner, no nav links | |
| Keep nav | Full nav bar, different content layout | |

**User's choice:** Fully stripped
**Notes:** Maximum focus — only step content, ingredients, navigation, progress, and exit.

### Text sizing?

| Option | Description | Selected |
|--------|-------------|----------|
| Extra large text | 24px+ (1.5rem+) for step text, slightly smaller ingredient panel | ✓ |
| Moderately larger | 1.25× current sizes | |
| You decide | Agent discretion on sizing | |

**User's choice:** Extra large text
**Notes:** Readable at arm's length — essential for kitchen use with wet/messy hands.

---

## Agent's Discretion

- Dark mode color palette specifics
- Light mode cooking adjustments
- Progress bar styling and placement
- Auto-matching edge case handling (partial matches, plurals)
- "Start Cooking" button styling and placement
- Wake Lock API implementation and error handling
- Step card layout proportions and spacing

## Deferred Ideas

None — discussion stayed within phase scope
