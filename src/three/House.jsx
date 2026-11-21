import { useMemo, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { woodMaterial, paintMaterial, blobShadowTexture } from './wood'
import { BRAND, LETTERS, letterTexture } from './letters'

// ── dimensiuni căsuță (unități de scenă) ──
export const W = 2.4 // lățime (x)
export const D = 2.0 // adâncime (z)
export const WALL_H = 1.4
export const PEAK = 0.85 // înălțimea frontonului peste pereți
const T = 0.1 // grosime perete

// semnul „BIZI” de deasupra acoperișului
export const SIGN_Y = WALL_H + PEAK + 0.62
export const SIGN_S = 0.5
export const SIGN_GAP = 0.06

function scaleUV(geo, s) {
  const uv = geo.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * s, uv.getY(i) * s)
  return geo
}
const extrude = (shape, depth, bevel = 0.012) =>
  scaleUV(
    new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 2,
      curveSegments: 14,
    }),
    0.5,
  )

function doorPath(w = 0.35, h = 0.7) {
  const p = new THREE.Path()
  p.moveTo(-w, 0)
  p.lineTo(w, 0)
  p.lineTo(w, h)
  p.absarc(0, h, w, 0, Math.PI, false)
  p.lineTo(-w, 0)
  return p
}
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
function ringShape(outerR, innerR) {
  const s = new THREE.Shape()
  s.absarc(0, 0, outerR, 0, Math.PI * 2, false)
  const h = new THREE.Path()
  h.absarc(0, 0, innerR, 0, Math.PI * 2, true)
  s.holes.push(h)
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

/** Definește toate piesele căsuței. Ordinea = ordinea de asamblare din intro. */
function buildPieces() {
  const wood = woodMaterial('#ffffff')
  const woodWarm = woodMaterial('#f3c488')
  const floorWood = woodMaterial('#b9855a')
  const red = paintMaterial(BRAND.red)
  const blue = paintMaterial(BRAND.blue)
  const yellow = paintMaterial(BRAND.yellow)

  // fațadă: fronton cu ușă arcuită și ochi-de-bou
  const front = gableShape()
  const door = doorPath(0.36, 0.68)
  front.holes.push(door)
  const oculus = new THREE.Path()
  oculus.absarc(0, WALL_H + 0.28, 0.17, 0, Math.PI * 2, true)
  front.holes.push(oculus)

  const back = gableShape()

  const side = new THREE.Shape()
  side.moveTo(-D / 2, 0); side.lineTo(D / 2, 0); side.lineTo(D / 2, WALL_H); side.lineTo(-D / 2, WALL_H); side.lineTo(-D / 2, 0)
  const win = new THREE.Path()
  win.moveTo(-0.26, 0.62); win.lineTo(-0.26, 1.12); win.lineTo(0.26, 1.12); win.lineTo(0.26, 0.62); win.lineTo(-0.26, 0.62)
  side.holes.push(win)

  const slope = Math.atan2(PEAK, W / 2)
  const slopeLen = Math.hypot(W / 2, PEAK) + 0.2
  const nrm = new THREE.Vector2(Math.sin(slope), Math.cos(slope)) // normala pantei dreapta
  const roofCx = W / 4, roofCy = WALL_H + PEAK / 2
  const roofGeo = scaleUV(new THREE.BoxGeometry(slopeLen, 0.1, D + 0.34), 1)

  // ringuri ferestre (rama colorată), pe peretele lateral → coordonate locale (z,y)
  const winFrame = extrude(rectRing(0.66, 0.66, 0.5, 0.5), 0.05, 0.006)

  return [
    { key: 'floor', geo: scaleUV(new THREE.BoxGeometry(W + 0.1, 0.1, D + 0.1), 0.6), mat: floorWood, pos: [0, -0.05, 0] },
    { key: 'back', geo: extrude(back, T), mat: wood, pos: [0, 0, -D / 2] },
    { key: 'left', geo: extrude(side, T), mat: woodWarm, pos: [-W / 2 + T, 0, 0], rot: [0, -Math.PI / 2, 0] },
    { key: 'right', geo: extrude(side, T), mat: woodWarm, pos: [W / 2 - T, 0, 0], rot: [0, Math.PI / 2, 0] },
    { key: 'front', geo: extrude(front, T), mat: wood, pos: [0, 0, D / 2 - T] },
    { key: 'winL', geo: winFrame, mat: blue, pos: [-W / 2 - 0.05, 0.87, 0], rot: [0, -Math.PI / 2, 0] },
    { key: 'winR', geo: winFrame, mat: yellow, pos: [W / 2 + 0.05, 0.87, 0], rot: [0, Math.PI / 2, 0] },
    { key: 'doorFrame', geo: extrude(doorFrameShape(), 0.06, 0.008), mat: blue, pos: [0, 0, D / 2] },
    { key: 'oculus', geo: extrude(ringShape(0.25, 0.17), 0.05, 0.006), mat: yellow, pos: [0, WALL_H + 0.28, D / 2] },
    {
      key: 'roofL', geo: roofGeo, mat: red,
      pos: [-roofCx - nrm.x * 0.06, roofCy + nrm.y * 0.06, 0], rot: [0, 0, slope],
    },
    {
      key: 'roofR', geo: roofGeo, mat: red,
      pos: [roofCx + nrm.x * 0.06, roofCy + nrm.y * 0.06, 0], rot: [0, 0, -slope],
    },
    { key: 'ridge', geo: new THREE.BoxGeometry(0.16, 0.14, D + 0.34), mat: yellow, pos: [0, WALL_H + PEAK + 0.08, 0] },
    { key: 'chimney', geo: scaleUV(new THREE.BoxGeometry(0.26, 0.7, 0.26), 1), mat: blue, pos: [0.62, WALL_H + 0.45, -0.35] },
  ]
}
function doorFrameShape() {
  const s = new THREE.Shape()
  const w = 0.46, h = 0.68
  s.moveTo(-w, 0); s.lineTo(w, 0); s.lineTo(w, h); s.absarc(0, h, w, 0, Math.PI, false); s.lineTo(-w, 0)
  s.holes.push(doorPath(0.34, 0.68))
  return s
}

let piecesCache
export const getPieces = () => (piecesCache ??= buildPieces())

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

/** Cub cu literă (pentru semnul BIZI) */
export function LetterCube({ letter, color, size = 1, decal = true, ref, ...props }) {
  const mat = useMemo(() => woodMaterial('#ffffff'), [])
  const tex = useMemo(() => letterTexture(letter, color), [letter, color])
  return (
    <group ref={ref} {...props}>
      <RoundedBox args={[size, size, size]} radius={size * 0.1} smoothness={3} material={mat} />
      {decal && (
        <mesh position={[0, 0, size / 2 + 0.002]}>
          <planeGeometry args={[size * 0.86, size * 0.86]} />
          <meshStandardMaterial map={tex} transparent roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      )}
    </group>
  )
}

/** Semnul BIZI: 4 cuburi mici, deasupra acoperișului */
export function Sign(props) {
  const step = (1 + SIGN_GAP)
  return (
    <group position={[0, SIGN_Y, 0]} scale={SIGN_S} {...props}>
      {LETTERS.map((l, i) => (
        <LetterCube key={i} letter={l.ch} color={l.color} position={[(i - 1.5) * step, 0, 0]} />
      ))}
    </group>
  )
}

/**
 * Căsuța completă. `onPieces(groups)` primește grupurile pieselor
 * (cu `userData.rest`), ca introul să le poată anima.
 */
export function House({ onPieces, shadow = true, ...props }) {
  const pieces = getPieces()
  const refs = useRef([])
  useLayoutEffect(() => {
    const groups = refs.current.filter(Boolean)
    groups.forEach((g) => {
      g.userData.rest = { p: g.position.clone(), r: g.rotation.clone() }
    })
    onPieces?.(groups)
  }, [onPieces])
  return (
    <group {...props}>
      {pieces.map((p, i) => (
        <group key={p.key} ref={(el) => {
            refs.current[i] = el
          }} position={p.pos} rotation={p.rot ?? [0, 0, 0]} name={p.key}>
          <mesh geometry={p.geo} material={p.mat} />
        </group>
      ))}
      {shadow && <Shadow size={5.2} position={[0, 0.003, 0]} />}
    </group>
  )
}
