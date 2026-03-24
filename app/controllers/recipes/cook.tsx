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

function extractQuantity(ingredient: string): string {
  let name = extractIngredientName(ingredient)
  let idx = ingredient.toLowerCase().indexOf(name.toLowerCase())
  if (idx <= 0) return ''
  return ingredient.substring(0, idx).trim()
}

function findMatch(stepLower: string, name: string): { start: number; length: number } | null {
  let idx = stepLower.indexOf(name)
  if (idx >= 0) return { start: idx, length: name.length }

  if (name.endsWith('s')) {
    let singular = name.slice(0, -1)
    idx = stepLower.indexOf(singular)
    if (idx >= 0) return { start: idx, length: singular.length }
  } else {
    idx = stepLower.indexOf(name + 's')
    if (idx >= 0) return { start: idx, length: name.length + 1 }
  }

  let words = name.split(/\s+/).filter(w => w.length >= 4 && !COMMON_ADJECTIVES.has(w))
  for (let word of words) {
    let re = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i')
    let match = re.exec(stepLower)
    if (match) return { start: match.index, length: match[0].length }
  }

  return null
}

type IngredientMatch = {
  name: string
  quantity: string
  group: string
  start: number
  end: number
}

function annotateStep(
  step: string,
  components: string[][]
): { html: string; groups: string[] } {
  let stepLower = step.toLowerCase()
  let allMatches: IngredientMatch[] = []
  let groupMatchCounts = new Map<string, number>()

  for (let group of components) {
    let groupName = group[0]
    let ingredients = group.slice(1)

    for (let ingredient of ingredients) {
      let name = extractIngredientName(ingredient).toLowerCase()
      let quantity = extractQuantity(ingredient)
      let found = findMatch(stepLower, name)

      if (found) {
        allMatches.push({
          name,
          quantity,
          group: groupName,
          start: found.start,
          end: found.start + found.length,
        })
        groupMatchCounts.set(groupName, (groupMatchCounts.get(groupName) || 0) + 1)
      }
    }
  }

  if (allMatches.length === 0) return { html: escapeHtml(step), groups: [] }

  // Dedup: for names matched from multiple groups, keep the group with most hits
  let byName = new Map<string, IngredientMatch[]>()
  for (let m of allMatches) {
    let list = byName.get(m.name) || []
    list.push(m)
    byName.set(m.name, list)
  }

  let deduped: IngredientMatch[] = []
  for (let [, matches] of byName) {
    if (matches.length === 1) {
      deduped.push(matches[0])
    } else {
      matches.sort((a, b) => (groupMatchCounts.get(b.group) || 0) - (groupMatchCounts.get(a.group) || 0))
      deduped.push(matches[0])
    }
  }

  deduped.sort((a, b) => a.start - b.start)

  // Remove overlapping
  let filtered: IngredientMatch[] = []
  let lastEnd = -1
  for (let m of deduped) {
    if (m.start >= lastEnd) {
      filtered.push(m)
      lastEnd = m.end
    }
  }

  // Build HTML with inline quantity annotations
  let html = ''
  let cursor = 0
  for (let m of filtered) {
    html += escapeHtml(step.slice(cursor, m.start))
    if (m.quantity) {
      html += '<span class="cook-ingredient"><b class="cook-qty">' + escapeHtml(m.quantity) + '</b> ' + escapeHtml(step.slice(m.start, m.end)) + '</span>'
    } else {
      html += escapeHtml(step.slice(m.start, m.end))
    }
    cursor = m.end
  }
  html += escapeHtml(step.slice(cursor))

  let groups = [...new Set(filtered.map(m => m.group))]
  return { html, groups }
}

function renderCookingMode(recipe: Recipe, slug: string): Response {
  let total = recipe.directions.length

  // First pass: annotate all steps and collect matched groups
  let annotations = recipe.directions.map(step => annotateStep(step, recipe.components))

  // Second pass: carry forward last known section for unmatched steps
  let lastGroups: string[] = []
  let stepGroups = annotations.map(a => {
    if (a.groups.length > 0) {
      lastGroups = a.groups
      return a.groups
    }
    return lastGroups
  })

  let stepsHtml = recipe.directions.map((step, i) => {
    let stepHtml = annotations[i].html
    let groups = stepGroups[i]
    let labelHtml = groups.length > 0
      ? `\n      <div class="cook-section-label">${groups.map(g => escapeHtml(g)).join(', ')}</div>`
      : ''

    return `    <div class="cook-step" data-step="${i + 1}">${labelHtml}
      <div class="cook-step-text" tabindex="-1">${stepHtml}</div>
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
