# Phase 5: Community & Contributions - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 05-community-contributions
**Areas discussed:** PR template design, CI validation messaging, Contributor docs & README, Non-technical submission path

---

## PR Template Design

### How many PR/issue templates?

| Option | Description | Selected |
|--------|-------------|----------|
| Recipe-only template with scaffold | One template: recipe submission with YAML scaffold and checklist | |
| Recipe + general template | Two templates: recipe submissions + general changes | |
| Full set (recipe PR, general PR, issue templates) | Three templates covering recipes, general PRs, and issues | ✓ |

**User's choice:** Full set, plus AI skills/tooling contribution template
**Notes:** User specifically requested an AI skills template for post-v1 contributors who want to improve Copilot customizations, GSD skills, or development tooling.

### YAML scaffolding level in recipe PR template?

| Option | Description | Selected |
|--------|-------------|----------|
| Full YAML scaffold with inline comments | Pre-filled structure with placeholder values and inline comments | ✓ |
| Minimal scaffold + linked guide | Just field names, link to format reference | |
| Checklist + copy existing recipe | No YAML, point to existing file | |

**User's choice:** Full YAML scaffold with inline comments

### Include image instructions and checklist?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, full checklist in template | Image naming, file placement, submission checklist all in template | ✓ |
| Short checklist + link to guide | Brief checklist, details in CONTRIBUTING.md | |
| Agent's discretion | Agent decides | |

**User's choice:** Yes, full checklist in template

---

## CI Validation Messaging

### Validation feedback friendliness?

| Option | Description | Selected |
|--------|-------------|----------|
| Zod errors as-is (field-level) | Pass/fail with Zod error messages showing which field failed | ✓ |
| Friendly translated errors with hints | Plain English translations with hints | |
| Agent's discretion | Agent decides based on effort | |

**User's choice:** Zod errors as-is (field-level)

### CI checks beyond schema correctness?

| Option | Description | Selected |
|--------|-------------|----------|
| Schema validation only | Just Zod schema check | |
| Schema + basic content quality | Schema + non-empty directions, component groups, field lengths | |
| Schema + content + image presence | All above + verify matching image file exists | ✓ |

**User's choice:** Schema + content quality + image presence verification

---

## Contributor Docs & README

### CONTRIBUTING.md beginner-friendliness?

| Option | Description | Selected |
|--------|-------------|----------|
| Beginner-friendly (full walkthrough) | Assume no GitHub experience, full fork/clone/PR walkthrough | ✓ |
| Intermediate (format-focused) | Assume basic GitHub familiarity, focus on recipe format | |
| Developer-terse (format spec only) | Minimal format spec, devs figure out the rest | |

**User's choice:** Beginner-friendly (full walkthrough)

### README change scope?

| Option | Description | Selected |
|--------|-------------|----------|
| Full rewrite | Update framework, structure, how to run, contribute, Hacktoberfest section | ✓ |
| Quick fix + link | Fix Astro refs, point to CONTRIBUTING.md | |
| Agent's discretion | Agent decides | |

**User's choice:** Full rewrite

### CODE_OF_CONDUCT selection?

| Option | Description | Selected |
|--------|-------------|----------|
| Contributor Covenant | Industry standard, widely recognized | ✓ |
| Custom (project-specific) | Tailored to project vibe | |
| Agent's discretion | Agent decides | |

**User's choice:** Contributor Covenant

### Hacktoberfest readiness level?

| Option | Description | Selected |
|--------|-------------|----------|
| Full Hacktoberfest setup with starter issues | Repo topic, labels, pre-created starter issues | ✓ |
| Labels only | Just topic and labels, no starter issues | |
| Agent's discretion | Agent decides | |

**User's choice:** Full Hacktoberfest setup with starter issues

---

## Non-Technical Submission Path

### Where should instructions live?

| Option | Description | Selected |
|--------|-------------|----------|
| Section in CONTRIBUTING.md | Email/mail instructions in the contributor guide | ✓ (partial) |
| Dedicated website page (/submit) | Separate page on the site | |
| Both (repo + website) | Section in repo + page on site | |

**User's choice:** Section in CONTRIBUTING.md + small blurb with placeholder email on home page (not a full page)

### Email address approach?

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholder domain email | e.g., recipes@freerecipe.club, set up later | |
| Real email address | Actual monitored address | |
| TBD placeholder | "Email us" with TBD, fill in later | ✓ |

**User's choice:** TBD placeholder

### Include physical mail?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, include physical mail option | Placeholder mailing address, analog ethos | ✓ |
| Email only | Not practical yet | |
| Agent's discretion | Agent decides | |

**User's choice:** Yes, include physical mail option (placeholder address)

---

## Agent's Discretion

- Exact wording and layout of all PR/issue templates
- CONTRIBUTING.md structure and section ordering
- README layout and badges/shields
- Hacktoberfest starter issue titles and descriptions
- Validation script enhancement structure
- Home page blurb placement and styling
- Whether CONTRIBUTING.md includes inline recipe example or links to existing files

## Deferred Ideas

None — discussion stayed within phase scope
