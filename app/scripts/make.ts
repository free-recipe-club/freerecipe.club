document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search)
  const steps = document.querySelectorAll<HTMLElement>('.make-step')
  if (steps.length === 0) return

  const totalSteps = steps.length
  const prevBtn = document.getElementById('make-prev')
  const nextBtn = document.getElementById('make-next')
  const counter = document.getElementById('make-step-counter')
  const progressFill = document.getElementById('make-progress-fill')
  const progressBar = progressFill?.parentElement ?? null
  const slug = window.location.pathname.split('/').slice(0, -1).pop()
  const verbIng = document.body.getAttribute('data-verb-ing') ?? 'Making'
  const annParam = params.get('ann') ?? ''
  const exitUrl = '/recipes/' + slug + (annParam ? '?ann=' + annParam : '')

  // Restore step from URL or start at 0
  const parsed = parseInt(params.get('step') ?? '0', 10)
  const startStep = (isNaN(parsed) || parsed < 0 || parsed >= totalSteps) ? 0 : parsed
  let currentStep = startStep

  // Hide all steps except current
  steps.forEach((step, i) => { step.hidden = i !== currentStep })

  function updateUI() {
    steps.forEach((step, i) => { step.hidden = i !== currentStep })

    if (counter) counter.textContent = 'Step ' + (currentStep + 1) + ' of ' + totalSteps

    if (progressFill) progressFill.style.width = ((currentStep + 1) / totalSteps * 100) + '%'
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(currentStep + 1))

    // Previous button: invisible on step 1 (keeps layout stable)
    if (prevBtn) prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible'

    // Next button label: "Finish [Verb]" on last step
    if (nextBtn) nextBtn.textContent = currentStep === totalSteps - 1 ? 'Finish ' + verbIng : 'Next'

    // Focus management for screen reader announcement
    const stepText = steps[currentStep].querySelector<HTMLElement>('.make-step-text')
    if (stepText) stepText.focus()

    // Persist step in URL
    const newParams = new URLSearchParams(window.location.search)
    if (currentStep > 0) newParams.set('step', String(currentStep))
    else newParams.delete('step')
    const newUrl = window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '')
    history.replaceState(null, '', newUrl)
  }

  prevBtn?.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; updateUI() }
  })

  nextBtn?.addEventListener('click', () => {
    if (currentStep < totalSteps - 1) { currentStep++; updateUI() }
    else { window.location.href = exitUrl }
  })

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentStep > 0) { currentStep--; updateUI() }
    if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) { currentStep++; updateUI() }
    if (e.key === 'Escape') { window.location.href = exitUrl }
  })

  // Wake Lock API
  let wakeLock: WakeLockSentinel | null = null
  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return
    navigator.wakeLock.request('screen').then((lock) => {
      wakeLock = lock
    }).catch(() => {
      // silent — unavailable or denied
    })
  }
  requestWakeLock()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') requestWakeLock()
  })

  updateUI()
})
