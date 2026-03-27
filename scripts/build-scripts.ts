import * as esbuild from 'esbuild'

const watch = process.argv.includes('--watch')

const options: esbuild.BuildOptions = {
  entryPoints: ['app/assets/make.ts', 'app/assets/annotations.ts'],
  bundle: true,
  outdir: 'public',
  format: 'iife',
  minify: !watch,
  sourcemap: watch,
  target: ['es2020'],
  logLevel: 'info',
}

if (watch) {
  const ctx = await esbuild.context(options)
  await ctx.watch()
  console.log('watching for changes...')
} else {
  await esbuild.build(options)
}
