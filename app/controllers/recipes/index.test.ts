import { createAppRouter } from '../../router.ts'
import { loadRecipes, listRecipeSlugs } from '../../data/recipes.ts'

let router = createAppRouter()
let firstRecipe = loadRecipes()[0]
let firstSlug = listRecipeSlugs()[0]

let req = new Request('http://localhost:3000/recipes')
let res = await router.fetch(req)
let html = await res.text()

let checks: [string, boolean][] = [
  ['status 200', res.status === 200],
  ['Recipes heading', html.includes('Recipes')],
  ['recipe link', html.includes(`/recipes/${firstSlug}`)],
  ['first recipe title', html.includes(firstRecipe.title)],
  ['theme-aware divider', html.includes('var(--theme-divider)')],
  ['byline', html.includes(firstRecipe.byline)],
  ['flavor', html.includes(firstRecipe.flavor)],
  ['nav bar', html.includes('<nav')],
]

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
