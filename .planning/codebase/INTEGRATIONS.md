# Integrations

## External Services

**None.** This is a fully static site with no external API calls, databases, or authentication providers.

## Data Sources

| Source | Type | Location |
|--------|------|----------|
| Recipe YAML files | Local filesystem | `src/recipes/*.yml` |
| Recipe images | Static assets | `public/recipes/*.jpg` |

Recipes are read at build time via Node.js `fs.readdirSync()` and parsed with the `yaml` package. No runtime data fetching occurs.

## Hosting

- **Domain:** freerecipe.club (referenced in README)
- **Hosting provider:** Not configured in repository (no deployment config files found)
- **Build output:** Static HTML/CSS/JS (Astro default)

## Third-Party Assets

| Asset | Source | Location |
|-------|--------|----------|
| Frying pan SVG | svgrepo.com | `public/frying_pan.svg` |
| Recipe images | Various (credited in YAML `links` field) | `public/recipes/` |
