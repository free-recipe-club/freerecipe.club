document.addEventListener('DOMContentLoaded', function () {
  var steps = document.querySelectorAll('.cook-step')
  if (steps.length === 0) return

  var currentStep = 0
  var totalSteps = steps.length
  var prevBtn = document.getElementById('cook-prev')
  var nextBtn = document.getElementById('cook-next')
  var counter = document.getElementById('cook-step-counter')
  var progressFill = document.getElementById('cook-progress-fill')
  var progressBar = progressFill ? progressFill.parentElement : null
  var slug = window.location.pathname.split('/').slice(0, -1).pop()

  // Hide all steps except first
  for (var i = 1; i < steps.length; i++) {
    steps[i].hidden = true
  }

  function updateUI() {
    // Show/hide steps
    for (var i = 0; i < steps.length; i++) {
      steps[i].hidden = (i !== currentStep)
    }
    // Step counter
    if (counter) counter.textContent = 'Step ' + (currentStep + 1) + ' of ' + totalSteps
    // Progress bar
    if (progressFill) progressFill.style.width = ((currentStep + 1) / totalSteps * 100) + '%'
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(currentStep + 1))
    // Previous button: invisible on step 1 (keeps layout stable)
    if (prevBtn) prevBtn.style.visibility = (currentStep === 0) ? 'hidden' : 'visible'
    // Next button label: "Finish Cooking" on last step
    if (nextBtn) nextBtn.textContent = (currentStep === totalSteps - 1) ? 'Finish Cooking' : 'Next'
    // Focus management: move focus to step text for screen reader announcement
    var stepText = steps[currentStep].querySelector('.cook-step-text')
    if (stepText) stepText.focus()
  }

  // Navigation handlers
  if (prevBtn) prevBtn.addEventListener('click', function () {
    if (currentStep > 0) { currentStep--; updateUI() }
  })
  if (nextBtn) nextBtn.addEventListener('click', function () {
    if (currentStep < totalSteps - 1) { currentStep++; updateUI() }
    else { window.location.href = '/recipes/' + slug }
  })

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && currentStep > 0) { currentStep--; updateUI() }
    if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) { currentStep++; updateUI() }
    if (e.key === 'Escape') { window.location.href = '/recipes/' + slug }
  })

  // Wake Lock API
  var wakeLock = null
  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return
    navigator.wakeLock.request('screen').then(function (lock) {
      wakeLock = lock
    }).catch(function () {
      // silent — unavailable or denied
    })
  }
  requestWakeLock()
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') requestWakeLock()
  })

  // Initial UI state
  updateUI()
})
