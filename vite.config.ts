import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` → dist/ (deployable, e.g. Vercel). `npm run build:single` → dist-single/index.html with every asset inlined.
export default defineConfig(({ mode }) => ({
  base: './',
  server: { allowedHosts: ['terminal.local'] },
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 } : {},
}))
