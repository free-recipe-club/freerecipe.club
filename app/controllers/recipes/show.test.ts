import { createAppRouter } from '../../router.ts'
import { loadRecipes, listRecipeSlugs } from '../../data/recipes.ts'

let router = createAppRouter()
let recipe = loadRecipes()[0]
let slug = listRecipeSlugs()[0]

// Test valid recipe
let req = new Request(`http://localhost:3000/recipes/${slug}`)
let res = await router.fetch(req)
let html = await res.text()

let checks: [string, boolean][] = [
  ['status 200', res.status === 200],
  ['recipe title', html.includes(recipe.title)],
  ['Ingredients section', html.includes('Ingredients')],
  ['Directions section', html.includes('Directions')],
  ['peer-checked:line-through', html.includes('peer-checked:line-through')],
  ['recipe-background-text', html.includes('recipe-background-text')],
  ['theme-aware divider', html.includes('var(--theme-')],
  ['ingredient group heading', html.includes(typeof recipe.components[0][0] === 'string' ? recipe.components[0][0] : recipe.components[0][0].text)],
  ['meta description', html.includes('meta name="description"')],
  ['sr-only checkbox', html.includes('sr-only')],
  ['nav bar', html.includes('<nav')],
]

// Test 404
let req404 = new Request('http://localhost:3000/recipes/nonexistent-recipe')
let res404 = await router.fetch(req404)
let html404 = await res404.text()
checks.push(
  ['404 status', res404.status === 404],
  ['404 message', html404.includes('Recipe not found')],
  ['404 link to /recipes', html404.includes('href="/recipes"')],
)

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
