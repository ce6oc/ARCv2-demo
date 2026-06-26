import { api } from '../data/api.js'
import { avatars } from '../data/mock.js'
import { logo, button, avatar, esc, card, link } from '../components/ui.js'

const params = new URLSearchParams(location.search)
const app = document.getElementById('app')

const state = {
  step: 1,
  code: params.get('code') || 'SPACE-2024-A',
  cls: null,
  error: '',
  nickname: params.get('name') || '',
  avatarId: params.get('avatar') || 'avatar_01',
}

app.innerHTML = hero(loading())
render()

function render() {
  app.innerHTML = hero(state.step === 1 ? stepOne() : stepTwo())
  if (state.step === 1) wireStepOne()
  else wireStepTwo()
}

function hero(inner) {
  return (
    '<div class="min-h-screen bg-gradient-to-br from-brand-50 via-white to-pink-50 flex flex-col items-center justify-center px-4 py-10">' +
    `<div class="mb-6">${logo()}</div>` +
    `<div class="w-full max-w-md">${inner}</div>` +
    '</div>'
  )
}

function loading() {
  return card('<div class="text-center text-brand-400 font-semibold py-8">Loading…</div>')
}

function stepOne() {
  const errHtml = state.error
    ? `<p id="code-error" class="mt-3 text-sm font-semibold text-accent-600 bg-pink-50 border border-pink-100 rounded-md px-3 py-2">${esc(state.error)}</p>`
    : ''
  return card(
    '<h1 class="text-2xl font-extrabold text-brand-700">Join your class</h1>' +
    '<p class="text-brand-400 mt-1">Enter the code your teacher gave you.</p>' +
    '<div class="mt-5">' +
    '<label class="block text-xs font-bold uppercase tracking-wide text-brand-400 mb-1">Class code</label>' +
    `<input id="code-input" type="text" maxlength="24" autocomplete="off" value="${esc(state.code)}" ` +
    'class="w-full text-2xl font-extrabold tracking-[0.2em] text-center uppercase px-4 py-3 rounded-card border border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 text-brand-700" />' +
    '</div>' +
    errHtml +
    '<div id="continue-wrap" class="mt-5">' +
    button('Continue →', { variant: 'primary', size: 'lg', cls: 'w-full justify-center' }) +
    '</div>'
  )
}

function stepTwo() {
  const name = state.cls ? state.cls.className : 'your class'
  return card(
    '<div class="text-3xl">🎉</div>' +
    `<h1 class="text-2xl font-extrabold text-brand-700 mt-1">You're joining <span class="text-accent-500">${esc(name)}</span></h1>` +
    '<p class="text-brand-400 mt-1">Pick a nickname and avatar to get started.</p>' +
    '<div class="mt-5">' +
    '<label class="block text-xs font-bold uppercase tracking-wide text-brand-400 mb-1">Your nickname</label>' +
    `<input id="nick-input" type="text" maxlength="20" autocomplete="off" placeholder="Pick a nickname" value="${esc(state.nickname)}" ` +
    'class="w-full px-4 py-2.5 rounded-pill border border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 text-brand-700 font-semibold" />' +
    '</div>' +
    '<div class="mt-5">' +
    '<label class="block text-xs font-bold uppercase tracking-wide text-brand-400 mb-2">Pick your avatar</label>' +
    `<div id="avatar-grid" class="grid grid-cols-4 gap-2">${avatarCells()}</div>` +
    '</div>' +
    '<div id="start-wrap" class="mt-6">' +
    button('Start learning 🚀', { variant: 'primary', size: 'lg', cls: 'w-full justify-center' }) +
    '</div>' +
    '<div class="mt-3 text-center">' +
    button('Just exploring? Try as guest', { variant: 'ghost', href: '/student-lessons.html?name=Guest&avatar=avatar_01' }) +
    '</div>'
  )
}

function avatarCells() {
  return avatars
    .map((id) => {
      const selected = id === state.avatarId
      const ring = selected
        ? 'ring-4 ring-brand-500 ring-offset-2'
        : 'ring-1 ring-brand-100 hover:ring-brand-300'
      return `<button type="button" data-avatar="${esc(id)}" class="p-1 rounded-card transition ${ring}">${avatar(id, { size: 'lg' })}</button>`
    })
    .join('')
}

function wireStepOne() {
  const input = document.getElementById('code-input')
  input.addEventListener('input', () => {
    const next = input.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    state.code = next
    if (input.value !== next) {
      const pos = Math.min(input.selectionStart ?? next.length, next.length)
      input.value = next
      input.setSelectionRange(pos, pos)
    }
  })
  const btn = document.querySelector('#continue-wrap button')
  if (btn) btn.addEventListener('click', handleContinue)
}

async function handleContinue() {
  const code = state.code.trim()
  if (!code) {
    state.error = 'Please enter a class code.'
    render()
    return
  }
  const btn = document.querySelector('#continue-wrap button')
  if (btn) {
    btn.disabled = true
    btn.textContent = 'Checking…'
  }
  const cls = await api.getClassByCode(code)
  if (cls) {
    state.cls = cls
    state.step = 2
    render()
  } else {
    state.error = "Hmm, we couldn't find that class. Any demo code works (try SPACE-2024-A)."
    render()
  }
}

function wireStepTwo() {
  const nick = document.getElementById('nick-input')
  const startBtn = document.querySelector('#start-wrap button')
  const syncStart = () => {
    state.nickname = nick.value
    if (!startBtn) return
    const has = nick.value.trim().length > 0
    startBtn.disabled = !has
    startBtn.classList.toggle('opacity-50', !has)
    startBtn.classList.toggle('cursor-not-allowed', !has)
  }
  syncStart()
  nick.addEventListener('input', syncStart)
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const name = nick.value.trim()
      if (!name) return
      location.href = link(`/student-lessons.html?name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(state.avatarId)}`)
    })
  }
  rewireGrid()
}

function rewireGrid() {
  Array.from(document.querySelectorAll('[data-avatar]')).forEach((c) => {
    c.addEventListener('click', () => {
      state.avatarId = c.dataset.avatar
      const g = document.getElementById('avatar-grid')
      if (g) g.innerHTML = avatarCells()
      rewireGrid()
    })
  })
}
