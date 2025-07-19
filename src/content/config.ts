import { defineCollection, z } from 'astro:content';

const linkSchema = z.object({
  text: z.string(),
  url: z.string().url(),
});

const recipeSchema = z.object({
  title: z.string(),
  byline: z.string(),
  location: z.string(),
  components: z.array(z.union([z.string(), z.array(z.string())])),
  directions: z.array(z.string()),
  background: z.string(),
  links: z.array(linkSchema),
  flavor: z.string(),
});

const recipes = defineCollection({
  type: 'data',
  schema: recipeSchema,
});

export const collections = {
  recipes,
};