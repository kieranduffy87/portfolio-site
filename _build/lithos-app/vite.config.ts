import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds straight into the portfolio's lab folder. Relative base so the page
// works from any path on GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../../lab/lithos',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
})
