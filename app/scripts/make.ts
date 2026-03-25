document.addEventListener('DOMContentLoaded', () => {
  const nextLink = document.querySelector<HTMLAnchorElement>('.make-nav a.make-btn-link:last-of-type')
  const prevLink = document.querySelector<HTMLAnchorElement>('.make-nav a.make-btn-link:first-of-type')
  const exitLink = document.querySelector<HTMLAnchorElement>('.make-exit')

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
