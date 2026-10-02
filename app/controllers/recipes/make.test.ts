import { createAppRouter } from '../../router.ts'
import { listRecipeSlugs } from '../../data/recipes.ts'

let router = createAppRouter()
let slug = listRecipeSlugs()[0]
let response = await router.fetch(`http://localhost:3000/recipes/${slug}/make/2?ann=1`)
let html = await response.text()

let checks: [string, boolean][] = [
  ['make step status', response.status === 200],
  ['step has original text data', html.includes('data-original-text=')],
  ['component substitutions are available to client', html.includes('data-component-substitutions=')],
  ['step URL carries substitution selection', html.includes('ann=1')],
  ['make client script loaded', html.includes('/make.js')],
]

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
