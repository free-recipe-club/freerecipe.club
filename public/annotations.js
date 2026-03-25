document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('ann-js-ready')

  var toggles = document.querySelectorAll('.ann-toggle-switch')
  var tipTriggers = document.querySelectorAll('.ann-tip-trigger')
  var selectionBar = document.getElementById('ann-selection-bar')
  var countEl = document.getElementById('ann-count')
  var shareLink = document.getElementById('ann-share')
  var resetBtn = document.getElementById('ann-reset')
  var cookLink = document.getElementById('start-cooking-link')

  if (toggles.length === 0 && tipTriggers.length === 0) return

  var params = new URLSearchParams(window.location.search)
  var activeIds = (params.get('ann') || '').split(',').filter(Boolean).map(Number)

  toggles.forEach(function (toggle) {
    var id = Number(toggle.getAttribute('data-ann-id'))
    if (activeIds.indexOf(id) !== -1) {
      activateToggle(toggle, id)
    }
  })
  updateUI()

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var id = Number(toggle.getAttribute('data-ann-id'))
      var isActive = toggle.getAttribute('aria-checked') === 'true'
      if (isActive) {
        deactivateToggle(toggle, id)
      } else {
        activateToggle(toggle, id)
      }
      updateUI()
    })
  })

  tipTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true'
      trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true')
      var chevron = trigger.querySelector('.ann-chevron')
      if (chevron) chevron.textContent = expanded ? '▾' : '▴'
    })
  })

  if (shareLink) {
    shareLink.addEventListener('click', function (e) {
      e.preventDefault()
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          shareLink.textContent = 'Copied!'
          setTimeout(function () { shareLink.textContent = 'Share this version' }, 2000)
        })
      }
    })
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      toggles.forEach(function (toggle) {
        var id = Number(toggle.getAttribute('data-ann-id'))
        deactivateToggle(toggle, id)
      })
      updateUI()
    })
  }

  function activateToggle(toggle, id) {
    toggle.setAttribute('aria-checked', 'true')
    var item = toggle.closest('.ann-item')
    if (item) item.classList.add('ann-active')
    if (activeIds.indexOf(id) === -1) activeIds.push(id)
  }

  function deactivateToggle(toggle, id) {
    toggle.setAttribute('aria-checked', 'false')
    var item = toggle.closest('.ann-item')
    if (item) item.classList.remove('ann-active')
    activeIds = activeIds.filter(function (a) { return a !== id })
  }

  function updateUI() {
    var newParams = new URLSearchParams(window.location.search)
    if (activeIds.length > 0) {
      newParams.set('ann', activeIds.sort(function (a, b) { return a - b }).join(','))
    } else {
      newParams.delete('ann')
    }
    var newUrl = window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '')
    history.replaceState(null, '', newUrl)

    if (selectionBar) {
      selectionBar.hidden = activeIds.length === 0
      if (countEl) {
        countEl.textContent = activeIds.length === 1
          ? '1 substitution applied'
          : activeIds.length + ' substitutions applied'
      }
    }

    if (cookLink) {
      var base = cookLink.getAttribute('href').split('?')[0]
      cookLink.setAttribute('href', base + (activeIds.length > 0 ? '?ann=' + activeIds.sort(function (a, b) { return a - b }).join(',') : ''))
    }
  }
})
