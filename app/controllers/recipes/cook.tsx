import { loadRecipe, getRecipeFilename } from '../../data/recipes.ts'
import type { Recipe } from '../../data/recipe-schema.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function extractIngredientName(ingredient: string): string {
  let stripped = ingredient.replace(
    /^[\d\s./]+(?:c|tsp|tbsp|oz|lb|lg|sm|med|cups?|cans?|pkg|pt|qt|gal|ml|g|kg|inch|cloves?|bunch|head|sticks?|pinch|dash|slices?)\b\s*/i,
    ''
  )
  if (stripped !== ingredient) return stripped.trim()
  return ingredient.replace(/^[\d\s./]+/, '').trim()
}

const COMMON_ADJECTIVES = new Set([
  'fresh', 'large', 'ground', 'unsalted', 'melted', 'small', 'medium',
  'chopped', 'diced', 'minced', 'sliced', 'dried', 'whole', 'warm',
  'cold', 'hot', 'room', 'softened', 'packed', 'sifted',
])

function matchIngredientsToStep(
  step: string,
  components: string[][]
): string[] {
  let stepLower = step.toLowerCase()
  // Track matches per group to pick the best group for duplicates
  let groupMatches = new Map<string, { ingredient: string; name: string }[]>()

  for (let group of components) {
    let groupName = group[0]
    let ingredients = group.slice(1)

    for (let ingredient of ingredients) {
      let name = extractIngredientName(ingredient).toLowerCase()
      let matched = false

      // Pass 1: exact substring match
      if (stepLower.includes(name)) {
        matched = true
      }

      // Also try without trailing 's' or with added 's'
      if (!matched) {
        let nameSingular = name.endsWith('s') ? name.slice(0, -1) : null
        let namePlural = name + 's'
        if ((nameSingular && stepLower.includes(nameSingular)) || stepLower.includes(namePlural)) {
          matched = true
        }
      }

      // Pass 2: significant word matching
      if (!matched) {
        let words = name.split(/\s+/).filter(
          w => w.length >= 4 && !COMMON_ADJECTIVES.has(w)
        )
        matched = words.some(word => {
          let re = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i')
          return re.test(step)
        })
      }

      if (matched) {
        let list = groupMatches.get(groupName)
        if (!list) {
          list = []
          groupMatches.set(groupName, list)
        }
        list.push({ ingredient, name })
      }
    }
  }

  if (groupMatches.size === 0) return []

  // For ingredients whose name appears in multiple groups,
  // keep only the version from the group with the most total matches
  let seen = new Map<string, { ingredient: string; groupSize: number }>()
  for (let [, items] of groupMatches) {
    for (let item of items) {
      let existing = seen.get(item.name)
      if (!existing || items.length > existing.groupSize) {
        seen.set(item.name, { ingredient: item.ingredient, groupSize: items.length })
      }
    }
  }

  return Array.from(seen.values()).map(v => v.ingredient)
}

function renderCookingMode(recipe: Recipe, slug: string): Response {
  let total = recipe.directions.length

  let stepsHtml = recipe.directions.map((step, i) => {
    let matched = matchIngredientsToStep(step, recipe.components)
    let ingredientHtml = ''

    if (matched.length > 0) {
      let itemsHtml = matched.map(item => `<li>${escapeHtml(item)}</li>`).join('\n          ')
      ingredientHtml = `\n      <div class="cook-ingredients">\n        <ul class="cook-ingredient-list">\n          ${itemsHtml}\n        </ul>\n      </div>`
    }

    return `    <div class="cook-step" data-step="${i + 1}">${ingredientHtml}
      <div class="cook-step-text" tabindex="-1">${escapeHtml(step)}</div>
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
