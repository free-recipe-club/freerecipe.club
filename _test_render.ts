import { render } from './app/controllers/render.tsx'

// Test with description
let r = render('Test', '<p>hi</p>', { description: 'A test' })
let html = await r.text()
let checks = [
  ['nav', html.includes('<nav')],
  ['print:hidden', html.includes('print:hidden')],
  ['meta description', html.includes('meta name="description"')],
  ['freerecipe.club link', html.includes('href="/"')],
  ['Recipes link', html.includes('href="/recipes"')],
] as const

// Test without description
let r2 = render('Test', '<p>hi</p>')
let html2 = await r2.text()
checks = [...checks,
  ['no meta without desc', !html2.includes('meta name="description"')],
  ['nav still present', html2.includes('<nav')],
] as any

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
