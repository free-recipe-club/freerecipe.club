import type { RemixNode } from '@remix-run/component'
import { getActiveThemeClass } from '../data/packs.ts'

export function Document() {
  return (props: {
    title: string
    description?: string
    themeClass?: string
    children: RemixNode
  }) => {
    let themeClass = props.themeClass || getActiveThemeClass()
    return (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{props.title} — freerecipe.club</title>
          {props.description ? (
            <meta name="description" content={props.description} />
          ) : null}
          <link rel="stylesheet" href="/styles/output.css" />
        </head>
        <body class={`${themeClass} min-h-screen`}>
          <Nav />
          {props.children}
        </body>
      </html>
    )
  }
}

function Nav() {
  return () => (
    <nav
      class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between print:hidden"
      style="background:var(--theme-nav-bg)"
    >
      <a
        href="/"
        class="text-xl font-bold hover:underline"
        style="color:var(--theme-accent)"
      >
        freerecipe.club
      </a>
      <div class="flex items-center gap-4">
        <a
          href="/recipes"
          class="text-lg hover:underline"
          style="color:var(--theme-accent)"
        >
          Recipes
        </a>
        <a
          href="/packs"
          class="text-lg hover:underline"
          style="color:var(--theme-accent)"
        >
          Packs
        </a>
      </div>
    </nav>
  )
}
