// Scene renderers for EduFlow prototype.
// Contract: renderScene(scene, onSubmit, mountEl) — draws a scene into mountEl
// and calls onSubmit(payload) with payload shapes matching src/player/scoring.js.

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')

const yt = (videoId) => `https://www.youtube.com/embed/${videoId}`

function contentBlock(html) {
  return html ? `<div class="prose-ish text-brand-700 leading-relaxed mb-5">${html}</div>` : ''
}

function continueBtn() {
  return (
    '<button data-action="continue" ' +
    'class="bg-brand-500 text-white rounded-pill px-6 py-3 font-bold hover:bg-brand-600 transition-colors">' +
    'Continue →</button>'
  )
}

function submitBtn(label) {
  return (
    '<button data-action="submit" disabled ' +
    'class="bg-brand-500 text-white rounded-pill px-6 py-3 font-bold hover:bg-brand-600 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed transition-colors">' +
    `${esc(label)}</button>`
  )
}

// --- custom-interactive message listener lifecycle (no leak across renders) ---
let _messageHandler = null
function cleanupCustomListener() {
  if (_messageHandler) {
    window.removeEventListener('message', _messageHandler)
    _messageHandler = null
  }
}

function renderContent(scene, onSubmit, mountEl) {
  mountEl.innerHTML = contentBlock(scene.content) + continueBtn()
  mountEl.querySelector('[data-action="continue"]').addEventListener('click', () => onSubmit({}))
}

function renderVideo(scene, onSubmit, mountEl) {
  const ie = scene.interactiveElement || {}
  const videoId = ie.videoId ?? scene.videoId ?? ''
  mountEl.innerHTML =
    contentBlock(scene.content) +
    `<div class="relative w-full mb-5" style="aspect-ratio:16/9">` +
    `<iframe data-video class="absolute inset-0 w-full h-full rounded-card border border-brand-200" ` +
    `src="${yt(escAttr(videoId))}" title="Lesson video" allowfullscreen loading="lazy"></iframe></div>` +
    continueBtn()
  mountEl.querySelector('[data-action="continue"]').addEventListener('click', () =>
    onSubmit({ watchedPercentage: 100 })
  )
}

function renderQuiz(scene, onSubmit, mountEl) {
  const ie = scene.interactiveElement || {}
  const options = ie.options || []
  const enableConfidence = !!ie.enableConfidenceRating
  const state = { selected: null, confidence: enableConfidence ? 3 : undefined }

  const confHtml = enableConfidence
    ? `<div data-conf-wrap class="mb-4 opacity-40 pointer-events-none transition-opacity">` +
      `<p class="text-sm text-brand-600 mb-2">How sure are you?</p>` +
      `<div class="flex gap-2">` +
      [1, 2, 3, 4, 5]
        .map(
          (n) =>
            `<button data-confidence="${n}" type="button" ` +
            `class="w-9 h-9 rounded-pill border ${n === 3 ? 'bg-brand-500 text-white border-brand-500' : 'border-brand-300 hover:bg-brand-100 text-brand-700'}">${n}</button>`
        )
        .join('') +
      `</div></div>`
    : ''

  mountEl.innerHTML =
    contentBlock(scene.content) +
    `<h3 class="text-lg font-bold text-brand-700 mb-3">${esc(ie.question || '')}</h3>` +
    `<div data-options class="space-y-2 mb-4"></div>` +
    confHtml +
    submitBtn('Check answer')

  const optionsEl = mountEl.querySelector('[data-options]')
  const confWrap = mountEl.querySelector('[data-conf-wrap]')
  const submitEl = mountEl.querySelector('[data-action="submit"]')

  function paintOptions() {
    optionsEl.innerHTML = options
      .map((o) => {
        const on = state.selected === o.optionId
        return (
          `<div data-option="${escAttr(o.optionId)}" role="button" tabindex="0" ` +
          `class="border rounded-card p-4 cursor-pointer transition-colors ` +
          `${on ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-200' : 'border-brand-200 hover:border-brand-400'}">` +
          `${esc(o.text)}</div>`
        )
      })
      .join('')
    optionsEl.querySelectorAll('[data-option]').forEach((el) => {
      el.addEventListener('click', () => {
        state.selected = el.getAttribute('data-option')
        paintOptions()
        submitEl.disabled = false
        if (confWrap) confWrap.classList.remove('opacity-40', 'pointer-events-none')
      })
    })
  }
  paintOptions()

  function paintConfidence() {
    mountEl.querySelectorAll('[data-confidence]').forEach((el) => {
      const n = Number(el.getAttribute('data-confidence'))
      const on = n === state.confidence
      el.className =
        'w-9 h-9 rounded-pill border ' +
        (on ? 'bg-brand-500 text-white border-brand-500' : 'border-brand-300 hover:bg-brand-100 text-brand-700')
    })
  }
  if (enableConfidence) {
    mountEl.querySelectorAll('[data-confidence]').forEach((el) => {
      el.addEventListener('click', () => {
        state.confidence = Number(el.getAttribute('data-confidence'))
        paintConfidence()
      })
    })
  }

  submitEl.addEventListener('click', () =>
    onSubmit({ response: state.selected, confidence: state.confidence })
  )
}

function renderCategorize(scene, onSubmit, mountEl) {
  const ie = scene.interactiveElement || {}
  const categories = ie.categories || []
  const items = ie.items || []
  const state = { assignments: {}, selectedItem: null }

  mountEl.innerHTML = contentBlock(scene.content)
  const region = document.createElement('div')
  mountEl.appendChild(region)

  const chip = (it) => {
    const selected = state.selectedItem === it.itemId
    const assigned = state.assignments[it.itemId] != null
    const cls = selected
      ? 'bg-brand-100 border-brand-500 ring-2 ring-brand-300 text-brand-700'
      : 'bg-white border-brand-300 text-brand-700 hover:bg-brand-100'
    return (
      `<button type="button" data-item="${escAttr(it.itemId)}" ` +
      `class="px-3 py-1.5 rounded-pill border transition-colors ${cls}">` +
      `${esc(it.text)}${assigned ? ' ✓' : ''}</button>`
    )
  }

  function paint() {
    const cols = categories
      .map((cat) => {
        const here = items.filter((it) => state.assignments[it.itemId] === cat)
        return (
          `<div data-category="${escAttr(cat)}" ` +
          `class="flex-1 min-w-[140px] rounded-card border-2 border-dashed border-brand-300 p-3 cursor-pointer hover:border-brand-500 transition-colors">` +
          `<p class="font-bold text-brand-700 mb-2 text-center">${esc(cat)}</p>` +
          `<div class="flex flex-col gap-2 items-start">${here.map(chip).join('')}</div></div>`
        )
      })
      .join('')
    const unassigned = items.filter((it) => state.assignments[it.itemId] == null)
    const tray = unassigned.length
      ? unassigned.map(chip).join('')
      : '<span class="text-sm text-brand-400">All sorted! 🎉</span>'
    const allDone = items.every((it) => state.assignments[it.itemId] != null)

    region.innerHTML =
      `<p class="text-sm text-brand-400 mb-3">Tap a word, then tap a category.</p>` +
      `<div class="flex flex-wrap gap-3 mb-4">${cols}</div>` +
      `<div class="flex flex-wrap gap-2 mb-4 p-3 rounded-card bg-brand-50 min-h-[3rem]">${tray}</div>` +
      submitBtn('Submit')

    region.querySelectorAll('[data-item]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        const id = el.getAttribute('data-item')
        state.selectedItem = state.selectedItem === id ? null : id
        paint()
      })
    })
    region.querySelectorAll('[data-category]').forEach((el) => {
      el.addEventListener('click', () => {
        if (!state.selectedItem) return
        state.assignments[state.selectedItem] = el.getAttribute('data-category')
        state.selectedItem = null
        paint()
      })
    })
    const btn = region.querySelector('[data-action="submit"]')
    btn.disabled = !allDone
    btn.addEventListener('click', () =>
      onSubmit({ submittedCategorization: { ...state.assignments } })
    )
  }
  paint()
}

function renderMatch(scene, onSubmit, mountEl) {
  const ie = scene.interactiveElement || {}
  const pairs = ie.pairs || []
  const matches = ie.matches || []
  const state = { mapping: {}, selectedPair: null }

  mountEl.innerHTML = contentBlock(scene.content)
  const region = document.createElement('div')
  mountEl.appendChild(region)

  function paint() {
    const usedMatches = Object.values(state.mapping)
    const left = pairs
      .map((p) => {
        const linkedId = state.mapping[p.itemId]
        const linkedText = linkedId
          ? (matches.find((m) => m.matchId === linkedId) || {}).text
          : null
        const sel = state.selectedPair === p.itemId
        return (
          `<button type="button" data-pair="${escAttr(p.itemId)}" ` +
          `class="block w-full text-left p-3 rounded-card border mb-2 transition-colors ` +
          `${sel ? 'border-brand-500 ring-2 ring-brand-200 bg-brand-50' : 'border-brand-200 hover:border-brand-400'}">` +
          `<span class="font-medium text-brand-700">${esc(p.text)}</span>` +
          (linkedText ? `<span class="block text-sm text-brand-500 mt-1">→ ${esc(linkedText)}</span>` : '') +
          `</button>`
        )
      })
      .join('')
    const right = matches
      .map((m) => {
        const used = usedMatches.includes(m.matchId)
        return (
          `<button type="button" data-match="${escAttr(m.matchId)}" ${used ? 'disabled' : ''} ` +
          `class="block w-full text-left p-3 rounded-card border mb-2 transition-colors ` +
          `${used ? 'border-brand-100 opacity-50 cursor-not-allowed' : 'border-brand-200 hover:border-brand-400'}">` +
          `<span class="text-brand-700">${esc(m.text)}</span></button>`
        )
      })
      .join('')
    const allDone = pairs.every((p) => state.mapping[p.itemId] != null)

    region.innerHTML =
      `<p class="text-sm text-brand-400 mb-3">Tap an item on the left, then tap its match on the right.</p>` +
      `<div class="grid grid-cols-2 gap-4 mb-4"><div>${left}</div><div>${right}</div></div>` +
      submitBtn('Submit')

    region.querySelectorAll('[data-pair]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-pair')
        state.selectedPair = state.selectedPair === id ? null : id
        paint()
      })
    })
    region.querySelectorAll('[data-match]').forEach((el) => {
      el.addEventListener('click', () => {
        if (!state.selectedPair || el.disabled) return
        state.mapping[state.selectedPair] = el.getAttribute('data-match')
        state.selectedPair = null
        paint()
      })
    })
    const btn = region.querySelector('[data-action="submit"]')
    btn.disabled = !allDone
    btn.addEventListener('click', () => onSubmit({ submittedMapping: { ...state.mapping } }))
  }
  paint()
}

function renderOpenText(scene, onSubmit, mountEl) {
  const ie = scene.interactiveElement || {}
  const keywords = ie.suggestedKeywords || []

  mountEl.innerHTML =
    contentBlock(scene.content) +
    `<h3 class="text-lg font-bold text-brand-700 mb-3">${esc(ie.question || '')}</h3>` +
    `<textarea data-action="text" rows="4" placeholder="Type your answer..." ` +
    `class="w-full rounded-card border border-brand-200 p-3 text-brand-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 mb-3"></textarea>` +
    `<div data-keywords class="flex flex-wrap gap-2 mb-4">` +
    keywords
      .map(
        (k) =>
          `<span data-keyword="${escAttr(k)}" ` +
          `class="px-3 py-1 rounded-pill border border-brand-300 text-brand-600 text-sm">${esc(k)}</span>`
      )
      .join('') +
    `</div>` +
    `<button data-action="submit" ` +
    `class="bg-brand-500 text-white rounded-pill px-6 py-3 font-bold hover:bg-brand-600 transition-colors">Submit</button>`

  const ta = mountEl.querySelector('[data-action="text"]')
  const kwEls = mountEl.querySelectorAll('[data-keyword]')

  function paintKeywords() {
    const lower = (ta.value || '').toLowerCase()
    kwEls.forEach((el) => {
      const k = el.getAttribute('data-keyword')
      const found = lower.includes(k.toLowerCase())
      el.className =
        'px-3 py-1 rounded-pill border text-sm ' +
        (found ? 'bg-brand-500 text-white border-brand-500' : 'border-brand-300 text-brand-600')
    })
  }
  ta.addEventListener('input', paintKeywords)
  mountEl.querySelector('[data-action="submit"]').addEventListener('click', () =>
    onSubmit({ response: ta.value })
  )
}

function renderAudio(scene, onSubmit, mountEl) {
  const ie = scene.interactiveElement || {}
  let timerId = null
  let elapsed = 0

  const bars = Array.from(
    { length: 7 },
    (_, i) =>
      `<span class="w-1.5 rounded-pill bg-brand-400 animate-pulse" style="height:${30 + ((i * 13) % 50)}%"></span>`
  ).join('')

  mountEl.innerHTML =
    contentBlock(scene.content) +
    (ie.question ? `<h3 class="text-lg font-bold text-brand-700 mb-4">${esc(ie.question)}</h3>` : '') +
    `<div class="flex flex-col items-center gap-4 mb-5">` +
    `<button data-action="record" type="button" aria-label="Record audio response" ` +
    `class="w-24 h-24 rounded-full bg-brand-500 text-white text-3xl hover:bg-brand-600 transition-colors shadow-lg">🎤</button>` +
    `<div data-timer class="text-brand-600 font-mono">0s</div>` +
    `<div data-waveform class="hidden items-end gap-1 h-10 w-28 justify-center">${bars}</div>` +
    `<p data-status class="text-brand-500 text-sm h-5"></p>` +
    `</div>` +
    continueBtn()

  const timerEl = mountEl.querySelector('[data-timer]')
  const waveEl = mountEl.querySelector('[data-waveform]')
  const statusEl = mountEl.querySelector('[data-status]')

  mountEl.querySelector('[data-action="record"]').addEventListener('click', () => {
    if (timerId) return
    waveEl.classList.remove('hidden')
    waveEl.classList.add('flex')
    statusEl.textContent = 'Recording...'
    timerId = setInterval(() => {
      if (!mountEl.isConnected) {
        clearInterval(timerId)
        return
      }
      elapsed += 1
      timerEl.textContent = `${elapsed}s`
      if (elapsed >= 12) {
        clearInterval(timerId)
        timerId = null
        waveEl.classList.add('hidden')
        waveEl.classList.remove('flex')
        statusEl.textContent = 'Recorded ✓'
      }
    }, 1000)
  })

  mountEl.querySelector('[data-action="continue"]').addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
    onSubmit({ audioUrl: 'mock://recording.mp3', durationSeconds: 12 })
  })
}

function renderCustom(scene, onSubmit, mountEl) {
  const ie = scene.interactiveElement || {}
  const embedUrl = ie.embedUrl || ''
  let done = false

  mountEl.innerHTML =
    contentBlock(scene.content) +
    `<iframe src="${escAttr(embedUrl)}" class="w-full h-80 rounded-card border border-brand-200" loading="lazy"></iframe>` +
    `<div class="mt-4">${continueBtn()}</div>`

  const finish = (payload) => {
    if (done) return
    done = true
    onSubmit(payload)
  }

  const handler = (event) => {
    const data = event && event.data
    if (data && data.type === 'EDUFLOW_COMPLETE') finish(data.data)
  }
  _messageHandler = handler
  window.addEventListener('message', handler)

  mountEl.querySelector('[data-action="continue"]').addEventListener('click', () =>
    finish({ data: { score: 0 } })
  )
}

const RENDERERS = {
  content: renderContent,
  video: renderVideo,
  'multiple-choice-quiz': renderQuiz,
  'categorize-items': renderCategorize,
  'match-pairs': renderMatch,
  'open-text-question': renderOpenText,
  'audio-response': renderAudio,
  'custom-interactive': renderCustom,
}

export function renderScene(scene, onSubmit, mountEl) {
  cleanupCustomListener()
  const type = scene && scene.sceneType
  mountEl.className = `scene scene-${type || 'unknown'}`
  const fn = RENDERERS[type] || renderContent
  fn(scene, onSubmit, mountEl)
}
