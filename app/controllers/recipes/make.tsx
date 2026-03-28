import { renderToString } from '@remix-run/component/server'
import { render } from '../render.tsx'
import { loadRecipe, getRecipeFilename } from '../../data/recipes.ts'
import { getActiveThemeClass } from '../../data/packs.ts'
import type { Recipe, Annotation } from '../../data/recipe-schema.ts'

type MakeStep = { text: string; section: string | null; annotations?: { id: number; annotation: Annotation }[] }

function dirItemText(item: string | { text: string }): string {
  return typeof item === 'string' ? item : item.text
}

function flattenDirections(directions: Recipe['directions'], idCounter: { value: number }): MakeStep[] {
  let steps: MakeStep[] = []
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

function resolveStepText(step: MakeStep, activeAnnIds: Set<number>): string {
  if (!step.annotations) return step.text
  for (let { id, annotation } of step.annotations) {
    if (annotation.type === 'substitution' && activeAnnIds.has(id)) {
      return annotation.text
    }
  }
  return step.text
}

function extractIngredientName(ingredient: string): string {
  let stripped = ingredient.replace(
    /^[\d\s./]+(?:c|tsp|tbsp|oz|lb|lg|sm|med|cups?|cans?|pkg|pt|qt|gal|ml|g|kg|inch|cloves?|bunch|head|sticks?|pinch|dash|slices?)\b\s*/i,
    ''
  )
  if (stripped !== ingredient) return stripped.trim()
  return ingredient.replace(/^[\d\s./]+/, '').trim()
}

function extractQuantity(ingredient: string): string {
  let name = extractIngredientName(ingredient)
  let idx = ingredient.toLowerCase().indexOf(name.toLowerCase())
  if (idx <= 0) return ''
  return ingredient.substring(0, idx).trim()
}

function renderInlineIngredients(text: string, subMap?: Map<string, string>) {
  let parts: any[] = []
  let lastIndex = 0
  let re = /\{([^}]+)\}/g
  let match
  while ((match = re.exec(text)) !== null) {
    parts.push(text.slice(lastIndex, match.index))
    let ref = match[1]
    let display = subMap?.get(ref) || ref
    let qty = extractQuantity(display)
    let name = extractIngredientName(display)
    if (qty) {
      parts.push(<span class="make-ingredient"><b class="make-qty">{qty}</b> {name}</span>)
    } else {
      parts.push(<span class="make-ingredient">{display}</span>)
    }
    lastIndex = re.lastIndex
  }
  parts.push(text.slice(lastIndex))
  return parts
}

function stepUrl(slug: string, stepNum: number, annQuery: string): string {
  let base = stepNum <= 1
    ? `/recipes/${encodeURIComponent(slug)}/make`
    : `/recipes/${encodeURIComponent(slug)}/make/${stepNum}`
  return base + annQuery
}

async function renderMakeMode(recipe: Recipe, slug: string, activeAnnIds: Set<number>, currentStep: number): Promise<Response> {
  let subMap = new Map<string, string>()
  let idCounter = { value: 1 }
  for (let group of recipe.components) {
    for (let i = 1; i < group.length; i++) {
      let item = group[i]
      if (typeof item !== 'string' && 'annotations' in item) {
        for (let ann of item.annotations) {
          let id = idCounter.value++
          if (ann.type === 'substitution' && activeAnnIds.has(id)) {
            subMap.set(item.text, ann.text)
          }
        }
      }
    }
  }
  let steps = flattenDirections(recipe.directions, idCounter)
  let total = steps.length
  let themeClass = getActiveThemeClass()
  let verb = recipe.make_verb || 'Make'
  let verbIng = verb.endsWith('e') ? verb.slice(0, -1) + 'ing' : verb + 'ing'
  let annQuery = activeAnnIds.size > 0 ? '?ann=' + [...activeAnnIds].sort((a, b) => a - b).join(',') : ''

  if (currentStep < 1) currentStep = 1
  if (currentStep > total) currentStep = total
  let idx = currentStep - 1
  let step = steps[idx]

  let displayText = resolveStepText(step, activeAnnIds)
  let tips = (step.annotations || []).filter(a => a.annotation.type === 'tip')

  let prevHref = currentStep > 1 ? stepUrl(slug, currentStep - 1, annQuery) : null
  let nextHref = currentStep < total ? stepUrl(slug, currentStep + 1, annQuery) : null
  let exitHref = `/recipes/${encodeURIComponent(slug)}${annQuery}`

  let html = await renderToString(
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{recipe.title} — Step {currentStep} — {verbIng} — freerecipe.club</title>
        <link rel="stylesheet" href="/styles/output.css" />
      </head>
      <body
        class={`${themeClass} make-mode`}
        style="background:var(--make-bg);color:var(--make-text);margin:0;min-height:100vh;min-height:100dvh"
        data-next={nextHref || undefined}
      >
        <div class="make-top-bar">
          <a href={exitHref} aria-label={`Exit ${verbIng.toLowerCase()} mode`} class="make-exit">✕</a>
          <span class="make-step-counter">Step {currentStep} of {total}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`${verbIng} progress`}
          class="make-progress"
        >
          <div class="make-progress-fill" style={`width:${(currentStep / total * 100).toFixed(1)}%`}></div>
        </div>
        <div class="make-step" aria-live="polite">
          {step.section ? <div class="make-section-label">{step.section}</div> : null}
          <div class="make-step-text">{renderInlineIngredients(displayText, subMap)}</div>
          {tips.length > 0 ? (
            <details class="make-tip" style="margin-top:12px">
              <summary>💡 {tips.length === 1 ? 'Tip' : `${tips.length} Tips`}</summary>
              {tips.map(t => (
                <p class="make-tip-text">
                  {t.annotation.text}{' '}
                  <span style="opacity:0.6">— {t.annotation.contributor}</span>
                </p>
              ))}
            </details>
          ) : null}
        </div>
        <nav class="make-nav">
          {prevHref
            ? <a href={prevHref} class="make-btn make-btn-link">Previous</a>
            : <span class="make-btn" style="visibility:hidden">Previous</span>}
          {nextHref
            ? <a href={nextHref} class="make-btn make-btn-link">Next</a>
            : <a href={exitHref} class="make-btn make-btn-link">Finish {verbIng}</a>}
        </nav>
        <script src="/make.js" defer>{""}</script>
      </body>
    </html>
  )

  return new Response('<!doctype html>' + html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export async function recipeMake(context: { params: Record<string, string>; url: URL }): Promise<Response> {
  let { params, url } = context
  let slug = params.slug || ''
  let currentStep = parseInt(params.step || '', 10) || 1
  let filename = getRecipeFilename(slug)

  try {
    let recipe = loadRecipe(filename)
    let annParam = url.searchParams.get('ann') || ''
    let activeAnnIds = new Set(annParam.split(',').filter(Boolean).map(Number))
    return renderMakeMode(recipe, slug, activeAnnIds, currentStep)
  } catch {
    let resp = await render(
      'Recipe not found',
      <main class="max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-4">Recipe not found</h1>
        <p style="color:var(--theme-text-secondary)">
          We couldn't find that recipe. Browse{' '}
          <a href="/recipes" class="hover:underline" style="color:var(--theme-accent)">all recipes</a>
          {' '}to find something to make.
        </p>
      </main>
    )
    return new Response(resp.body, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
