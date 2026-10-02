---
phase: 4
slug: themed-packs
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | CLI scripts + curl (no test framework installed) |
| **Config file** | `scripts/validate-recipes.ts` (extends to pack validation) |
| **Quick run command** | `npx tsx scripts/validate-recipes.ts` |
| **Full suite command** | `npx tsx scripts/validate-recipes.ts && curl -sf http://localhost:3000/packs > /dev/null && curl -sf http://localhost:3000/packs/autumn-harvest > /dev/null` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsx scripts/validate-recipes.ts`
- **After every plan wave:** Run full suite command
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | PACK-01, PACK-02 | integration | `grep "theme-autumn-harvest" app/styles/input.css && test -f data/packs/autumn-harvest.yml` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | PACK-02 | integration | `grep "var(--theme-" app/controllers/render.tsx` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | PACK-01, PACK-03 | integration | `curl -sf http://localhost:3000/packs \| grep -i "autumn"` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | PACK-03 | integration | `curl -sf http://localhost:3000/packs/autumn-harvest \| grep -i "pumpkin"` | ❌ W0 | ⬜ pending |
| 04-03-01 | 03 | 3 | PACK-02 | integration | `test -f public/theme.js && grep "frc-theme" public/theme.js` | ❌ W0 | ⬜ pending |
| 04-03-02 | 03 | 3 | PACK-02 | manual | Visual theme verification | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `data/packs/autumn-harvest.yml` — first pack YAML data file
- [ ] `data/packs/_active.yml` — active pack configuration
- [ ] `app/data/pack-schema.ts` — Zod schema for pack validation

*Existing infrastructure (yaml, zod, validation script) covers the framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Theme visually transforms site colors and typography | PACK-02 | Visual assessment | Visit `/` and `/recipes` — verify autumn colors (#faf5eb bg, #c2410c accent) replace old green/cream |
| Theme picker persists across page loads | PACK-02 | localStorage interaction | Open theme picker, select theme, reload page — theme should persist |
| Pack page renders with own theme | PACK-03 | Visual comparison | Visit `/packs/autumn-harvest` — page should use autumn theme regardless of active theme |
| Cooking mode inherits theme colors | PACK-02 | Visual + dark mode toggle | Enter cooking mode from a recipe — colors should match active theme |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
