import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { Lights, Shadow } from './House'
import { birchTextures, plyEdgeTextures } from './plywood'
import { FONT } from './letters'
import { maxDpr } from '../lib/hooks'

// două scânduri de placaj, una peste alta, cu numele decupat și lipit peste ele
const PW = 3.9, PLANK_H = 0.6, GAP = 0.03, PD = 0.16
const BOARD_H = PLANK_H * 2 + GAP
const CW = 1024, CH = 300
const LETTER_D = 0.07 // grosimea literelor decupate
const EDGE_LAYERS = 9
const BURNT = '#3b2415'

function fitFont(g, text) {
  let fs = 240
  g.font = `700 ${fs}px ${FONT}`
  const w = g.measureText(text).width
  const maxW = CW * 0.9
  if (w > maxW) fs = Math.floor((fs * maxW) / w)
  return fs
}

/** mască albă pe negru (forma literelor) + umbra lor de contact pe lemn */
function drawName(mask, shadow, name) {
  const text = name || ' '
  const m = mask.getContext('2d')
  const sh = shadow.getContext('2d')
  const fs = fitFont(m, text)
  const cy = CH / 2 + fs * 0.04
  m.fillStyle = '#000'
  m.fillRect(0, 0, CW, CH)
  m.font = `700 ${fs}px ${FONT}`
  m.textAlign = 'center'
  m.textBaseline = 'middle'
  m.fillStyle = '#fff'
  m.fillText(text, CW / 2, cy)
  sh.clearRect(0, 0, CW, CH)
  sh.font = m.font
  sh.textAlign = 'center'
  sh.textBaseline = 'middle'
  sh.filter = 'blur(9px)'
  sh.fillStyle = 'rgba(40,22,8,0.75)'
  sh.fillText(text, CW / 2 + 6, cy + 10)
  sh.filter = 'none'
}

function Plank({ y, half, mats }) {
  const front = useMemo(() => {
    const m = mats.face.clone()
    m.map = mats.birch.map.clone()
    m.normalMap = mats.birch.normalMap.clone()
    for (const t of [m.map, m.normalMap]) {
      t.repeat.set(1, PLANK_H / BOARD_H)
      t.offset.set(0, half ? (PLANK_H + GAP) / BOARD_H : 0)
      t.needsUpdate = true
    }
    return m
  }, [half, mats])
  // ordinea fețelor la BoxGeometry: +x, -x, +y, -y, +z (față), -z (spate)
  const material = useMemo(() => [mats.side, mats.side, mats.top, mats.top, front, front], [front, mats])
  return (
    <mesh position={[0, y, 0]} material={material}>
      <boxGeometry args={[PW, PLANK_H, PD]} />
    </mesh>
  )
}

function Screw({ x, y }) {
  return (
    <group position={[x, y, PD / 2]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.045, 0.05, 0.02, 20]} />
        <meshStandardMaterial color="#cfcfcf" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.011, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.065, 0.004, 0.012]} />
        <meshStandardMaterial color="#5c5c5c" />
      </mesh>
    </group>
  )
}

function Plaque({ name, color, reduced }) {
  const group = useRef()
  const { camera, size } = useThree()
  const [fontTick, setFontTick] = useState(0)

  const mats = useMemo(() => {
    const birch = birchTextures(PW, BOARD_H)
    const { side, top } = plyEdgeTextures()
    return {
      birch,
      face: new THREE.MeshStandardMaterial({ roughness: 0.72, normalScale: new THREE.Vector2(0.35, 0.35) }),
      side: new THREE.MeshStandardMaterial({ map: side, roughness: 0.85 }),
      top: new THREE.MeshStandardMaterial({ map: top, roughness: 0.85 }),
      batten: new THREE.MeshStandardMaterial({ map: birch.map, color: '#d9bf95', roughness: 0.75 }),
    }
  }, [])

  const { mask, shadow, maskTex, shadowTex } = useMemo(() => {
    const mask = document.createElement('canvas')
    const shadow = document.createElement('canvas')
    mask.width = shadow.width = CW
    mask.height = shadow.height = CH
    const maskTex = new THREE.CanvasTexture(mask)
    maskTex.anisotropy = 4
    const shadowTex = new THREE.CanvasTexture(shadow)
    shadowTex.colorSpace = THREE.SRGBColorSpace
    return { mask, shadow, maskTex, shadowTex }
  }, [])

  const letterMats = useMemo(() => {
    const { normalMap } = birchTextures(PW, BOARD_H)
    const paint = new THREE.MeshStandardMaterial({ alphaMap: maskTex, alphaTest: 0.5, roughness: 0.5, normalMap, normalScale: new THREE.Vector2(0.15, 0.15) })
    const edge = new THREE.MeshStandardMaterial({ alphaMap: maskTex, alphaTest: 0.5, color: BURNT, roughness: 0.9 })
    return { paint, edge }
  }, [maskTex])

  useEffect(() => {
    letterMats.paint.color.set(color)
  }, [color, letterMats])

  // asigurăm fontul (cu diacritice) înainte să desenăm
  useEffect(() => {
    let live = true
    document.fonts
      ?.load(`700 120px ${FONT}`, name || 'Aa')
      .then(() => live && setFontTick((n) => n + 1))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [name])

  useEffect(() => {
    drawName(mask, shadow, name)
    maskTex.needsUpdate = true
    shadowTex.needsUpdate = true
  }, [name, fontTick, mask, shadow, maskTex, shadowTex])

  // mică „săritură” la fiecare schimbare
  useEffect(() => {
    if (reduced || !group.current) return
    gsap.fromTo(group.current.scale, { x: 1.05, y: 1.05, z: 1.05 }, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'elastic.out(1,0.45)', overwrite: true })
  }, [name, color, reduced])

  useEffect(() => {
    const aspect = size.width / size.height
    const z = THREE.MathUtils.clamp((PW / 2 + 0.5) / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect), 5, 12)
    camera.position.set(0, 0.45, z)
    camera.lookAt(0, 0.72, 0)
    camera.updateProjectionMatrix()
  }, [camera, size])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const sway = reduced ? 0 : Math.sin(t * 0.7) * 0.38
    const ty = sway + state.pointer.x * 0.3
    g.rotation.y += (ty - g.rotation.y) * 0.08
    g.rotation.x += (-state.pointer.y * 0.12 - g.rotation.x) * 0.08
  })

  const textW = PW * 0.92
  const textH = (textW * CH) / CW
  const cy = PLANK_H + GAP / 2
  const sx = PW / 2 - 0.16
  const sy = PLANK_H / 2

  return (
    <group position={[0, 0.0, 0]}>
      <group ref={group}>
        <Plank y={PLANK_H / 2} half={false} mats={mats} />
        <Plank y={PLANK_H * 1.5 + GAP} half mats={mats} />
        {/* șipcile din spate care țin scândurile împreună */}
        {[-1, 1].map((k) => (
          <mesh key={k} position={[k * (PW / 2 - 0.45), cy, -PD / 2 - 0.05]} material={mats.batten}>
            <boxGeometry args={[0.32, BOARD_H - 0.1, 0.1]} />
          </mesh>
        ))}
        {[-sx, sx].flatMap((x) => [sy, sy + PLANK_H + GAP].map((y) => <Screw key={`${x}${y}`} x={x} y={y} />))}
        {/* umbra literelor pe lemn */}
        <mesh position={[0, cy, PD / 2 + 0.002]} renderOrder={1}>
          <planeGeometry args={[textW, textH]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
        {/* literele decupate: muchie arsă de laser (straturi) + fața vopsită */}
        {Array.from({ length: EDGE_LAYERS }, (_, i) => (
          <mesh key={i} position={[0, cy, PD / 2 + 0.004 + (i * LETTER_D) / EDGE_LAYERS]} material={letterMats.edge}>
            <planeGeometry args={[textW, textH]} />
          </mesh>
        ))}
        <mesh position={[0, cy, PD / 2 + 0.004 + LETTER_D]} material={letterMats.paint}>
          <planeGeometry args={[textW, textH]} />
        </mesh>
      </group>
      <Shadow size={5.4} position={[0, -0.02, 0]} opacity={0.75} />
    </group>
  )
}

export default function NameScene({ name, color, active, reduced }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, maxDpr()]}
      camera={{ fov: 34, near: 0.1, far: 50, position: [0, 0.35, 7] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      aria-label="Previzualizare 3D a numelui gravat"
    >
      <Lights interior={false} />
      <Plaque name={name} color={color} reduced={reduced} />
    </Canvas>
  )
}
