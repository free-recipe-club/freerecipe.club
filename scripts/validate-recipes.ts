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

  // Step 3: Validate {ingredient} markers in directions match component list
  let ingredientTexts = new Set<string>()
  for (let group of recipe.components) {
    for (let i = 1; i < group.length; i++) {
      let item = group[i]
      ingredientTexts.add(typeof item === 'string' ? item : item.text)
    }
  }

  let markerRe = /\{([^}]+)\}/g
  function checkMarkers(text: string, location: string) {
    let match
    while ((match = markerRe.exec(text)) !== null) {
      let ref = match[1]
      if (!ingredientTexts.has(ref)) {
        errors.push(`${file}: ${location}: {${ref}} does not match any ingredient in components`)
      }
    }
  }

  for (let entry of recipe.directions) {
    if (typeof entry === 'string') {
      checkMarkers(entry, 'directions')
    } else if (Array.isArray(entry)) {
      for (let i = 1; i < entry.length; i++) {
        let sub = entry[i]
        let text = typeof sub === 'string' ? sub : sub.text
        checkMarkers(text, 'directions')
      }
    } else {
      checkMarkers(entry.text, 'directions')
    }
  }

  // Step 4: Annotation quality checks
  function checkAnnotations(item: unknown, location: string) {
    if (typeof item === 'object' && item !== null && 'annotations' in item) {
      let annItem = item as { text: string; annotations: { text: string; type: string; contributor: string }[] }
      for (let ann of annItem.annotations) {
        if (ann.text.trim().length === 0) {
          errors.push(`${file}: ${location}: annotation on "${annItem.text}" has empty text`)
        }
        if (ann.type !== 'substitution' && ann.type !== 'tip') {
          errors.push(`${file}: ${location}: annotation on "${annItem.text}" has invalid type "${ann.type}"`)
        }
        if (ann.contributor.trim().length === 0) {
          errors.push(`${file}: ${location}: annotation on "${annItem.text}" has empty contributor`)
        }
      }
    }
  }

  for (let group of recipe.components) {
    for (let i = 1; i < group.length; i++) {
      checkAnnotations(group[i], 'components')
    }
  }

  for (let entry of recipe.directions) {
    if (typeof entry === 'string') continue
    if (Array.isArray(entry)) {
      for (let i = 1; i < entry.length; i++) checkAnnotations(entry[i], 'directions')
    } else {
      checkAnnotations(entry, 'directions')
    }
  }

  // Step 5: Variant reference check
  if (recipe.variant_of) {
    let parentFile = recipe.variant_of.replace(/-/g, '_') + '.yml'
    let parentPath = path.join(RECIPES_DIR, parentFile)
    if (!fs.existsSync(parentPath)) {
      warnings.push(`${file}: variant_of references "${recipe.variant_of}" but ${parentFile} not found`)
    }
  }

  // Step 6: Image presence check
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
