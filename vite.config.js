import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'

const root = dirname(fileURLToPath(import.meta.url))
const pages = readdirSync(root).filter((f) => f.endsWith('.html'))

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p.replace(/\.html$/, ''), resolve(root, p)])
      ),
    },
  },
})
