import { render } from '../render.tsx'
import { loadRecipe, getRecipeFilename, collectAnnotations, findVariants } from '../../data/recipes.ts'
import { loadPack } from '../../data/packs.ts'
import type { Recipe, AnnotatedItem } from '../../data/recipe-schema.ts'

function isAnnotated(item: unknown): item is AnnotatedItem {
  return typeof item === 'object' && item !== null && 'annotations' in item
}

function stripMarkers(text: string): string {
  return text.replace(/[{}]/g, '')
}

function renderAnnotatedItem(item: AnnotatedItem, idCounter: { value: number }) {
  let subs = item.annotations.filter(a => a.type === 'substitution')
  let tips = item.annotations.filter(a => a.type === 'tip')
  let tipLabel = tips.length === 1 ? '💡 Tip' : `💡 ${tips.length} Tips`

  return (
    <li class="text-lg leading-relaxed ann-item">
      <span class="ann-original-text">{stripMarkers(item.text)}</span>
      <span class="ann-swapped-text" hidden></span>
      {subs.map(ann => {
        let id = idCounter.value++
        return (
          <div
            class="ann-sub"
            data-ann-id={String(id)}
            data-swap-text={ann.text}
            style="margin-top:4px;padding:4px 8px;border-left:2px solid var(--ann-substitution-border);border-radius:4px;background:var(--ann-substitution-bg)"
          >
            <span class="text-sm">
              <strong>Swap:</strong> {ann.text}
              {ann.explanation ? (
                <> <span class="text-sm" style="color:var(--theme-text-secondary)">{ann.explanation}</span></>
              ) : null}
              {' '}<em style="color:var(--theme-text-secondary)">— {ann.contributor}</em>
            </span>
            <button
              type="button"
              class="ann-apply text-sm font-bold ml-2 print:hidden"
              data-ann-id={String(id)}
              style="color:var(--theme-accent);background:none;border:none;cursor:pointer;padding:0"
            >
              Use this
            </button>
          </div>
        )
      })}
      {tips.length > 0 ? (
        <details class="ann-tip-details" style="margin-top:4px">
          <summary class="text-sm font-bold" style="color:var(--theme-text-secondary);cursor:pointer">{tipLabel}</summary>
          {tips.map(ann => {
            idCounter.value++
            return (
              <div
                class="ann-tip-content"
                style="margin-top:4px;padding:4px 8px;border-left:2px solid var(--ann-tip-border);border-radius:4px;background:var(--ann-tip-bg)"
              >
                <span class="text-base">{ann.text}</span>
                <span class="text-sm" style="color:var(--theme-text-secondary)"> — {ann.contributor}</span>
              </div>
            )
          })}
        </details>
      ) : null}
    </li>
  )
}

function renderIngredients(components: Recipe['components'], idCounter: { value: number }) {
  return components.map(group => {
    let name = typeof group[0] === 'string' ? group[0] : group[0].text
    let items = group.slice(1)
    return (
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2">{name}</h3>
        <ul class="space-y-2">
          {items.map(item => {
            if (isAnnotated(item)) return renderAnnotatedItem(item, idCounter)
            return <li class="text-lg leading-relaxed">{item as string}</li>
          })}
        </ul>
      </div>
    )
  })
}

function renderDirections(directions: Recipe['directions'], idCounter: { value: number }) {
  let items: any[] = []
  for (let entry of directions) {
    if (typeof entry === 'string') {
      items.push(
        <li class="text-lg leading-relaxed">
          <label class="cursor-pointer">
            <input type="checkbox" class="peer sr-only" />
            <span class="peer-checked:line-through peer-checked:text-gray-400">{stripMarkers(entry)}</span>
          </label>
        </li>
      )
    } else if (Array.isArray(entry)) {
      for (let i = 1; i < entry.length; i++) {
        let sub = entry[i]
        if (isAnnotated(sub)) {
          items.push(renderAnnotatedItem(sub, idCounter))
        } else {
          items.push(
            <li class="text-lg leading-relaxed">
              <label class="cursor-pointer">
                <input type="checkbox" class="peer sr-only" />
                <span class="peer-checked:line-through peer-checked:text-gray-400">{stripMarkers(sub as string)}</span>
              </label>
            </li>
          )
        }
      }
    } else if (isAnnotated(entry)) {
      items.push(renderAnnotatedItem(entry, idCounter))
    }
  }
  return items
}

function getBadge(recipe: Recipe) {
  if (!recipe.pack) return null
  try {
    let pack = loadPack(recipe.pack)
    return (
      <span
        class="inline-flex items-center gap-1 px-2 py-1 text-sm font-bold rounded-full mt-1 print:hidden"
        style="background:var(--theme-badge-bg);color:var(--theme-badge-text)"
      >
        <span aria-hidden="true">{pack.icon}</span> {pack.name}
      </span>
    )
  } catch {
    return null
  }
}

function renderRecipe(recipe: Recipe, slug: string) {
  let annotations = collectAnnotations(recipe)
  let hasAnnotations = annotations.length > 0
  let idCounter = { value: 1 }
  let verb = recipe.make_verb || 'Make'
  let verbIng = verb.endsWith('e') ? verb.slice(0, -1) + 'ing' : verb + 'ing'

  let backLink = null as any
  if (recipe.variant_of) {
    try {
      let parent = loadRecipe(getRecipeFilename(recipe.variant_of))
      backLink = (
        <p class="text-sm mb-4" style="color:var(--theme-text-secondary)">
          Based on:{' '}
          <a href={`/recipes/${encodeURIComponent(recipe.variant_of)}`} class="hover:underline" style="color:var(--theme-accent)">
            {parent.title}
          </a>
        </p>
      )
    } catch {}
  }

  let variants = findVariants(slug)

  return (
    <main class="max-w-2xl mx-auto px-4 py-8">
      <header class="flex items-start gap-4 mb-8">
        <img
          src={`/recipes/${encodeURIComponent(getRecipeFilename(slug))}.jpg`}
          alt={recipe.title}
          width="80"
          height="80"
          class="w-20 h-20 rounded object-cover flex-shrink-0 recipe-image"
        />
        <div>
          <h1 class="text-3xl font-bold" style="color:var(--theme-accent)">{recipe.title}</h1>
          {getBadge(recipe)}
        </div>
      </header>

      {backLink}

      <a
        id="start-making-link"
        href={`/recipes/${encodeURIComponent(slug)}/make`}
        class="block w-full py-3 text-center text-xl font-bold rounded-lg hover:opacity-90 focus:outline-2 focus:outline-offset-2 print:hidden mb-8"
        style="background:var(--theme-accent);color:var(--theme-accent-text)"
      >
        Start {verbIng}
      </a>

      {hasAnnotations ? (
        <div
          class="ann-selection-bar print:hidden"
          id="ann-selection-bar"
          hidden
          style="background:var(--theme-surface);border-top:1px solid var(--theme-border);padding:8px 16px;display:flex;align-items:center;gap:16px;justify-content:space-between"
        >
          <span id="ann-count" class="text-sm font-bold">0 substitutions applied</span>
          <span>
            <a href="#" id="ann-share" class="text-sm" style="color:var(--theme-accent)">Share this version</a>
            <button type="button" id="ann-reset" class="text-sm ml-4" style="color:var(--theme-text-secondary)">Reset</button>
          </span>
        </div>
      ) : null}

      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4">Ingredients</h2>
        {renderIngredients(recipe.components, idCounter)}
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4">Directions</h2>
        <p class="text-sm text-gray-500 mb-3">Tap a step to cross it off.</p>
        <ol class="list-decimal list-inside space-y-3">
          {renderDirections(recipe.directions, idCounter)}
        </ol>
      </section>

      <p class="text-sm text-gray-600 mb-8">{recipe.byline}, {recipe.location}</p>

      {recipe.flavor ? (
        <p class="text-lg leading-relaxed text-gray-600 italic mb-4">{recipe.flavor}</p>
      ) : null}
      {recipe.background ? (
        <p class="text-lg leading-relaxed text-gray-600 italic recipe-background-text mb-8">{recipe.background}</p>
      ) : null}

      {recipe.links.length > 0 ? (
        <footer class="text-sm text-gray-600">
          {recipe.links.map((link, i) => (
            <>
              {i > 0 ? ', ' : null}
              <a href={link.url} target="_blank" rel="noopener noreferrer" class="hover:underline" style="color:var(--theme-accent)">
                {link.text}
              </a>
            </>
          ))}
        </footer>
      ) : null}

      {variants.length > 0 ? (
        <section class="mt-8">
          <h2 class="text-xl font-bold mb-4">See Also</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            {variants.map(v => (
              <a href={`/recipes/${encodeURIComponent(v.slug)}`} class="block p-4 rounded-lg hover:opacity-90" style="background:var(--theme-surface)">
                <span class="text-lg font-bold" style="color:var(--theme-accent)">{v.recipe.title}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {hasAnnotations ? <script src="/annotations.js" defer>{""}</script> : null}
    </main>
  )
}

export async function recipeShow(context: { params: Record<string, string> }): Promise<Response> {
  let slug = context.params.slug || ''
  let filename = getRecipeFilename(slug)

  try {
    let recipe = loadRecipe(filename)
    return render(recipe.title, renderRecipe(recipe, slug), {
      description: recipe.flavor || undefined,
    })
  } catch {
    let resp = await render(
      'Recipe not found',
      <main class="max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-4">Recipe not found</h1>
        <p style="color:var(--theme-text-secondary)">
          We couldn't find that recipe. Browse{' '}
          <a href="/recipes" class="hover:underline" style="color:var(--theme-accent)">all recipes</a>
          {' '}to find something to cook.
        </p>
      </main>
    )
    return new Response(resp.body, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
