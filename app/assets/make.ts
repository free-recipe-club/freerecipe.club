document.addEventListener('DOMContentLoaded', () => {
  const nextLink = document.querySelector<HTMLAnchorElement>('.make-nav a.make-btn-link:last-of-type')
  const prevLink = document.querySelector<HTMLAnchorElement>('.make-nav a.make-btn-link:first-of-type')
  const exitLink = document.querySelector<HTMLAnchorElement>('.make-exit')

  const params = new URLSearchParams(window.location.search)
  const activeIds = new Set((params.get('ann') || '').split(',').filter(Boolean).map(Number))
  const stepText = document.querySelector<HTMLElement>('.make-step-text')
  const componentSubs = JSON.parse(document.body.dataset.componentSubstitutions || '[]') as {
    id: number
    ingredient: string
    text: string
  }[]

  if (stepText) {
    const directionSubs = JSON.parse(stepText.dataset.directionSubstitutions || '[]') as {
      id: number
      text: string
    }[]
    const directionSwap = directionSubs.find(swap => activeIds.has(swap.id))
    const text = directionSwap?.text || stepText.dataset.originalText || stepText.textContent || ''
    const ingredientSwaps = new Map(
      componentSubs
        .filter(swap => activeIds.has(swap.id))
        .map(swap => [swap.ingredient, swap.text])
    )

    stepText.replaceChildren()
    let lastIndex = 0
    const marker = /\{([^}]+)\}/g
    let match: RegExpExecArray | null
    while ((match = marker.exec(text)) !== null) {
      stepText.append(document.createTextNode(text.slice(lastIndex, match.index)))
      const original = match[1]
      const display = ingredientSwaps.get(original) || original
      const ingredient = document.createElement('span')
      ingredient.className = 'make-ingredient'
      const quantity = extractQuantity(display)
      const name = extractIngredientName(display)
      if (quantity) {
        const quantityNode = document.createElement('b')
        quantityNode.className = 'make-qty'
        quantityNode.textContent = quantity
        ingredient.append(quantityNode, document.createTextNode(` ${name}`))
      } else {
        ingredient.textContent = display
      }
      stepText.append(ingredient)
      lastIndex = marker.lastIndex
    }
    stepText.append(document.createTextNode(text.slice(lastIndex)))
  }

  // Carry selected substitutions through every pre-rendered step URL.
  const annQuery = [...activeIds].sort((a, b) => a - b).join(',')
  for (const link of document.querySelectorAll<HTMLAnchorElement>('.make-exit, .make-nav a')) {
    const url = new URL(link.href, window.location.href)
    if (annQuery) url.searchParams.set('ann', annQuery)
    else url.searchParams.delete('ann')
    link.href = url.pathname + url.search
  }

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' && nextLink) { nextLink.click() }
    if (e.key === 'ArrowLeft' && prevLink) { prevLink.click() }
    if (e.key === 'Escape' && exitLink) { exitLink.click() }
  })

  // Wake Lock API
  let wakeLock: WakeLockSentinel | null = null
  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return
    navigator.wakeLock.request('screen').then((lock) => {
      wakeLock = lock
    }).catch(() => {})
  }
  requestWakeLock()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') requestWakeLock()
  })
})

function extractIngredientName(ingredient: string): string {
  const stripped = ingredient.replace(
    /^[\d\s./]+(?:c|tsp|tbsp|oz|lb|lg|sm|med|cups?|cans?|pkg|pt|qt|gal|ml|g|kg|inch|cloves?|bunch|head|sticks?|pinch|dash|slices?)\b\s*/i,
    ''
  )
  if (stripped !== ingredient) return stripped.trim()
  return ingredient.replace(/^[\d\s./]+/, '').trim()
}

function extractQuantity(ingredient: string): string {
  const name = extractIngredientName(ingredient)
  const idx = ingredient.toLowerCase().indexOf(name.toLowerCase())
  if (idx <= 0) return ''
  return ingredient.substring(0, idx).trim()
}
