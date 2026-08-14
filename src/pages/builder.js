import { api } from '../data/api.js'
import { teacherShell } from '../components/teacher-layout.js'
import { card, button, esc, emptyState } from '../components/ui.js'
import { $, $$, app } from '../components/page.js'
import { renderScene } from '../components/scene-renderers.js'

const SCENE_TYPES = [
  { type: 'content',              emoji: '📝', label: 'Content' },
  { type: 'video',                emoji: '🎬', label: 'Video' },
  { type: 'multiple-choice-quiz', emoji: '❓', label: 'Multiple Choice' },
  { type: 'categorize-items',     emoji: '🗂️', label: 'Categorize Items' },
  { type: 'match-pairs',          emoji: '🔗', label: 'Match Pairs' },
  { type: 'open-text-question',   emoji: '✍️', label: 'Open Text' },
  { type: 'audio-response',       emoji: '🎤', label: 'Audio Response' },
  { type: 'custom-interactive',   emoji: '🧩', label: 'Custom Interactive' },
]
const META = Object.fromEntries(SCENE_TYPES.map((t) => [t.type, t]))

app().innerHTML =
  '<div class="min-h-screen grid place-items-center text-brand-400 font-semibold">Loading builder…</div>'

const lesson = await api.getLesson('lesson-solar')
let scenes = (lesson?.scenes || []).map((s) => ({
  ...s,
  interactiveElement: s.interactiveElement ? { ...s.interactiveElement } : undefined,
}))
let selectedId = null
let lessonTitle = lesson?.title || 'Journey Through the Solar System'

let dragMode = null
let dragType = null
let dragFromIndex = null

render()

function render() {
  app().innerHTML = teacherShell({ active: 'builder', title: 'Lesson Builder', content: build() })
  wire()
  renderPreview()
}

function stripTags(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function snippet(scene) {
  const t = stripTags(scene.content)
  if (!t) return '<span class="italic text-brand-300">empty</span>'
  return esc(t.length > 60 ? t.slice(0, 60) + '…' : t)
}

function toolbar() {
  return (
    '<div class="flex items-center gap-3 flex-wrap mb-4">' +
    '<input id="lesson-title" type="text" value="' + esc(lessonTitle) + '" ' +
    'class="flex-1 min-w-[200px] text-lg font-extrabold text-brand-700 bg-transparent border-b-2 border-brand-200 focus:border-brand-500 outline-none py-1" />' +
    '<span id="save-draft">' + button('Save draft', { variant: 'ghost', size: 'sm' }) + '</span>' +
    button('Preview full lesson', { variant: 'primary', size: 'sm', href: '/player.html?id=lesson-solar' }) +
    '</div>'
  )
}

function palette() {
  const tiles = SCENE_TYPES.map((t) =>
    '<div draggable="true" data-type="' + esc(t.type) + '" ' +
    'class="palette-tile flex items-center gap-2 p-2.5 rounded-card border border-brand-200 hover:border-brand-400 hover:bg-brand-50 cursor-grab active:cursor-grabbing transition">' +
    '<span class="text-xl">' + t.emoji + '</span>' +
    '<span class="text-sm font-semibold text-brand-700">' + esc(t.label) + '</span></div>'
  ).join('')
  return card(
    '<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400 mb-1">Scenes</h3>' +
    '<p class="text-xs text-brand-300 mb-3">Drag onto the canvas</p>' +
    '<div class="flex flex-col gap-2">' + tiles + '</div>'
  )
}

function canvas() {
  const blocks = scenes.map((s, i) => {
    const meta = META[s.sceneType] || { emoji: '🎬', label: s.sceneType }
    const on = s.sceneId === selectedId
    return (
      '<div data-block="' + i + '" draggable="true" ' +
      'class="bg-white rounded-card border p-3 cursor-pointer transition ' +
      (on ? 'border-brand-500 ring-2 ring-brand-200' : 'border-brand-200 hover:border-brand-400') + '">' +
      '<div class="flex items-center gap-3">' +
      '<span class="flex items-center justify-center w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-sm shrink-0">' + (i + 1) + '</span>' +
      '<span class="text-xl shrink-0">' + meta.emoji + '</span>' +
      '<div class="flex-1 min-w-0">' +
      '<p class="font-bold text-brand-700 text-sm leading-tight">' + esc(meta.label) + '</p>' +
      '<p class="text-xs text-brand-400 truncate">' + snippet(s) + '</p>' +
      '</div>' +
      '<button data-remove="' + i + '" type="button" ' +
      'class="text-brand-300 hover:text-accent-500 font-bold w-6 h-6 shrink-0" aria-label="Remove scene">✕</button>' +
      '</div></div>'
    )
  }).join('')
  return (
    '<div>' +
    '<div class="flex items-center justify-between mb-2">' +
    '<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400">Canvas</h3>' +
    '<span class="text-xs text-brand-300">' + scenes.length + ' scenes</span>' +
    '</div>' +
    '<div id="canvas-drop" class="min-h-[220px] space-y-2">' +
    (blocks || '<div class="text-center text-brand-300 py-12 border-2 border-dashed border-brand-200 rounded-card">Drag scenes here</div>') +
    '</div></div>'
  )
}

function inspector() {
  const scene = scenes.find((s) => s.sceneId === selectedId)
  if (!scene) {
    return (
      '<div class="space-y-3">' +
      '<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400">Inspector</h3>' +
      emptyState('Select a scene to preview') +
      '</div>'
    )
  }
  const meta = META[scene.sceneType] || { label: scene.sceneType }
  const titleVal = scene._title != null ? scene._title : meta.label
  return (
    '<div class="space-y-3">' +
    '<h3 class="text-sm font-bold uppercase tracking-wide text-brand-400">Inspector</h3>' +
    card(
      '<p class="text-xs text-brand-400 mb-2">' + esc(meta.label) + '</p>' +
      '<label class="block text-xs font-bold uppercase tracking-wide text-brand-400 mb-1">Title</label>' +
      '<input id="insp-title" type="text" value="' + esc(titleVal) + '" ' +
      'class="w-full rounded-card border border-brand-200 px-3 py-2 text-sm text-brand-700 outline-none focus:border-brand-500 mb-3" />' +
      '<label class="block text-xs font-bold uppercase tracking-wide text-brand-400 mb-1">Content</label>' +
      '<textarea id="insp-content" rows="4" ' +
      'class="w-full rounded-card border border-brand-200 px-3 py-2 text-xs text-brand-700 outline-none focus:border-brand-500 font-mono">' +
      esc(scene.content || '') + '</textarea>' +
      '<p class="text-xs text-brand-300 mt-2 italic">Fields shown for illustration</p>'
    ) +
    card(
      '<h4 class="text-xs font-bold uppercase tracking-wide text-brand-400 mb-2">Live preview</h4>' +
      '<div class="rounded-card border border-brand-100 p-3 bg-canvas overflow-hidden">' +
      '<div id="preview-mount"></div></div>'
    ) +
    '</div>'
  )
}

function build() {
  return (
    '<div>' +
    toolbar() +
    '<div class="grid md:grid-cols-[300px_1fr_520px] gap-4 items-start">' +
    palette() + canvas() + inspector() +
    '</div>' +
    '<div id="toast" class="fixed bottom-6 right-6 bg-brand-700 text-white px-4 py-2 rounded-pill shadow-lg opacity-0 pointer-events-none transition-opacity z-50"></div>' +
    '</div>'
  )
}

function renderPreview() {
  const mount = document.getElementById('preview-mount')
  if (!mount) return
  const scene = scenes.find((s) => s.sceneId === selectedId)
  if (!scene) { mount.innerHTML = ''; return }
  renderScene(scene, () => {}, mount)
}

function wire() {
  $$('.palette-tile').forEach((tile) => {
    tile.addEventListener('dragstart', (e) => {
      dragMode = 'palette'
      dragType = tile.dataset.type
      e.dataTransfer.effectAllowed = 'copy'
      e.dataTransfer.setData('text/plain', 'palette:' + dragType)
    })
  })

  const titleInput = $('#lesson-title')
  if (titleInput) titleInput.addEventListener('input', (e) => { lessonTitle = e.target.value })

  const save = $('#save-draft button')
  const toast = $('#toast')
  if (save && toast) {
    save.addEventListener('click', () => {
      toast.textContent = 'Draft saved ✓'
      toast.classList.remove('opacity-0')
      clearTimeout(wire._t)
      wire._t = setTimeout(() => toast.classList.add('opacity-0'), 1600)
    })
  }

  $$('[data-block]').forEach((block) => {
    const idx = Number(block.dataset.block)
    block.addEventListener('click', (e) => {
      if (e.target.closest('[data-remove]')) return
      selectedId = scenes[idx].sceneId
      render()
    })
    block.addEventListener('dragstart', (e) => {
      if (e.target.closest('[data-remove]')) return
      dragMode = 'reorder'
      dragFromIndex = idx
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', 'reorder:' + idx)
    })
    block.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = dragMode === 'palette' ? 'copy' : 'move'
      const rect = block.getBoundingClientRect()
      const after = e.clientY - rect.top > rect.height / 2
      block.style.borderTop = after ? '' : '3px solid #7c3aed'
      block.style.borderBottom = after ? '3px solid #7c3aed' : ''
    })
    block.addEventListener('dragleave', () => {
      block.style.borderTop = ''
      block.style.borderBottom = ''
    })
    block.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const rect = block.getBoundingClientRect()
      const after = e.clientY - rect.top > rect.height / 2
      block.style.borderTop = ''
      block.style.borderBottom = ''
      performDrop(after ? idx + 1 : idx)
    })
  })

  $$('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const i = Number(btn.dataset.remove)
      const removedId = scenes[i]?.sceneId
      scenes.splice(i, 1)
      if (selectedId === removedId) selectedId = null
      render()
    })
  })

  const drop = $('#canvas-drop')
  if (drop) {
    drop.addEventListener('dragover', (e) => {
      if (e.target.closest('[data-block]')) return
      e.preventDefault()
      e.dataTransfer.dropEffect = dragMode === 'palette' ? 'copy' : 'move'
    })
    drop.addEventListener('drop', (e) => {
      if (e.target.closest('[data-block]')) return
      e.preventDefault()
      performDrop(scenes.length)
    })
  }

  const inspTitle = $('#insp-title')
  const inspContent = $('#insp-content')
  if (inspTitle) {
    inspTitle.addEventListener('input', (e) => {
      const sc = scenes.find((s) => s.sceneId === selectedId)
      if (sc) sc._title = e.target.value
    })
  }
  if (inspContent) {
    inspContent.addEventListener('input', (e) => {
      const sc = scenes.find((s) => s.sceneId === selectedId)
      if (sc) { sc.content = e.target.value; renderPreview() }
    })
  }
}

function makeStub(type) {
  return {
    sceneId: 'new-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    sceneType: type,
    content: '<p>New scene</p>',
    interactiveElement: {},
  }
}

function performDrop(insertAt) {
  if (dragMode === 'palette' && dragType) {
    const stub = makeStub(dragType)
    const at = Math.max(0, Math.min(insertAt, scenes.length))
    scenes.splice(at, 0, stub)
    selectedId = stub.sceneId
  } else if (dragMode === 'reorder' && dragFromIndex != null) {
    const from = dragFromIndex
    const [moved] = scenes.splice(from, 1)
    let at = from < insertAt ? insertAt - 1 : insertAt
    at = Math.max(0, Math.min(at, scenes.length))
    scenes.splice(at, 0, moved)
  }
  dragMode = null
  dragType = null
  dragFromIndex = null
  render()
}
