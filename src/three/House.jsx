import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { blobShadowTexture } from './wood'
import { birchMaterial, burntMaterial, paintedMaterial, birchTextures, HOUSE_WOOD } from './plywood'
import { BRAND, LETTERS, letterTexture } from './letters'

// ── dimensiuni căsuță (unități de scenă) ──
export const W = 2.4 // lățime (x)
export const D = 2.0 // adâncime (z)
export const WALL_H = 1.4
export const PEAK = 0.85 // înălțimea frontonului peste pereți
const T = 0.09 // grosimea placajului
const E = 0.002 // distanța minimă între piese lipite, ca fețele să nu se bată între ele (z-fighting)

// semnul „BIZI” de deasupra acoperișului
export const SIGN_Y = WALL_H + PEAK + 0.62
export const SIGN_S = 0.5
export const SIGN_GAP = 0.06

// placaj tăiat cu laser: muchii drepte, fără teșire
const cut = (shape, depth = T) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 20 })

function arch(w, h) {
  const p = new THREE.Shape()
  p.moveTo(-w, 0)
  p.lineTo(w, 0)
  p.lineTo(w, h)
  p.absarc(0, h, w, 0, Math.PI, false)
  p.lineTo(-w, 0)
  return p
}
const archHole = (w, h) => new THREE.Path(arch(w, h).getPoints(40).reverse())

function gableShape() {
  const s = new THREE.Shape()
  s.moveTo(-W / 2, 0)
  s.lineTo(W / 2, 0)
  s.lineTo(W / 2, WALL_H)
  s.lineTo(0, WALL_H + PEAK)
  s.lineTo(-W / 2, WALL_H)
  s.lineTo(-W / 2, 0)
  return s
}
function ring(outerR, innerR) {
  const s = new THREE.Shape()
  s.absarc(0, 0, outerR, 0, Math.PI * 2, false)
  s.holes.push(new THREE.Path().absarc(0, 0, innerR, 0, Math.PI * 2, true))
  return s
}
function rectRing(ow, oh, iw, ih) {
  const s = new THREE.Shape()
  s.moveTo(-ow / 2, -oh / 2); s.lineTo(ow / 2, -oh / 2); s.lineTo(ow / 2, oh / 2); s.lineTo(-ow / 2, oh / 2); s.lineTo(-ow / 2, -oh / 2)
  const h = new THREE.Path()
  h.moveTo(-iw / 2, -ih / 2); h.lineTo(-iw / 2, ih / 2); h.lineTo(iw / 2, ih / 2); h.lineTo(iw / 2, -ih / 2); h.lineTo(-iw / 2, -ih / 2)
  s.holes.push(h)
  return s
}
function polygon(n, r, rot = -Math.PI / 2) {
  const s = new THREE.Shape()
  for (let i = 0; i <= n; i++) {
    const a = rot + (i * Math.PI * 2) / n
    i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  return s
}
function star(R, r) {
  const s = new THREE.Shape()
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const k = i % 2 ? r : R
    i ? s.lineTo(Math.cos(a) * k, Math.sin(a) * k) : s.moveTo(Math.cos(a) * k, Math.sin(a) * k)
  }
  return s
}

const DOOR_W = 0.34, DOOR_H = 0.66

/** Toate piesele căsuței; fiecare piesă de placaj are fața din mesteacăn și muchia arsă. */
function buildPieces() {
  const ply = [birchMaterial(), burntMaterial()]
  const paint = (c) => [paintedMaterial(c), burntMaterial()]

  const front = gableShape()
  front.holes.push(archHole(DOOR_W, DOOR_H))
  front.holes.push(new THREE.Path().absarc(0, WALL_H + 0.3, 0.16, 0, Math.PI * 2, true))

  // pereții laterali stau între fațadă și spate (nu se suprapun cu ele)
  const sd = D / 2 - T
  const side = new THREE.Shape()
  side.moveTo(-sd, 0); side.lineTo(sd, 0); side.lineTo(sd, WALL_H); side.lineTo(-sd, WALL_H); side.lineTo(-sd, 0)
  const win = new THREE.Path()
  win.moveTo(-0.25, 0.62); win.lineTo(-0.25, 1.1); win.lineTo(0.25, 1.1); win.lineTo(0.25, 0.62); win.lineTo(-0.25, 0.62)
  side.holes.push(win)

  const slope = Math.atan2(PEAK, W / 2)
  const slopeLen = Math.hypot(W / 2, PEAK) + 0.16
  const nrm = new THREE.Vector2(Math.sin(slope), Math.cos(slope))
  const roofCx = W / 4 + 0.03, roofCy = WALL_H + PEAK / 2 - 0.02
  const RT = 0.07
  const roofGeo = new THREE.BoxGeometry(slopeLen, RT, D + 0.3)

  const frameSq = cut(rectRing(0.62, 0.62, 0.5, 0.48), 0.035)
  const doorFrame = arch(DOOR_W + 0.09, DOOR_H)
  doorFrame.holes.push(archHole(DOOR_W + 0.005, DOOR_H))

  // decor pe fațadă: formele din logo, decupate și vopsite
  const deco = 0.035
  return [
    { key: 'floor', geo: new THREE.BoxGeometry(W + 0.3, 0.08, D + 0.3), mat: [burntMaterial(), burntMaterial(), birchMaterial(1, 0), burntMaterial(), burntMaterial(), burntMaterial()], pos: [0, -0.04, 0] },
    { key: 'back', geo: cut(gableShape()), mat: ply, pos: [0, 0, -D / 2] },
    { key: 'left', geo: cut(side), mat: ply, pos: [-W / 2 + T, 0, 0], rot: [0, -Math.PI / 2, 0] },
    { key: 'right', geo: cut(side), mat: ply, pos: [W / 2 - T, 0, 0], rot: [0, Math.PI / 2, 0] },
    { key: 'front', geo: cut(front), mat: ply, pos: [0, 0, D / 2 - T] },
    { key: 'winL', geo: frameSq, mat: paint(BRAND.blue), pos: [-W / 2 - E, 0.86, 0], rot: [0, -Math.PI / 2, 0] },
    { key: 'winR', geo: frameSq, mat: paint(BRAND.yellow), pos: [W / 2 + E, 0.86, 0], rot: [0, Math.PI / 2, 0] },
    { key: 'doorFrame', geo: cut(doorFrame, 0.035), mat: paint(BRAND.blue), pos: [0, 0, D / 2 + E] },
    { key: 'oculus', geo: cut(ring(0.24, 0.165), 0.035), mat: paint(BRAND.yellow), pos: [0, WALL_H + 0.3, D / 2 + E] },
    { key: 'tri', geo: cut(polygon(3, 0.15), deco), mat: paint(BRAND.green), pos: [-0.78, 1.05, D / 2 + E] },
    { key: 'star', geo: cut(star(0.15, 0.065), deco), mat: paint(BRAND.yellow), pos: [-0.78, 0.55, D / 2 + E] },
    { key: 'pent', geo: cut(polygon(5, 0.14), deco), mat: paint(BRAND.blue), pos: [0.78, 1.05, D / 2 + E] },
    { key: 'dot', geo: cut(polygon(40, 0.13), deco), mat: paint(BRAND.red), pos: [0.78, 0.55, D / 2 + E] },
    { key: 'roofL', geo: roofGeo, mat: paintedMaterial('#d9483f', 0.58), pos: [-roofCx - nrm.x * (RT / 2 + E), roofCy + nrm.y * (RT / 2 + E), 0], rot: [0, 0, slope] },
    { key: 'roofR', geo: roofGeo, mat: paintedMaterial('#d9483f', 0.58), pos: [roofCx + nrm.x * (RT / 2 + E), roofCy + nrm.y * (RT / 2 + E), 0], rot: [0, 0, -slope] },
    { key: 'chimney', geo: new THREE.BoxGeometry(0.24, 0.7, 0.24), mat: paintedMaterial(BRAND.blue), pos: [0.62, WALL_H + 0.42, -0.4] },
  ]
}

let piecesCache
const getPieces = () => (piecesCache ??= buildPieces())

/** ușa: vopsită, întredeschisă pe balamale, cu mâner metalic */
function Door() {
  const geo = useMemo(() => cut(arch(DOOR_W - 0.01, DOOR_H - 0.01), 0.04), [])
  const mat = useMemo(() => [paintedMaterial(BRAND.blue), burntMaterial()], [])
  return (
    <group position={[-DOOR_W, 0.005, D / 2 + E]} rotation={[0, -1.05, 0]}>
      <mesh geometry={geo} material={mat} position={[DOOR_W, 0, 0]} />
      <mesh position={[2 * DOOR_W - 0.09, 0.42, 0.06]}>
        <sphereGeometry args={[0.035, 16, 12]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function Shadow({ size = 4, opacity = 0.9, position = [0, 0.005, 0], ref }) {
  const tex = useMemo(() => blobShadowTexture(), [])
  return (
    <mesh ref={ref} position={position} rotation-x={-Math.PI / 2} renderOrder={-1}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

export function Lights({ interior = true }) {
  return (
    <>
      <ambientLight intensity={0.55} color="#fff2dc" />
      <hemisphereLight args={['#fff6e6', '#c99b62', 0.7]} />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#ffe3bd" />
      <directionalLight position={[-5, 2.5, 3]} intensity={0.7} color="#d6e8ff" />
      {interior && <pointLight position={[0, 1.0, -0.1]} intensity={3.2} distance={4} decay={1.6} color="#ffb860" />}
    </>
  )
}

/** Cub de mesteacăn cu literă pictată (pentru semnul BIZI) */
function LetterCube({ letter, color, size = 1, ...props }) {
  const mat = useMemo(() => {
    const { map, normalMap } = birchTextures(HOUSE_WOOD, HOUSE_WOOD, 640)
    const m = new THREE.MeshStandardMaterial({ map: map.clone(), normalMap: normalMap.clone(), normalScale: new THREE.Vector2(0.3, 0.3), roughness: 0.72 })
    for (const t of [m.map, m.normalMap]) {
      t.repeat.set(0.3, 0.3)
      t.needsUpdate = true
    }
    return m
  }, [])
  const tex = useMemo(() => letterTexture(letter, color), [letter, color])
  return (
    <group {...props}>
      <RoundedBox args={[size, size, size]} radius={size * 0.06} smoothness={3} material={mat} />
      <mesh position={[0, 0, size / 2 + 0.004]}>
        <planeGeometry args={[size * 0.86, size * 0.86]} />
        <meshStandardMaterial map={tex} transparent roughness={0.6} polygonOffset polygonOffsetFactor={-4} />
      </mesh>
    </group>
  )
}

/** Semnul BIZI: 4 cuburi mici, deasupra acoperișului */
export function Sign(props) {
  const step = 1 + SIGN_GAP
  return (
    <group position={[0, SIGN_Y, 0]} scale={SIGN_S} {...props}>
      {LETTERS.map((l, i) => (
        <LetterCube key={i} letter={l.ch} color={l.color} position={[(i - 1.5) * step, 0, 0]} />
      ))}
    </group>
  )
}

export function House({ shadow = true, ...props }) {
  const pieces = getPieces()
  return (
    <group {...props}>
      {pieces.map((p) => (
        <mesh key={p.key} geometry={p.geo} material={p.mat} position={p.pos} rotation={p.rot ?? [0, 0, 0]} />
      ))}
      <Door />
      {shadow && <Shadow size={5.2} position={[0, 0.003, 0]} />}
    </group>
  )
}
