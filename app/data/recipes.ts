import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { RecipeSchema, type Recipe } from './recipe-schema.ts'

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

export function listRecipeSlugs(recipesDir: string = RECIPES_DIR): string[] {
  return fs.readdirSync(recipesDir)
    .filter(f => f.endsWith('.yml'))
    .map(f => getRecipeSlug(f))
}
