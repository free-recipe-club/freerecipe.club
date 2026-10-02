---
phase: 2
slug: recipe-display-seo
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | curl + grep (HTTP response verification) |
| **Config file** | none — uses running dev server |
| **Quick run command** | `curl -s http://localhost:3000/recipes/pumpkin-doughnut \| grep -c '<h1'` |
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
| 02-01-01 | 01 | 1 | DISP-01, DISP-02, DISP-03, DISP-04, DISP-05 | integration | `curl -s http://localhost:3000/recipes/pumpkin-doughnut \| grep -q '<h1'` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | SEO-01, DISP-08 | integration | `curl -s http://localhost:3000/recipes/pumpkin-doughnut \| grep -q 'meta name="description"'` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | DISP-01 | integration | `curl -s http://localhost:3000/recipes \| grep -q 'pumpkin-doughnut'` | ✅ | ⬜ pending |
| 02-02-02 | 02 | 1 | SEO-02 | integration | `curl -s http://localhost:3000/sitemap.xml \| grep -q 'pumpkin-doughnut'` | ✅ | ⬜ pending |
| 02-03-01 | 03 | 2 | DISP-06, DISP-07, CORE-03 | inspection | `grep -q '@media print' app/styles/input.css` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. The dev server + curl provides all needed verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Print output is chrome-free | DISP-06 | Browser print preview not automatable | Open recipe page → Ctrl+P → verify no nav, no image, clean text |
| Mobile responsive at 320px | DISP-07, CORE-03 | Viewport testing needs browser | Open recipe in mobile viewport → verify no horizontal scroll, readable text |
| Checkbox strikethrough visual | DISP-04 | CSS visual state not testable via curl | Check a step checkbox → verify strikethrough + muted text |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
