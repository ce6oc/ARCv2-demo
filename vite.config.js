import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'

const root = dirname(fileURLToPath(import.meta.url))
const pages = readdirSync(root).filter((f) => f.endsWith('.html'))

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    environment: 'jsdom',
  },
  build: {
    target: 'es2022', // top-level await is used in page modules (ES2022 feature)
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p.replace(/\.html$/, ''), resolve(root, p)])
      ),
    },
  },
})
