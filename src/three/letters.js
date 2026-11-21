import * as THREE from 'three'

export const FONT = '"Fredoka Variable", "Fredoka", "Baloo 2", system-ui, sans-serif'
export const BRAND = { red: '#E63946', blue: '#2A9DF4', yellow: '#FFC93C' }
// BIZI: culorile din logo
export const LETTERS = [
  { ch: 'B', color: BRAND.red },
  { ch: 'I', color: BRAND.blue },
  { ch: 'Z', color: BRAND.yellow },
  { ch: 'I', color: BRAND.red },
]

const cache = new Map()

/** literă colorată, „pictată” pe față, cu o mică umbră interioară */
export function letterTexture(ch, color, size = 256) {
  const key = ch + color
  if (cache.has(key)) return cache.get(key)
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `700 ${size * 0.78}px ${FONT}`
  g.fillStyle = 'rgba(40,20,0,0.35)'
  g.fillText(ch, size / 2, size / 2 + size * 0.075)
  g.fillStyle = color
  g.fillText(ch, size / 2, size / 2 + size * 0.055)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  cache.set(key, t)
  return t
}

/**
 * Gravură laser pe o față: litera se „arde” de sus în jos (p = 0..1),
 * iar în dreptul liniei de scanare lumina e incandescentă.
 */
export function drawEngrave(canvas, ch, p) {
  const S = canvas.width
  const g = canvas.getContext('2d')
  g.clearRect(0, 0, S, S)
  if (p <= 0) return
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `700 ${S * 0.78}px ${FONT}`
  const y = p * S * 0.92 + S * 0.04
  const cy = S / 2 + S * 0.055

  // partea deja arsă (sub linie → deasupra liniei, mai întunecat)
  g.save()
  g.beginPath()
  g.rect(0, 0, S, y)
  g.clip()
  g.fillStyle = '#3d1f0b'
  g.fillText(ch, S / 2, cy)
  g.restore()

  if (p < 1) {
    // laser: banda luminoasă pe literă
    g.save()
    g.beginPath()
    g.rect(0, y - 7, S, 14)
    g.clip()
    g.shadowColor = '#ff7a1a'
    g.shadowBlur = 22
    g.fillStyle = '#fff1c2'
    g.fillText(ch, S / 2, cy)
    g.restore()
    // fir subțire de laser peste toată fața
    g.fillStyle = 'rgba(255,120,40,0.55)'
    g.fillRect(S * 0.1, y - 1, S * 0.8, 2)
  }
}
