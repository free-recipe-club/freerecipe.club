---
phase: 3
slug: cooking-mode
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | curl + grep (HTTP response verification) + file inspection |
| **Config file** | none — uses running dev server |
| **Quick run command** | `curl -s http://localhost:3000/recipes/pumpkin-doughnut/cook \| grep -c 'cook-mode'` |
| **Full suite command** | See Per-Task Verification Map commands |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick verify command for that task
- **After every plan wave:** Run all verification commands for that wave
- **Before `/gsd-verify-work`:** All commands must pass
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | DISP-09 | integration | `curl -s http://localhost:3000/recipes/pumpkin-doughnut/cook \| grep -q 'cook-mode'` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | DISP-10 | integration | `curl -s http://localhost:3000/recipes/pumpkin-doughnut/cook \| grep -q 'cook-ingredients'` | ✅ | ⬜ pending |
| 03-02-01 | 02 | 2 | DISP-09 | inspection | `test -f public/cook.js && grep -q 'wakeLock' public/cook.js` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 2 | DISP-09 | inspection | `grep -q 'cook-mode' app/styles/input.css && grep -q 'prefers-color-scheme' app/styles/input.css` | ✅ | ⬜ pending |
| 03-02-03 | 02 | 2 | DISP-09 | integration | `curl -s http://localhost:3000/recipes/pumpkin-doughnut \| grep -q 'Start Cooking'` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. The dev server + curl provides all needed verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Wake Lock keeps screen on | DISP-09 | Requires physical device testing | Open cooking mode on phone, wait 2+ minutes — screen should not dim |
| Dark mode applies | DISP-09 | Requires system preference toggle | Toggle system dark mode → cooking mode background changes to dark |
| Keyboard navigation | DISP-09 | Requires interactive browser testing | Press Left/Right arrow keys → step changes; Escape → exits to recipe |
| Step card viewport fill | DISP-09 | Visual verification | Each step fills viewport height; no scrolling between steps on phone |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
