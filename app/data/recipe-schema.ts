import { z } from 'zod'

export const LinkSchema = z.object({
  text: z.string().min(1),
  url: z.string().url(),
})

export const RecipeSchema = z.object({
  title: z.string().min(1),
  byline: z.string().min(1),
  location: z.string().min(1),
  components: z.array(z.array(z.string())).min(1),
  directions: z.array(z.string().min(1)).min(1),
  background: z.string().default(''),
  links: z.array(LinkSchema).default([]),
  flavor: z.string().default(''),
})

export type Recipe = z.infer<typeof RecipeSchema>
export type Link = z.infer<typeof LinkSchema>
