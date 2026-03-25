import { render } from '../render.tsx'
import { loadRecipe, getRecipeFilename, collectAnnotations } from '../../data/recipes.ts'
import { loadPack } from '../../data/packs.ts'
import type { Recipe, AnnotatedItem } from '../../data/recipe-schema.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function isAnnotated(item: unknown): item is AnnotatedItem {
  return typeof item === 'object' && item !== null && 'annotations' in item
}

function renderAnnotatedItem(item: AnnotatedItem, idCounter: { value: number }): string {
  let parts: string[] = []
  for (let ann of item.annotations) {
    let id = idCounter.value++
    if (ann.type === 'substitution') {
      parts.push(`<li class="text-lg leading-relaxed ann-item" data-ann-id="${id}">
        <div class="flex items-start gap-2">
          <button type="button" role="switch" aria-checked="false" aria-label="Substitution: ${escapeHtml(ann.text)}, by ${escapeHtml(ann.contributor)}" class="ann-toggle ann-toggle-switch" data-ann-id="${id}"></button>
          <div>
            <span class="ann-original-text">${escapeHtml(item.text)}</span>
            <div class="ann-substitution-text text-base pl-2 mt-1" style="background:var(--ann-substitution-bg);border-left:2px solid var(--ann-substitution-border)">
              ${escapeHtml(ann.text)}
              <span class="text-sm" style="color:var(--theme-text-secondary)"> — ${escapeHtml(ann.contributor)}</span>
            </div>
          </div>
        </div>
      </li>`)
    } else {
      parts.push(`<li class="text-lg leading-relaxed">
        ${escapeHtml(item.text)}
        <button type="button" aria-expanded="false" aria-controls="tip-${id}" class="ann-tip-trigger text-sm font-bold ml-2" style="color:var(--theme-text-secondary)">💡 Tip <span class="ann-chevron">▾</span></button>
        <div id="tip-${id}" class="ann-tip-body">
          <span class="text-base">${escapeHtml(ann.text)}</span>
          <span class="text-sm" style="color:var(--theme-text-secondary)"> — ${escapeHtml(ann.contributor)}</span>
        </div>
      </li>`)
    }
  }
  return parts.join('\n        ')
}

function renderIngredients(components: Recipe['components'], idCounter: { value: number }): string {
  return components.map(group => {
    let name = typeof group[0] === 'string' ? group[0] : group[0].text
    let items = group.slice(1)
    return `<div class="mb-6">
      <h3 class="text-xl font-bold mb-2">${escapeHtml(name)}</h3>
      <ul class="space-y-2">
        ${items.map(item => {
          if (isAnnotated(item)) return renderAnnotatedItem(item, idCounter)
          return `<li class="text-lg leading-relaxed">${escapeHtml(item as string)}</li>`
        }).join('\n        ')}
      </ul>
    </div>`
  }).join('\n  ')
}

function renderDirections(directions: Recipe['directions'], idCounter: { value: number }): string {
  let items: string[] = []
  for (let entry of directions) {
    if (typeof entry === 'string') {
      items.push(`<li class="text-lg leading-relaxed">
      <label class="cursor-pointer">
        <input type="checkbox" class="peer sr-only">
        <span class="peer-checked:line-through peer-checked:text-gray-400">${escapeHtml(entry)}</span>
      </label>
    </li>`)
    } else if (Array.isArray(entry)) {
      for (let i = 1; i < entry.length; i++) {
        let sub = entry[i]
        if (isAnnotated(sub)) {
          items.push(renderAnnotatedItem(sub, idCounter))
        } else {
          items.push(`<li class="text-lg leading-relaxed">
      <label class="cursor-pointer">
        <input type="checkbox" class="peer sr-only">
        <span class="peer-checked:line-through peer-checked:text-gray-400">${escapeHtml(sub as string)}</span>
      </label>
    </li>`)
        }
      }
    } else if (isAnnotated(entry)) {
      items.push(renderAnnotatedItem(entry, idCounter))
    }
  }
  return items.join('\n    ')
}

function getBadgeHtml(recipe: Recipe): string {
  if (!recipe.pack) return ''
  try {
    let pack = loadPack(recipe.pack)
    return `<span class="inline-flex items-center gap-1 px-2 py-1 text-sm font-bold rounded-full mt-1 print:hidden" style="background:var(--theme-badge-bg);color:var(--theme-badge-text)"><span aria-hidden="true">${pack.icon}</span> ${escapeHtml(pack.name)}</span>`
  } catch {
    return ''
  }
}

function renderRecipe(recipe: Recipe, slug: string): string {
  let flavorHtml = recipe.flavor
    ? `<p class="text-lg leading-relaxed text-gray-600 italic mb-4">${escapeHtml(recipe.flavor)}</p>`
    : ''
  let backgroundHtml = recipe.background
    ? `<p class="text-lg leading-relaxed text-gray-600 italic recipe-background-text mb-8">${escapeHtml(recipe.background)}</p>`
    : ''

  let linksHtml = recipe.links.length > 0
    ? `<footer class="text-sm text-gray-600">
    ${recipe.links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color:var(--theme-accent)">${escapeHtml(link.text)}</a>`).join(', ')}
  </footer>`
    : ''

  let annotations = collectAnnotations(recipe)
  let hasAnnotations = annotations.length > 0
  let idCounter = { value: 1 }

  let selectionBarHtml = hasAnnotations
    ? `<div class="ann-selection-bar print:hidden" id="ann-selection-bar" hidden style="background:var(--theme-surface);border-top:1px solid var(--theme-border);padding:8px 16px;display:flex;align-items:center;gap:16px;justify-content:space-between">
    <span id="ann-count" class="text-sm font-bold">0 substitutions applied</span>
    <span>
      <a href="#" id="ann-share" class="text-sm" style="color:var(--theme-accent)">Share this version</a>
      <button type="button" id="ann-reset" class="text-sm ml-4" style="color:var(--theme-text-secondary)">Reset</button>
    </span>
  </div>`
    : ''

  return `<main class="max-w-2xl mx-auto px-4 py-8">
  <header class="flex items-start gap-4 mb-8">
    <img src="/recipes/${encodeURIComponent(getRecipeFilename(slug))}.jpg" alt="${escapeHtml(recipe.title)}" width="80" height="80"
         class="w-20 h-20 rounded object-cover flex-shrink-0 recipe-image">
    <div>
      <h1 class="text-3xl font-bold" style="color:var(--theme-accent)">${escapeHtml(recipe.title)}</h1>
      ${getBadgeHtml(recipe)}
    </div>
  </header>

  <a id="start-cooking-link" href="/recipes/${encodeURIComponent(slug)}/cook"
     class="block w-full py-3 text-center text-xl font-bold rounded-lg hover:opacity-90 focus:outline-2 focus:outline-offset-2 print:hidden mb-8" style="background:var(--theme-accent);color:var(--theme-accent-text)">
    Start Cooking
  </a>

  ${selectionBarHtml}

  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Ingredients</h2>
    ${renderIngredients(recipe.components, idCounter)}
  </section>

  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Directions</h2>
    <p class="text-sm text-gray-500 mb-3">Tap a step to cross it off.</p>
    <ol class="list-decimal list-inside space-y-3">
      ${renderDirections(recipe.directions, idCounter)}
    </ol>
  </section>

  <p class="text-sm text-gray-600 mb-8">${escapeHtml(recipe.byline)}, ${escapeHtml(recipe.location)}</p>

  ${flavorHtml}
  ${backgroundHtml}

  ${linksHtml}
  ${hasAnnotations ? '<script src="/annotations.js" defer></script>' : ''}
</main>`
}

export function recipeShow(request: Request): Response {
  let url = new URL(request.url)
  let slug = url.pathname.split('/').pop() || ''
  let filename = getRecipeFilename(slug)

  try {
    let recipe = loadRecipe(filename)
    return render(recipe.title, renderRecipe(recipe, slug), {
      description: recipe.flavor || undefined,
    })
  } catch {
    let html = `<main class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Recipe not found</h1>
    <p style="color:var(--theme-text-secondary)">We couldn't find that recipe. Browse <a href="/recipes" class="hover:underline" style="color:var(--theme-accent)">all recipes</a> to find something to cook.</p>
  </main>`
    return new Response(
      render('Recipe not found', html).body,
      {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    )
  }
}
