import { createAppRouter } from '../../router.ts'

let router = createAppRouter()

let req = new Request('http://localhost:3000/recipes')
let res = await router.fetch(req)
let html = await res.text()

let checks: [string, boolean][] = [
  ['status 200', res.status === 200],
  ['Recipes heading', html.includes('Recipes')],
  ['pumpkin-doughnut link', html.includes('pumpkin-doughnut')],
  ['Pumpkin Doughnut title', html.includes('Pumpkin Doughnut')],
  ['theme-aware divider', html.includes('var(--theme-divider)')],
  ['byline', html.includes('Michelle Weinfeld-Geller')],
  ['flavor', html.includes('Pumpkin spice season')],
  ['nav bar', html.includes('<nav')],
]

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
