# freerecipe.club

## What This Is

A community-driven recipe website that's the antithesis of ad-bloated recipe sites. No accounts, no tracking, no dark patterns — just recipes. Contributors submit via GitHub PRs (or email/letters converted to issues), recipes get community annotations (inline substitutions and tips), and a full cooking mode guides you step by step. Seasonal themed packs transform the site's look alongside curated recipe collections. Open source, Hacktoberfest-ready, built transparently in a public repo.

## Core Value

Someone finds a recipe and actually cooks from it.

## Requirements

### Validated

- ✓ Recipe data exists (YAML files with structured fields) — existing
- ✓ Recipe type system (TypeScript interfaces for Recipe and Link) — existing
- ✓ Static recipe images with matching names — existing
- ✓ Git-based contribution workflow (public repo) — existing

### Active

- [ ] Migrate from Astro to React Router v7 (framework mode — what Remix became)
- [ ] Free hosting tied to GitHub (supports SSR — Cloudflare Pages recommended)
- [ ] Recipe display — clean, no-nonsense, recipe-first layout
- [ ] Full cooking mode — step-by-step checkboxes, large text, screen-on
- [ ] Recipe organization — by ingredients (shopping view) and by steps (cooking view)
- [ ] Community annotations — inline substitutions, tips, and modifications on specific recipe parts
- [ ] Recipe versioning — substantial annotation sets can become standalone recipe versions
- [ ] Git-native contribution flow (PRs for recipes)
- [ ] Multi-device responsive design (kitchen-friendly)
- [ ] Themed recipe packs with matching site visual themes (seasonal editions)
- [ ] Hacktoberfest participation and contributor-friendly repo setup
- [ ] No ads, no tracking, no accounts, no dark patterns
- [ ] Enhance YAML recipe schema (structured ingredients, timing, Schema.org fields)
- [ ] Deployment pipeline (Cloudflare Pages + GitHub integration)

### Out of Scope

- User accounts / authentication — minimal tech footprint, no login required
- Ads or monetization — this is explicitly anti-ad
- Analytics / tracking — no cookies, no surveillance
- Server-side database — recipes live in the repo as flat files
- Social features beyond annotations — no likes, follows, feeds
- Native mobile app — responsive web is the target

## Context

- **Existing codebase:** Astro v1 static site with React/Tailwind. Two recipe YAML files, a stub RecipeCard component, and a landing page. All dependencies are significantly outdated (2022 era). The existing code is being replaced, not evolved.
- **Hosting migration:** Moving from Digital Ocean to free GitHub-tied hosting. Cloudflare Pages recommended — free tier with unlimited bandwidth, edge SSR, and an official React Router v7 template.
- **Framework correction:** Remix has fully merged into React Router v7 (stable since Nov 2024). Use `react-router` packages exclusively — `@remix-run/*` is legacy. Same concepts (loaders, actions, nested routes), new package names.
- **Contribution philosophy:** Git-first for developers. For non-technical contributors, email and physical letters are accepted and converted to GitHub issues by maintainers. Accessible to anyone.
- **Analog ethos:** Despite being a website, the feel should be minimal tech footprint — no dark patterns, no aggressive interactivity, no mandatory JavaScript for reading recipes.
- **Anti-pattern:** Every design decision is informed by what mainstream recipe sites do wrong — scroll-to-recipe syndrome, popup/ad hell, bad navigation, life stories before ingredients.
- **Annotation model:** Inspired by recipe site comment sections where the best content is substitution tips. Instead of flat comments, annotations pin to specific recipe lines (an ingredient, a step). Significant annotation sets can graduate to standalone recipe versions.
- **Hacktoberfest:** The repo should be welcoming for first-time contributors. Good issue labels, clear contribution guide, recipe submission template.

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
*Last updated: 2026-03-23 after initialization*
