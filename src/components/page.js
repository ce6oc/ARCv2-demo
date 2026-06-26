// Tiny DOM utilities shared by pages.
export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel))
export const app = () => document.getElementById('app')
