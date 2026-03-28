# freerecipe.club

Your always-ad-free source for recipes from the heart.

No tracking. No accounts. No dark patterns. Just recipes.

## What Is This?

A community-driven recipe website built as the antithesis of ad-bloated recipe sites. Contributors submit recipes via GitHub PRs or issues. Themed packs transform the site's look alongside curated recipe collections. Open source and built transparently in a public repo.

## Features

- Clean, recipe-first display — no preamble, no life stories before ingredients
- Cooking mode — step-by-step with wake lock for kitchen use
- Themed recipe packs — curated collections with matching visual themes
- Print-friendly — clean printout without browser chrome
- Zero tracking, zero cookies, zero third-party scripts

## Contributing

We'd love your recipes! See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

**Quick paths:**
- **Submit a recipe** — [Create a PR](CONTRIBUTING.md#via-pull-request-recommended) or [open an issue](CONTRIBUTING.md#via-github-issue)
- **Hacktoberfest** — Look for issues labeled `good first issue` and `hacktoberfest`

## Running Locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Tech Stack

- [Remix 3](https://github.com/remix-run/remix) (alpha) — Server framework
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Zod](https://zod.dev/) — Recipe data validation
- Static site build for deployment

## Project Structure

```
data/recipes/       Recipe YAML files
data/packs/         Themed pack metadata
public/recipes/     Recipe images
app/                Controllers, routes, data loading
scripts/            Validation scripts
.github/            Templates and CI
```

## License

[MIT](LICENSE)

## Code of Conduct

[Contributor Covenant v2.1](CODE_OF_CONDUCT.md)