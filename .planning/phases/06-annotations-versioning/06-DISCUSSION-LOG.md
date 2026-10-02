# Phase 6: Annotations & Versioning - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 06-annotations-versioning
**Areas discussed:** Annotation data model, Annotation display, Contribution workflow, Variant forking

---

## Annotation Data Model

### Q1: Where should annotation data live in the repo?

| Option | Description | Selected |
|--------|-------------|----------|
| Separate annotation files per recipe | Companion file like data/annotations/pumpkin-doughnut.yml | |
| Inline in recipe YAML | Annotations live inside the recipe YAML itself | |
| One file per annotation | Individual files per annotation in a subdirectory | |

**User's choice:** Initially suggested co-located files (like test files beside source), then reconsidered and chose inline in recipe YAML.
**Notes:** User pivoted after considering the tradeoffs — single source of truth and self-contained PR diffs won out.

### Q2: How should annotations reference the recipe element they attach to?

| Option | Description | Selected |
|--------|-------------|----------|
| Numeric index | Reference by step/ingredient number | |
| Text match | Reference by text substring match | |
| Section + position | Section name + ordinal position | |
| Nested under each element | Annotations live directly under the element they annotate | ✓ |

**User's choice:** Nested under each element
**Notes:** This was presented after the inline-in-YAML decision — nesting naturally follows.

### Q3: Schema change acceptance

| Option | Description | Selected |
|--------|-------------|----------|
| Accept the schema change | Ingredients/steps become objects with text + annotations; plain strings as shorthand | ✓ |
| Keep strings, use positional refs | Keep strings unchanged, put annotations in a parallel structure | |

**User's choice:** Accept the schema change

### Q4: Contributor attribution

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, attribute each annotation | Contributor name (GitHub username or display name) stored with each annotation | ✓ |
| No, keep anonymous | Annotations anonymous, git blame provides provenance | |

**User's choice:** Yes, attribute each annotation

---

## Annotation Display

### Q1: How should annotations appear on the recipe page?

| Option | Description | Selected |
|--------|-------------|----------|
| Expandable inline | Small icon/indicator, tap to expand | |
| Always visible | Annotations visible below each annotated element in muted style | |
| Tooltip/popover | Visual marker with popover on hover/tap | |

**User's choice:** Free text — "consider ux but also web standards - and also if a user were to select annotations and then go to cooking mode, it shows them their version"
**Notes:** User introduced the concept of annotation *selection* carrying into cooking mode — a personalized cooking experience through URL-encoded choices.

### Q2: How should users select which annotations to apply?

| Option | Description | Selected |
|--------|-------------|----------|
| Checkboxes — select to apply | Annotations visible inline with checkboxes, selected ones modify cooking mode | |
| Toggles — swap in place | Toggle switches grouped per element, flipping swaps/augments the text | ✓ |
| Pre-cook customization screen | A "Customize" step before entering cooking mode | |

**User's choice:** Toggles — swap in place

### Q3: Persistence of annotation selections

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage | Persists across visits, ephemeral per-device | |
| URL params (shareable) | Shareable links encode selected annotations | ✓ |
| Session only | Selections reset on page refresh | |

**User's choice:** URL params (shareable)
**Notes:** Aligns with no-accounts philosophy — "my version" is a shareable URL.

### Q4: Cooking mode integration

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, annotations carry into cooking mode | Cooking mode reads URL params and shows modified recipe | ✓ |
| No, cooking mode = base recipe only | Cooking mode always shows the base recipe | |

**User's choice:** Yes, annotations carry into cooking mode

---

## Contribution Workflow

### Q1: How should contributors submit annotations?

| Option | Description | Selected |
|--------|-------------|----------|
| Edit recipe YAML directly | Contributor edits YAML, adds annotation objects via PR | |
| Issue template → maintainer adds | Dedicated issue template, maintainer converts to YAML | |
| Both (PR + issue template) | Technical contributors use PR, non-technical use issue template | ✓ |

**User's choice:** Both (PR + issue template)

### Q2: CI validation of annotations

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, CI validates annotations | Extend validate-recipes.ts with annotation structure checks | ✓ |
| No, manual review only | Annotations reviewed manually by maintainer | |

**User's choice:** Yes, CI validates annotations

### Q3: Annotation types supported

| Option | Description | Selected |
|--------|-------------|----------|
| Substitutions | "Use Greek yogurt instead of sour cream" (replaces content) | |
| Tips | "Let dough rest 10 min for fluffier texture" (adds advice) | |
| Both types | Both substitutions and tips, typed for UI differentiation | ✓ |

**User's choice:** Both types

---

## Variant Forking

### Q1: When should annotations graduate to a variant?

| Option | Description | Selected |
|--------|-------------|----------|
| Manual / maintainer decision | Maintainer decides when enough popular annotations warrant a fork | |
| Threshold-based flagging | N+ annotations auto-flags for variant consideration | |
| Community-requested | Someone opens an issue proposing a variant | |

**User's choice:** Free text — "manual / maintainer/ or community-requested / threshold may be useful for determining when to consider"
**Notes:** Primary trigger is maintainer judgment or community request. Annotation count serves as a signal, not an automatic trigger.

### Q2: How should a variant relate to the original?

| Option | Description | Selected |
|--------|-------------|----------|
| Full copy (independent file) | New YAML file with annotations baked in, independent from original | ✓ |
| Diff/overlay referencing parent | Variant stores only diffs/overrides, linked to parent | |
| You decide | Agent picks the simpler approach | |

**User's choice:** Full copy (independent file)

### Q3: Variant discoverability

| Option | Description | Selected |
|--------|-------------|----------|
| Links on original recipe page | Variants shown as links on the original (e.g., "See also:") | |
| No special UI | Variants are just regular recipes in listings | |
| Both (listed + cross-linked) | Listed normally in index AND cross-linked from original | ✓ |

**User's choice:** Both (listed + cross-linked)

### Q4: Parent↔variant relationship in data

| Option | Description | Selected |
|--------|-------------|----------|
| variant_of field in YAML | Variant YAML has `variant_of` field pointing to parent slug, parent computes cross-links | ✓ |
| Naming convention | System parses filename patterns to find relationships | |
| You decide | Agent decides linking mechanism | |

**User's choice:** variant_of field in YAML

---

## Agent's Discretion

- Exact YAML structure for annotated ingredients/steps (field names, nesting format)
- Annotation toggle UI design and styling
- URL parameter encoding scheme
- Tips vs substitutions rendering differentiation
- Issue template wording
- Validation script enhancement details
- Cross-link display design on recipe pages
- Print view handling of annotations
- Variant naming conventions

## Deferred Ideas

None — discussion stayed within phase scope
