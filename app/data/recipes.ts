import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { RecipeSchema, type Recipe, type Annotation, type AnnotatedItem } from './recipe-schema.ts'

const RECIPES_DIR = path.join(process.cwd(), 'data', 'recipes')

export function loadRecipes(recipesDir: string = RECIPES_DIR): Recipe[] {
  let files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.yml'))
  return files.map(file => loadRecipeFile(path.join(recipesDir, file)))
}

export function loadRecipe(slug: string, recipesDir: string = RECIPES_DIR): Recipe {
  let filePath = path.join(recipesDir, `${slug}.yml`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Recipe not found: ${slug}`)
  }
  return loadRecipeFile(filePath)
}

function loadRecipeFile(filePath: string): Recipe {
  let content = fs.readFileSync(filePath, 'utf-8')
  let data = parseYaml(content)
  let result = RecipeSchema.safeParse(data)
  if (!result.success) {
    let fileName = path.basename(filePath)
    throw new Error(
      `Invalid recipe ${fileName}:\n${result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n')}`
    )
  }
  return result.data
}

export function getRecipeSlug(filename: string): string {
  return filename.replace(/\.yml$/, '').replace(/_/g, '-')
}

export function getRecipeFilename(slug: string): string {
  return slug.replace(/-/g, '_')
}

export function listRecipeSlugs(recipesDir: string = RECIPES_DIR): string[] {
  return fs.readdirSync(recipesDir)
    .filter(f => f.endsWith('.yml'))
    .map(f => getRecipeSlug(f))
}

export function countSteps(recipe: Recipe): number {
  let count = 0
  for (let entry of recipe.directions) {
    if (typeof entry === 'string') {
      count++
    } else if (Array.isArray(entry)) {
      count += entry.length - 1 // first element is section header
    } else {
      count++
    }
  }
  return count
}

export type CollectedAnnotation = {
  id: number
  annotation: Annotation
  source: 'component' | 'direction'
  itemText: string
}

export function collectAnnotations(recipe: Recipe): CollectedAnnotation[] {
  let results: CollectedAnnotation[] = []
  let id = 1

  for (let group of recipe.components) {
    for (let i = 1; i < group.length; i++) {
      let item = group[i]
      if (typeof item !== 'string' && 'annotations' in item) {
        for (let ann of item.annotations) {
          results.push({ id: id++, annotation: ann, source: 'component', itemText: item.text })
        }
      }
    }
  }

  for (let entry of recipe.directions) {
    if (typeof entry === 'string') continue
    if (!Array.isArray(entry) && 'annotations' in entry) {
      for (let ann of entry.annotations) {
        results.push({ id: id++, annotation: ann, source: 'direction', itemText: entry.text })
      }
    }
    if (Array.isArray(entry)) {
      for (let i = 1; i < entry.length; i++) {
        let item = entry[i]
        if (typeof item !== 'string' && 'annotations' in item) {
          for (let ann of item.annotations) {
            results.push({ id: id++, annotation: ann, source: 'direction', itemText: item.text })
          }
        }
      }
    }
  }

  return results
}
