import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { PackSchema, ActivePackSchema, type Pack } from './pack-schema.ts'
import { loadRecipes } from './recipes.ts'
import type { Recipe } from './recipe-schema.ts'

const PACKS_DIR = path.join(process.cwd(), 'data', 'packs')

export function loadPack(slug: string): Pack {
  let filePath = path.join(PACKS_DIR, `${slug}.yml`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Pack not found: ${slug}`)
  }
  let content = fs.readFileSync(filePath, 'utf-8')
  let data = parseYaml(content)
  let result = PackSchema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Invalid pack ${slug}.yml:\n${result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n')}`
    )
  }
  return result.data
}

export function loadPacks(): Pack[] {
  let files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.yml') && !f.startsWith('_'))
  return files.map(file => {
    let slug = file.replace(/\.yml$/, '')
    return loadPack(slug)
  })
}

export function getActivePack(): string {
  let filePath = path.join(PACKS_DIR, '_active.yml')
  let content = fs.readFileSync(filePath, 'utf-8')
  let data = parseYaml(content)
  let result = ActivePackSchema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Invalid _active.yml:\n${result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n')}`
    )
  }
  return result.data.active
}

export function getActiveThemeClass(): string {
  let slug = getActivePack()
  let pack = loadPack(slug)
  return pack.theme_class
}

export function loadRecipesByPack(packSlug: string): Recipe[] {
  return loadRecipes().filter(r => r.pack === packSlug)
}
