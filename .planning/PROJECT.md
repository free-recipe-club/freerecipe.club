# freerecipe.club

## What This Is

A community-driven recipe website that's the antithesis of ad-bloated recipe sites. No accounts, no tracking, no dark patterns — just recipes. Contributors submit via GitHub PRs (or email/letters converted to issues), recipes get community annotations (inline substitutions and tips), and a full cooking mode guides you step by step. Seasonal themed packs transform the site's look alongside curated recipe collections. Open source, Hacktoberfest-ready, built transparently in a public repo.

## Core Value

Someone finds a recipe and actually cooks from it.

## Current State

**Shipped:** v1.0 MVP (2026-03-24)
**Next Milestone:** TBD — run `/gsd-new-milestone` to define

v1.0 delivered all 6 phases (16 plans): foundation & data layer, recipe display & SEO, cooking mode, themed packs, community contributions, and annotations & versioning. The site is a fully functional community-driven recipe platform built on alpha Remix with Tailwind v4, Zod-validated YAML recipes, immersive cooking mode, themed pack system, and inline annotations with variant forking.

## Requirements

### Validated

- ✓ Recipe data exists (YAML files with structured fields) — existing
- ✓ Recipe type system (TypeScript interfaces for Recipe and Link) — existing
- ✓ Static recipe images with matching names — existing
- ✓ Git-based contribution workflow (public repo) — existing
- ✓ Alpha Remix 3 scaffold with Tailwind v4 — Validated in Phase 01
- ✓ Zod-validated YAML recipe loading — Validated in Phase 01
- ✓ GitHub Actions CI/CD pipeline — Validated in Phase 01
- ✓ Hosting deployment — Validated in Phase 01 (Fly.io → static build)
- ✓ No ads, no tracking, no accounts, no dark patterns — Validated in Phase 01
- ✓ Recipe display — clean, no-nonsense, recipe-first layout — Validated in Phase 02
- ✓ Multi-device responsive design (kitchen-friendly) — Validated in Phase 02
- ✓ Full cooking mode — step-by-step, large text, screen-on, ingredient highlighting — Validated in Phase 03
- ✓ CSS theme system with Autumn Harvest pack — Validated in Phase 04
- ✓ PR/issue templates, CI validation, contributor docs — Validated in Phase 05
- ✓ Community annotations (substitutions, tips) + variant forking — Validated in Phase 06

### Active

_(No active requirements — next milestone will define new requirements via `/gsd-new-milestone`)_

### Out of Scope

- User accounts / authentication — minimal tech footprint, no login required
- Ads or monetization — this is explicitly anti-ad
- Analytics / tracking — no cookies, no surveillance
- Server-side database — recipes live in the repo as flat files
- Social features beyond annotations — no likes, follows, feeds
- Native mobile app — responsive web is the target

## Context

- **Shipped v1.0 MVP:** Alpha Remix 3 app with Tailwind v4, Zod-validated YAML recipes, recipe display, cooking mode, themed packs, community contributions infrastructure, and annotations with variant forking. 6 phases, 16 plans, 30/30 requirements complete.
- **Hosting:** Started on Fly.io, migrated to static build for DigitalOcean during development.
- **Framework:** Alpha Remix (`remix-run/remix`) — NOT React Router v7, per user override.
- **Contribution philosophy:** Git-first for developers. For non-technical contributors, email and physical letters are accepted and converted to GitHub issues by maintainers.
- **Analog ethos:** Minimal tech footprint — no dark patterns, no aggressive interactivity, no mandatory JavaScript for reading recipes.
- **Anti-pattern:** Every design decision is informed by what mainstream recipe sites do wrong.
- **Annotation model:** Substitutions and tips pinned to specific ingredients or steps. Significant annotation sets can graduate to standalone recipe variants (forks).

## Constraints

- **Framework**: React Router v7 (framework mode) — stable since Nov 2024, successor to Remix
- **Hosting**: Must be free and tied to GitHub repo — no paid hosting services
- **Privacy**: Zero tracking, zero cookies beyond technical necessity, no third-party scripts
- **Data**: Recipes stored as flat files in the repo — no database
- **Accessibility**: Must work on phones in a kitchen (wet hands, small screen, distractions)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Migrate from Astro to React Router v7 | Astro v1 outdated, RR7 offers SSR + modern React + is what Remix became | — Pending |
| Cloudflare Pages for hosting | Free tier, unlimited bandwidth, edge SSR, official RR7 template | — Pending |
| No user accounts | Minimal tech footprint; reduces complexity and privacy concerns | — Pending |
| Git-first contributions | Public repo, developer audience, Hacktoberfest alignment | — Pending |
| Inline annotations over flat comments | Better signal-to-noise than comment sections; pins context to specific recipe parts | — Pending |
| Recipe data format TBD | Will evaluate YAML, MDX, JSON during research — pick what's most idiomatic for Remix | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-24 after v1.0 milestone completion*
