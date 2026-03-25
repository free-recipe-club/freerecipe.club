import { render } from '../render.tsx'
import { loadPack, loadRecipesByPack } from '../../data/packs.ts'
import { loadRecipes, listRecipeSlugs } from '../../data/recipes.ts'
import type { Pack } from '../../data/pack-schema.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function packShow(request: Request): Response {
  let url = new URL(request.url)
  let slug = url.pathname.split('/').pop() || ''

  let pack: Pack
  try {
    pack = loadPack(slug)
  } catch {
    let html = `<main class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Pack not found</h1>
    <p style="color:var(--theme-text-secondary)">This collection doesn't exist. Browse <a href="/packs" class="hover:underline" style="color:var(--theme-accent)">all packs</a> or head <a href="/" class="hover:underline" style="color:var(--theme-accent)">home</a>.</p>
  </main>`
    return new Response(
      render('Pack not found', html).body,
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  let allRecipes = loadRecipes()
  let allSlugs = listRecipeSlugs()
  let packRecipes = allRecipes
    .map((recipe, i) => ({ recipe, slug: allSlugs[i] }))
    .filter(({ recipe }) => recipe.pack === slug)

  let recipesHtml: string
  if (packRecipes.length === 0) {
    recipesHtml = `<div class="text-center py-16">
    <h2 class="text-xl font-bold mb-2">Recipes coming soon</h2>
    <p style="color:var(--theme-text-secondary)">This collection is being curated. Recipes will appear here shortly.</p>
  </div>`
  } else {
    let cards = packRecipes.map(({ recipe, slug: recipeSlug }) => {
      let verb = recipe.make_verb || 'Make'
      let verbIng = verb.endsWith('e') ? verb.slice(0, -1) + 'ing' : verb + 'ing'
      return `<a href="/recipes/${encodeURIComponent(recipeSlug)}" class="block rounded-lg p-4 transition-colors" style="background:var(--theme-surface);border:1px solid var(--theme-border)" onmouseover="this.style.background='var(--theme-surface-hover)'" onmouseout="this.style.background='var(--theme-surface)'">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-1" style="font-family:var(--theme-heading-font)">${escapeHtml(recipe.title)}</h2>
          <p class="text-sm font-bold" style="color:var(--theme-text-secondary)">${escapeHtml(recipe.byline)}, ${escapeHtml(recipe.location)}</p>
          <p class="text-base font-bold mt-2" style="color:var(--theme-accent)">Start ${escapeHtml(verbIng)} →</p>
        </div>
        <span class="flex items-center justify-center w-6 h-6 rounded-full text-sm flex-shrink-0" style="background:var(--theme-badge-bg);color:var(--theme-badge-text)" aria-hidden="true">${pack.icon}</span>
      </div>
    </a>`
    }).join('\n    ')

    recipesHtml = `<div class="flex flex-col gap-4">
    ${cards}
  </div>`
  }

  let content = `<main class="max-w-2xl mx-auto px-4 py-8">
  <div class="text-center mb-8">
    <div class="text-5xl mb-4">${pack.icon}</div>
    <h1 class="text-4xl font-bold mb-4" style="font-family:var(--theme-heading-font);color:var(--theme-text)">${escapeHtml(pack.name)}</h1>
    <p class="leading-relaxed max-w-lg mx-auto" style="color:var(--theme-text-secondary)">${escapeHtml(pack.description)}</p>
  </div>
  <hr class="my-8" style="border-color:var(--theme-divider)">
  ${recipesHtml}
</main>`

  return render(pack.name, content, { themeClass: pack.theme_class })
}
