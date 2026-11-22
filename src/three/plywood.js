import * as THREE from 'three'

// zgomot neted, nerepetitiv (pentru texturi care nu trebuie să se repete)
function hash(ix, iy) {
  let h = (ix * 374761393 + iy * 668265263) | 0
  h = (h ^ (h >>> 13)) * 1274126177
  h = h ^ (h >>> 16)
  return (h >>> 0) / 4294967295
}
const smooth = (t) => t * t * (3 - 2 * t)
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = smooth(x - xi), yf = smooth(y - yi)
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
}

const LIGHT = [238, 219, 184]
const DARK = [205, 170, 122]

const birchCache = new Map()

/**
 * Placaj de mesteacăn (ca la jucăriile BiziJoc): deschis la culoare, fibră fină și dreaptă pe X.
 * Textura acoperă două scânduri (jumătatea de sus și cea de jos), deci fibra nu se repetă între ele.
 * w/h în unități de scenă: lățimea scândurii și înălțimea celor două scânduri la un loc.
 */
export function birchTextures(w = 3.9, h = 1.2, res = 1024) {
  const key = `${w}x${h}@${res}`
  if (birchCache.has(key)) return birchCache.get(key)
  const W = res
  const H = Math.round((W * h) / w)
  const albedo = new Uint8ClampedArray(W * H * 4)
  const height = new Float32Array(W * H)
  for (let j = 0; j < H; j++) {
    const v = (j / H) * h
    for (let i = 0; i < W; i++) {
      const u = (i / W) * w
      // ondulare lentă a fibrei
      const wave = noise(u * 0.7, v * 2.2) * 3.2 + noise(u * 0.18, v * 0.9 + 7) * 9
      // linii de creștere: subțiri, întunecate
      const s = 0.5 + 0.5 * Math.sin((v * 46 + wave) * Math.PI * 2)
      const line = Math.pow(s, 7)
      // dungi lungi, fine, pe direcția fibrei
      const streak = noise(u * 1.6, v * 170) * 0.65 + noise(u * 0.5, v * 60 + 3) * 0.35
      // pete foarte largi de culoare
      const tone = noise(u * 0.35 + 11, v * 0.8)
      let t = 0.32 * line + 0.42 * streak + 0.26 * tone
      t = Math.min(1, Math.max(0, (t - 0.22) * 1.55))
      const k = (j * W + i) * 4
      for (let c = 0; c < 3; c++) albedo[k + c] = LIGHT[c] + (DARK[c] - LIGHT[c]) * t
      albedo[k + 3] = 255
      height[j * W + i] = 0.55 * streak - 0.45 * line
    }
  }
  const normal = new Uint8ClampedArray(W * H * 4)
  const Hh = (x, y) => height[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))]
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = Hh(x + 1, y) - Hh(x - 1, y)
      const dy = Hh(x, y + 1) - Hh(x, y - 1)
      let nx = -dx * 1.6, ny = dy * 1.6, nz = 1
      const l = Math.hypot(nx, ny, nz)
      const k = (y * W + x) * 4
      normal[k] = (nx / l * 0.5 + 0.5) * 255
      normal[k + 1] = (ny / l * 0.5 + 0.5) * 255
      normal[k + 2] = (nz / l * 0.5 + 0.5) * 255
      normal[k + 3] = 255
    }
  }
  const mk = (data, srgb) => {
    const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat)
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
    t.generateMipmaps = true
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    t.anisotropy = 8
    t.needsUpdate = true
    return t
  }
  const out = { map: mk(albedo, true), normalMap: mk(normal, false) }
  birchCache.set(key, out)
  return out
}

// ── materiale pentru căsuță și jucării ──
export const HOUSE_WOOD = 2.6 // latura (în unități de scenă) acoperită de textura de mesteacăn a căsuței
const matCache = new Map()
const cached = (key, make) => {
  if (!matCache.has(key)) matCache.set(key, make())
  return matCache.get(key)
}

/** fața placajului; UV-urile sunt în unități de scenă (ca la ExtrudeGeometry), centrate pe x */
export function birchMaterial(scale = 1 / HOUSE_WOOD, offsetX = 0.5) {
  return cached(`birch${scale}:${offsetX}`, () => {
    const { map, normalMap } = birchTextures(HOUSE_WOOD, HOUSE_WOOD, 640)
    const m = new THREE.MeshStandardMaterial({ map: map.clone(), normalMap: normalMap.clone(), color: '#f7dfba', normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.74 })
    for (const t of [m.map, m.normalMap]) {
      t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping
      t.repeat.set(scale, scale)
      t.offset.set(offsetX, 0)
      t.needsUpdate = true
    }
    return m
  })
}

/** muchie tăiată cu laser: maro închis, mată */
export const burntMaterial = () => cached('burnt', () => new THREE.MeshStandardMaterial({ color: '#4a2d18', roughness: 0.9 }))

/** vopsea mată pe placaj (se simte vag fibra dedesubt) */
export function paintedMaterial(color, roughness = 0.62) {
  return cached(`paint${color}${roughness}`, () => {
    const normalMap = birchTextures(HOUSE_WOOD, HOUSE_WOOD, 640).normalMap.clone()
    normalMap.wrapS = normalMap.wrapT = THREE.MirroredRepeatWrapping
    normalMap.needsUpdate = true
    return new THREE.MeshStandardMaterial({ color, roughness, normalMap, normalScale: new THREE.Vector2(0.12, 0.12) })
  })
}

let edge = null
/** Muchia tăiată cu laser: arsă, maro închis, cu straturile placajului abia vizibile */
export function plyEdgeTextures() {
  if (edge) return edge
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 8
  const g = c.getContext('2d')
  const plies = 5
  for (let p = 0; p < plies; p++) {
    g.fillStyle = p % 2 ? '#3a2414' : '#55361f'
    g.fillRect((p * 64) / plies, 0, 64 / plies, 8)
  }
  g.fillStyle = 'rgba(20,10,4,0.45)'
  for (let p = 1; p < plies; p++) g.fillRect((p * 64) / plies - 0.5, 0, 1, 8)
  const side = new THREE.CanvasTexture(c)
  side.colorSpace = THREE.SRGBColorSpace
  const top = side.clone()
  top.center.set(0.5, 0.5)
  top.rotation = Math.PI / 2
  edge = { side, top }
  return edge
}
