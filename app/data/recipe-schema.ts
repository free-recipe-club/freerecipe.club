import { z } from 'zod'

export const LinkSchema = z.object({
  text: z.string().min(1),
  url: z.string().url(),
})

export const COMPOUND_QTY_RE = /^\d[\d\s./]*(?:c|tsp|tbsp|oz|lb|cups?|cans?|pkg|pt|qt|gal|ml|g|kg)\b\s+(?:\d[\d\s./]*)?(?:c|tsp|tbsp|oz|lb|cups?|cans?|pkg|pt|qt|gal|ml|g|kg)\b/i

export const RecipeSchema = z.object({
  title: z.string().min(1),
  byline: z.string().min(1),
  location: z.string().min(1),
  components: z.array(z.array(z.string())).min(1).superRefine((groups, ctx) => {
    for (let group of groups) {
      for (let i = 1; i < group.length; i++) {
        if (COMPOUND_QTY_RE.test(group[i])) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Ingredient "${group[i]}" has compound quantity — use parenthetical format instead, e.g., "1 can (15 oz) pumpkin puree"`,
          })
        }
      }
    }
  }),
  directions: z.array(z.union([z.string().min(1), z.array(z.string())])).min(1),
  background: z.string().default(''),
  links: z.array(LinkSchema).default([]),
  flavor: z.string().default(''),
  pack: z.string().optional(),
})

export type Recipe = z.infer<typeof RecipeSchema>
export type Link = z.infer<typeof LinkSchema>
