import * as THREE from 'three'

export const FONT = '"Fredoka Variable", "Fredoka", "Baloo 2", system-ui, sans-serif'
// culorile formelor din logo-ul BiziJoc
export const BRAND = { red: '#EE4747', blue: '#5FC3E8', yellow: '#F2D64B', green: '#A9D05F' }
export const LETTERS = [
  { ch: 'B', color: BRAND.blue },
  { ch: 'I', color: BRAND.green },
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
