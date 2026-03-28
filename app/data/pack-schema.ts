import { z } from 'zod'

export const PackSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  sigil: z.string().default(''),
  theme_class: z.string().min(1),
  colors: z.object({
    bg: z.string(),
    bg_muted: z.string(),
    surface: z.string(),
    accent: z.string(),
    accent_hover: z.string(),
    text: z.string(),
    text_secondary: z.string(),
    border: z.string(),
  }),
  typography: z.object({
    heading_font: z.string(),
    body_font: z.string(),
  }),
})

export const ActivePackSchema = z.object({
  active: z.string().min(1),
})

export type Pack = z.infer<typeof PackSchema>
