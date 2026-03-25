import { loadRecipe, getRecipeFilename, collectAnnotations } from '../../data/recipes.ts'
import { getActiveThemeClass } from '../../data/packs.ts'
import type { Recipe, Annotation } from '../../data/recipe-schema.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

type CookStep = { text: string; section: string | null; annotations?: { id: number; annotation: Annotation }[] }

function dirItemText(item: string | { text: string }): string {
  return typeof item === 'string' ? item : item.text
}

function flattenDirections(directions: Recipe['directions'], idCounter: { value: number }): CookStep[] {
  let steps: CookStep[] = []
  for (let entry of directions) {
    if (typeof entry === 'string') {
      steps.push({ text: entry, section: null })
    } else if (Array.isArray(entry)) {
      let section = dirItemText(entry[0])
      for (let i = 1; i < entry.length; i++) {
        let item = entry[i]
        if (typeof item === 'string') {
          steps.push({ text: item, section })
        } else {
          let anns = item.annotations.map(a => ({ id: idCounter.value++, annotation: a }))
          steps.push({ text: item.text, section, annotations: anns })
        }
      }
    } else {
      let anns = entry.annotations.map(a => ({ id: idCounter.value++, annotation: a }))
      steps.push({ text: entry.text, section: null, annotations: anns })
    }
  }
  return steps
}

function resolveStepText(step: CookStep, activeAnnIds: Set<number>): string {
  if (!step.annotations) return step.text
  for (let { id, annotation } of step.annotations) {
    if (annotation.type === 'substitution' && activeAnnIds.has(id)) {
      return annotation.text
    }
  }
  return step.text
}

function renderCookingMode(recipe: Recipe, slug: string, activeAnnIds: Set<number>): Response {
  // Count annotation IDs from components first (to match collectAnnotations ordering)
  let idCounter = { value: 1 }
  for (let group of recipe.components) {
    for (let i = 1; i < group.length; i++) {
      let item = group[i]
      if (typeof item !== 'string' && 'annotations' in item) {
        idCounter.value += item.annotations.length
      }
    }
  }
  let steps = flattenDirections(recipe.directions, idCounter)
  let total = steps.length
  let themeClass = getActiveThemeClass()

  let stepsHtml = steps.map((step, i) => {
    let labelHtml = step.section
      ? `\n      <div class="cook-section-label">${escapeHtml(step.section)}</div>`
      : ''
    let displayText = resolveStepText(step, activeAnnIds)

    return `    <div class="cook-step" data-step="${i + 1}">${labelHtml}
      <div class="cook-step-text" tabindex="-1">${escapeHtml(displayText)}</div>
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
<body class="${themeClass} cook-mode" style="background:var(--cook-bg);color:var(--cook-text);margin:0;min-height:100vh;min-height:100dvh">
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
    let annParam = url.searchParams.get('ann') || ''
    let activeAnnIds = new Set(annParam.split(',').filter(Boolean).map(Number))
    return renderCookingMode(recipe, slug, activeAnnIds)
  } catch {
    let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recipe not found — freerecipe.club</title>
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="${getActiveThemeClass()} min-h-screen">
  <nav class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between" style="background:var(--theme-nav-bg)">
    <a href="/" class="text-xl font-bold hover:underline" style="color:var(--theme-accent)">freerecipe.club</a>
    <a href="/recipes" class="text-lg hover:underline" style="color:var(--theme-accent)">Recipes</a>
  </nav>
  <main class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Recipe not found</h1>
    <p style="color:var(--theme-text-secondary)">We couldn't find that recipe. Browse <a href="/recipes" class="hover:underline" style="color:var(--theme-accent)">all recipes</a> to find something to cook.</p>
  </main>
</body>
</html>`
    return new Response(html, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
