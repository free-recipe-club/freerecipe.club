import fs from 'fs'

let css = fs.readFileSync('app/styles/input.css', 'utf-8')

let checks: [string, boolean][] = [
  ['@media print', css.includes('@media print')],
  ['hide nav', css.includes('nav { display: none; }')],
  ['hide recipe-image', css.includes('.recipe-image { display: none; }')],
  ['hide recipe-background-text', css.includes('.recipe-background-text { display: none; }')],
  ['hide checkbox', css.includes('input[type="checkbox"] { display: none; }')],
  ['body white bg', css.includes('background: white !important')],
  ['body black text', css.includes('color: black !important')],
  ['link URL after', css.includes('a[href]::after')],
  ['content attr href', css.includes('content:') && css.includes('attr(href)')],
  ['transparent muted bg', css.includes('.bg-brand-cream-muted')],
  ['theme tokens preserved', css.includes('--color-brand-green') && css.includes('--color-brand-cream:') && css.includes('--color-brand-cream-muted') && css.includes('--font-sans')],
]

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
