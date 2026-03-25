import { z } from 'zod'

export const LinkSchema = z.object({
  text: z.string().min(1),
  url: z.string().url(),
})

export const AnnotationSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['substitution', 'tip']),
  contributor: z.string().min(1),
})

export const AnnotatedItemSchema = z.object({
  text: z.string().min(1),
  annotations: z.array(AnnotationSchema).min(1),
})

const IngredientItemSchema = z.union([z.string(), AnnotatedItemSchema])

const DirectionItemSchema = z.union([z.string().min(1), AnnotatedItemSchema])

export const COMPOUND_QTY_RE = /^\d[\d\s./]*(?:c|tsp|tbsp|oz|lb|cups?|cans?|pkg|pt|qt|gal|ml|g|kg)\b\s+(?:\d[\d\s./]*)?(?:c|tsp|tbsp|oz|lb|cups?|cans?|pkg|pt|qt|gal|ml|g|kg)\b/i

export const RecipeSchema = z.object({
  title: z.string().min(1),
  byline: z.string().min(1),
  location: z.string().min(1),
  components: z.array(z.array(IngredientItemSchema)).min(1).superRefine((groups, ctx) => {
    for (let group of groups) {
      for (let i = 1; i < group.length; i++) {
        let item = group[i]
        let text = typeof item === 'string' ? item : item.text
        if (COMPOUND_QTY_RE.test(text)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Ingredient "${text}" has compound quantity — use parenthetical format instead, e.g., "1 can (15 oz) pumpkin puree"`,
          })
        }
      }
    }
  }),
  directions: z.array(z.union([DirectionItemSchema, z.array(DirectionItemSchema)])).min(1),
  background: z.string().default(''),
  links: z.array(LinkSchema).default([]),
  flavor: z.string().default(''),
  pack: z.string().optional(),
  variant_of: z.string().optional(),
})

export type Recipe = z.infer<typeof RecipeSchema>
export type Link = z.infer<typeof LinkSchema>
export type Annotation = z.infer<typeof AnnotationSchema>
export type AnnotatedItem = z.infer<typeof AnnotatedItemSchema>
