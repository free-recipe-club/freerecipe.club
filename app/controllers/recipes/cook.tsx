import { loadRecipe, getRecipeFilename } from '../../data/recipes.ts'
import type { Recipe } from '../../data/recipe-schema.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

type CookStep = { text: string; section: string | null }

function flattenDirections(directions: (string | string[])[]): CookStep[] {
  let steps: CookStep[] = []
  for (let entry of directions) {
    if (typeof entry === 'string') {
      steps.push({ text: entry, section: null })
    } else {
      let section = entry[0]
      for (let i = 1; i < entry.length; i++) {
        steps.push({ text: entry[i], section })
      }
    }
  }
  return steps
}

function renderCookingMode(recipe: Recipe, slug: string): Response {
  let steps = flattenDirections(recipe.directions)
  let total = steps.length

  let stepsHtml = steps.map((step, i) => {
    let labelHtml = step.section
      ? `\n      <div class="cook-section-label">${escapeHtml(step.section)}</div>`
      : ''

    return `    <div class="cook-step" data-step="${i + 1}">${labelHtml}
      <div class="cook-step-text" tabindex="-1">${escapeHtml(step.text)}</div>
    </div>`
  }).join('\n')

  let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(recipe.title)} — Cooking — freerecipe.club</title>
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="cook-mode" style="background:var(--cook-bg);color:var(--cook-text);margin:0;min-height:100vh;min-height:100dvh">
  <div class="cook-top-bar">
    <a href="/recipes/${encodeURIComponent(slug)}" aria-label="Exit cooking mode" class="cook-exit">✕</a>
    <span class="cook-step-counter" id="cook-step-counter">Step 1 of ${total}</span>
  </div>
  <div role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="${total}" aria-label="Cooking progress" class="cook-progress">
    <div class="cook-progress-fill" id="cook-progress-fill" style="width:${(1 / total * 100).toFixed(1)}%"></div>
  </div>
  <div id="cook-steps" aria-live="polite">
${stepsHtml}
  </div>
  <div class="cook-nav" id="cook-nav">
    <button type="button" id="cook-prev" class="cook-btn" style="visibility:hidden">Previous</button>
    <button type="button" id="cook-next" class="cook-btn">${total === 1 ? 'Finish Cooking' : 'Next'}</button>
  </div>
  <script src="/cook.js" defer></script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export function recipeCook(request: Request): Response {
  let url = new URL(request.url)
  let segments = url.pathname.split('/')
  // /recipes/:slug/cook → segments = ['', 'recipes', ':slug', 'cook']
  let slug = segments[2] || ''
  let filename = getRecipeFilename(slug)

  try {
    let recipe = loadRecipe(filename)
    return renderCookingMode(recipe, slug)
  } catch {
    let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recipe not found — freerecipe.club</title>
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="bg-brand-cream text-gray-900 font-sans min-h-screen">
  <nav class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-brand-green hover:underline">freerecipe.club</a>
    <a href="/recipes" class="text-lg text-brand-green hover:underline">Recipes</a>
  </nav>
  <main class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Recipe not found</h1>
    <p class="text-gray-600">We couldn't find that recipe. Browse <a href="/recipes" class="text-brand-green hover:underline">all recipes</a> to find something to cook.</p>
  </main>
</body>
</html>`
    return new Response(html, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
