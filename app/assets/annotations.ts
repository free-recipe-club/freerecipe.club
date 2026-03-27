document.addEventListener('DOMContentLoaded', () => {
  const selectionBar = document.getElementById('ann-selection-bar')
  const countEl = document.getElementById('ann-count')
  const shareLink = document.getElementById('ann-share')
  const resetBtn = document.getElementById('ann-reset')
  const makeLink = document.getElementById('start-making-link')
  const subCards = document.querySelectorAll<HTMLElement>('.ann-sub')

  if (subCards.length === 0) return

  const params = new URLSearchParams(window.location.search)
  let activeIds: number[] = (params.get('ann') ?? '').split(',').filter(Boolean).map(Number)

  // Restore active state from URL on load
  subCards.forEach((card) => {
    const id = Number(card.getAttribute('data-ann-id'))
    if (activeIds.includes(id)) activateSub(card, id)
  })
  updateUI()

  // Delegate clicks on apply/undo buttons
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const applyBtn = target.closest<HTMLElement>('.ann-apply')
    if (applyBtn) {
      const card = applyBtn.closest<HTMLElement>('.ann-sub')!
      const id = Number(card.getAttribute('data-ann-id'))
      activateSub(card, id)
      updateUI()
      return
    }
    const undoBtn = target.closest<HTMLElement>('.ann-undo')
    if (undoBtn) {
      const card = undoBtn.closest<HTMLElement>('.ann-sub')!
      const id = Number(card.getAttribute('data-ann-id'))
      deactivateSub(card, id)
      updateUI()
    }
  })

  shareLink?.addEventListener('click', (e: Event) => {
    e.preventDefault()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        shareLink.textContent = 'Copied!'
        setTimeout(() => { shareLink.textContent = 'Share this version' }, 2000)
      })
    }
  })

  resetBtn?.addEventListener('click', () => {
    subCards.forEach((card) => {
      const id = Number(card.getAttribute('data-ann-id'))
      deactivateSub(card, id)
    })
    updateUI()
  })

  function activateSub(card: HTMLElement, id: number) {
    if (!activeIds.includes(id)) activeIds.push(id)
    card.classList.add('ann-active')

    const btn = card.querySelector<HTMLElement>('.ann-apply')
    if (btn) {
      btn.textContent = 'Undo'
      btn.classList.remove('ann-apply')
      btn.classList.add('ann-undo')
    }

    const item = card.closest<HTMLElement>('.ann-item')
    if (item) {
      const orig = item.querySelector<HTMLElement>('.ann-original-text')
      const swapped = item.querySelector<HTMLElement>('.ann-swapped-text')
      if (orig) { orig.style.textDecoration = 'line-through'; orig.style.color = '#9ca3af' }
      if (swapped) { swapped.textContent = card.getAttribute('data-swap-text'); swapped.hidden = false }
    }
  }

  function deactivateSub(card: HTMLElement, id: number) {
    activeIds = activeIds.filter((a) => a !== id)
    card.classList.remove('ann-active')

    const btn = card.querySelector<HTMLElement>('.ann-undo')
    if (btn) {
      btn.textContent = 'Use this'
      btn.classList.remove('ann-undo')
      btn.classList.add('ann-apply')
    }

    const item = card.closest<HTMLElement>('.ann-item')
    if (item) {
      const hasOtherActive = item.querySelector('.ann-sub.ann-active')
      if (!hasOtherActive) {
        const orig = item.querySelector<HTMLElement>('.ann-original-text')
        const swapped = item.querySelector<HTMLElement>('.ann-swapped-text')
        if (orig) { orig.style.textDecoration = ''; orig.style.color = '' }
        if (swapped) { swapped.hidden = true; swapped.textContent = '' }
      }
    }
  }

  function updateUI() {
    const newParams = new URLSearchParams(window.location.search)
    if (activeIds.length > 0) {
      newParams.set('ann', activeIds.sort((a, b) => a - b).join(','))
    } else {
      newParams.delete('ann')
    }
    const newUrl = window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '')
    history.replaceState(null, '', newUrl)

    if (selectionBar) {
      selectionBar.hidden = activeIds.length === 0
      if (countEl) {
        countEl.textContent = activeIds.length === 1
          ? '1 substitution applied'
          : activeIds.length + ' substitutions applied'
      }
    }

    if (makeLink) {
      const base = makeLink.getAttribute('href')!.split('?')[0]
      makeLink.setAttribute('href', base + (activeIds.length > 0 ? '?ann=' + activeIds.sort((a, b) => a - b).join(',') : ''))
    }
  }
})
