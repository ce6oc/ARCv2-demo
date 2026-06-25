import { logo, button, card, esc } from '../components/ui.js'

const app = document.getElementById('app')

app.innerHTML =
  '<div class="min-h-screen bg-gradient-to-br from-brand-50 via-canvas to-pink-50 flex flex-col items-center justify-center px-4 py-10">' +
  '<div class="w-full max-w-sm">' +
  '<div class="flex justify-center mb-6">' + logo() + '</div>' +
  card(
    '<h1 class="text-2xl font-extrabold text-brand-700">Welcome back 👋</h1>' +
    '<p class="text-brand-400 mt-1">Sign in to your teacher account</p>' +
    '<div class="mt-6">' + field('Email', 'email', 'rivera@eduflow.app') + '</div>' +
    '<div class="mt-4">' + field('Password', 'password', '••••••••') + '</div>' +
    '<div class="mt-6">' +
    button('Sign in', { variant: 'primary', href: '/teacher-dashboard.html', cls: 'w-full justify-center' }) +
    '</div>' +
    '<div class="mt-4 text-center">' +
    button('New here? Create an account', { variant: 'ghost', href: '/teacher-dashboard.html' }) +
    '</div>' +
    '<p class="mt-4 text-center text-xs text-brand-300">Demo only — no real credentials needed.</p>'
  ) +
  '<div class="mt-6 text-center">' +
  button('← Back to home', { variant: 'ghost', href: '/' }) +
  '</div>' +
  '</div>' +
  '</div>'

function field(label, type, value) {
  return (
    '<label class="block text-xs font-bold uppercase tracking-wide text-brand-400 mb-1">' + esc(label) + '</label>' +
    '<input type="' + esc(type) + '" value="' + esc(value) + '" ' +
    'class="w-full px-4 py-2.5 rounded-pill border border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 text-brand-700 font-semibold bg-white" />'
  )
}
