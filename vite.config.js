import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const pages = [
  'index', 'teacher-signin', 'teacher-dashboard', 'classes',
  'lesson-library', 'lesson-builder', 'live-monitor', 'analytics',
  'join', 'student-lessons', 'player', 'results',
]

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p, resolve(__dirname, `${p}.html`)])
      ),
    },
  },
})
