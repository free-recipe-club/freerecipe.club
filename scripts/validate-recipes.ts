import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { RecipeSchema } from '../app/data/recipe-schema.ts'

const RECIPES_DIR = path.join(process.cwd(), 'data', 'recipes')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'recipes')

let errors: string[] = []
let warnings: string[] = []

let files = fs.readdirSync(RECIPES_DIR).filter(f => f.endsWith('.yml'))

if (files.length === 0) {
  console.error('✗ No recipe files found in data/recipes/')
  process.exit(1)
}

for (let file of files) {
  let filePath = path.join(RECIPES_DIR, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  let data = parseYaml(content)

  // Step 1: Zod schema validation
  let result = RecipeSchema.safeParse(data)
  if (!result.success) {
    for (let issue of result.error.issues) {
      errors.push(`${file}: ${issue.path.join('.')}: ${issue.message}`)
    }
    continue // skip content checks if schema fails
  }

  let recipe = result.data

  // Step 2: Content quality checks
  if (recipe.title.length > 100) {
    errors.push(`${file}: title exceeds 100 characters (${recipe.title.length})`)
  }

  let hasIngredient = recipe.components.some(group => group.length > 1)
  if (!hasIngredient) {
    errors.push(`${file}: no component group has actual ingredients (only headers)`)
  }

  let hasStep = recipe.directions.some(entry =>
    typeof entry === 'string' || (Array.isArray(entry) && entry.length > 1)
  )
  if (!hasStep) {
    errors.push(`${file}: no actual direction steps found (only group headers)`)
  }

  if (recipe.background && recipe.background.length > 2000) {
    warnings.push(`${file}: background exceeds 2000 characters (${recipe.background.length})`)
  }

  // Step 3: Image presence check
  let baseName = file.replace(/\.yml$/, '')
  let imagePath = path.join(IMAGES_DIR, `${baseName}.jpg`)
  if (!fs.existsSync(imagePath)) {
    errors.push(`${file}: missing image at public/recipes/${baseName}.jpg`)
  }
}

// Summary
console.log(`\nValidated ${files.length} recipe(s):\n`)

if (warnings.length > 0) {
  for (let w of warnings) console.warn(`⚠ ${w}`)
}

if (errors.length > 0) {
  for (let e of errors) console.error(`✗ ${e}`)
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`)
  process.exit(1)
}

console.log(`✓ ${files.length} recipe(s) validated successfully`)
if (warnings.length > 0) console.log(`  ${warnings.length} warning(s)`)
process.exit(0)
