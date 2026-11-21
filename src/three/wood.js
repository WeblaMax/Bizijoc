import * as THREE from 'three'

// ── Zgomot periodic (tileable) ca textura să se repete fără cusătură ──
function hash(ix, iy) {
  let h = (ix * 374761393 + iy * 668265263) | 0
  h = (h ^ (h >>> 13)) * 1274126177
  h = h ^ (h >>> 16)
  return (h >>> 0) / 4294967295
}
const smooth = (t) => t * t * (3 - 2 * t)
function vnoise(x, y, px, py) {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = smooth(x - xi), yf = smooth(y - yi)
  const x0 = ((xi % px) + px) % px, x1 = (x0 + 1) % px
  const y0 = ((yi % py) + py) % py, y1 = (y0 + 1) % py
  const a = hash(x0, y0), b = hash(x1, y0), c = hash(x0, y1), d = hash(x1, y1)
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
}
function fbm(u, v, fx, fy, oct = 3) {
  let s = 0, amp = 0.5, tot = 0
  for (let o = 0; o < oct; o++) {
    const k = 1 << o
    s += amp * vnoise(u * fx * k, v * fy * k, fx * k, fy * k)
    tot += amp
    amp *= 0.5
  }
  return s / tot
}

const LIGHT = [240, 208, 150]
const DARK = [190, 134, 78]

let cache = null

/**
 * Textură de lemn (albedo + normal map) generată procedural, o singură dată.
 * Fibra e întinsă pe axa X, cu inele și pori fini.
 */
export function getWood(size = 512) {
  if (cache) return cache
  const N = size
  const albedo = new Uint8ClampedArray(N * N * 4)
  const h = new Float32Array(N * N)

  for (let j = 0; j < N; j++) {
    const v = j / N
    for (let i = 0; i < N; i++) {
      const u = i / N
      const warp = fbm(u, v, 2, 3, 3)
      const ring = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (v * 5 + warp * 2.2))
      const fine = fbm(u, v, 3, 64, 3)
      const pores = fbm(u, v, 24, 160, 2)
      let t = 0.52 * ring + 0.48 * fine
      t = Math.min(1, Math.max(0, (t - 0.18) * 1.3))
      const pore = pores < 0.3 ? (0.3 - pores) * 1.6 : 0
      const k = (j * N + i) * 4
      for (let c = 0; c < 3; c++) {
        const base = LIGHT[c] + (DARK[c] - LIGHT[c]) * t
        albedo[k + c] = base * (1 - pore * 0.55)
      }
      albedo[k + 3] = 255
      h[j * N + i] = 0.6 * fine + 0.25 * ring - pore * 0.9
    }
  }

  // normal map din height (Sobel, cu înfășurare)
  const normal = new Uint8ClampedArray(N * N * 4)
  const strength = 2.4
  const H = (x, y) => h[((y + N) % N) * N + ((x + N) % N)]
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const dx = (H(x + 1, y - 1) + 2 * H(x + 1, y) + H(x + 1, y + 1)) - (H(x - 1, y - 1) + 2 * H(x - 1, y) + H(x - 1, y + 1))
      const dy = (H(x - 1, y + 1) + 2 * H(x, y + 1) + H(x + 1, y + 1)) - (H(x - 1, y - 1) + 2 * H(x, y - 1) + H(x + 1, y - 1))
      let nx = -dx * strength, ny = dy * strength, nz = 1
      const l = Math.hypot(nx, ny, nz)
      nx /= l; ny /= l; nz /= l
      const k = (y * N + x) * 4
      normal[k] = (nx * 0.5 + 0.5) * 255
      normal[k + 1] = (ny * 0.5 + 0.5) * 255
      normal[k + 2] = (nz * 0.5 + 0.5) * 255
      normal[k + 3] = 255
    }
  }

  const mk = (data, srgb) => {
    const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
    t.generateMipmaps = true
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    t.anisotropy = 4
    t.needsUpdate = true
    return t
  }
  cache = { map: mk(albedo, true), normalMap: mk(normal, false) }
  return cache
}

const matCache = new Map()
/** Material PBR de lemn, cu nuanță opțională (multiplică albedo-ul) */
export function woodMaterial(tint = '#ffffff', opts = {}) {
  const key = tint + JSON.stringify(opts)
  if (matCache.has(key)) return matCache.get(key)
  const { map, normalMap } = getWood()
  const m = new THREE.MeshStandardMaterial({
    map,
    normalMap,
    normalScale: new THREE.Vector2(0.7, 0.7),
    color: new THREE.Color(tint),
    roughness: 0.68,
    metalness: 0,
    ...opts,
  })
  matCache.set(key, m)
  return m
}

/** Material vopsit (roșu/albastru/galben…) – păstrează vag fibra lemnului dedesubt */
export function paintMaterial(color, opts = {}) {
  const { normalMap } = getWood()
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    normalMap,
    normalScale: new THREE.Vector2(0.25, 0.25),
    roughness: 0.55,
    metalness: 0,
    ...opts,
  })
}

/** Umbră moale (blob) – ieftină, fără shadow map, bună pe mobil */
let blobTex
export function blobShadowTexture() {
  if (blobTex) return blobTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62)
  grd.addColorStop(0, 'rgba(60,35,10,0.55)')
  grd.addColorStop(0.6, 'rgba(60,35,10,0.18)')
  grd.addColorStop(1, 'rgba(60,35,10,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  blobTex = new THREE.CanvasTexture(c)
  blobTex.colorSpace = THREE.SRGBColorSpace
  return blobTex
}
