import { renderToString } from '@remix-run/component/server'
import type { RemixNode } from '@remix-run/component'
import { Document } from '../ui/document.tsx'

export async function render(
  title: string,
  content: RemixNode,
  options?: { description?: string; themeClass?: string }
): Promise<Response> {
  let html = await renderToString(
    <Document title={title} description={options?.description} themeClass={options?.themeClass}>
      {content}
    </Document>
  )
  return new Response('<!doctype html>' + html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
