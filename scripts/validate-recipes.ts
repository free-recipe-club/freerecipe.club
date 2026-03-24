import { loadRecipes } from '../app/data/recipes.ts'

try {
  let recipes = loadRecipes()
  console.log(`✓ ${recipes.length} recipe(s) validated successfully`)
  process.exit(0)
} catch (error) {
  console.error('✗ Recipe validation failed:')
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
