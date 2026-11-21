import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import gsap from 'gsap'
import { Lights, Shadow } from './House'
import { woodMaterial } from './wood'
import { FONT } from './letters'
import { maxDpr } from '../lib/hooks'

const PW = 3.7, PH = 1.15, PD = 0.3
const CW = 1024, CH = 320

function drawName(colorCanvas, bumpCanvas, name, color) {
  const text = name || ' '
  const c = colorCanvas.getContext('2d')
  const b = bumpCanvas.getContext('2d')
  c.clearRect(0, 0, CW, CH)
  b.fillStyle = '#fff'
  b.fillRect(0, 0, CW, CH)
  let fs = 250
  c.font = `700 ${fs}px ${FONT}`
  const w = c.measureText(text).width
  const maxW = CW * 0.92
  if (w > maxW) fs = Math.floor((fs * maxW) / w)
  for (const g of [c, b]) {
    g.font = `700 ${fs}px ${FONT}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
  }
  const cy = CH / 2 + fs * 0.04
  // relief: litere „scobite”
  b.shadowColor = '#000'
  b.shadowBlur = 10
  b.fillStyle = '#000'
  b.fillText(text, CW / 2, cy)
  // marginea întunecată (adâncitura) + culoarea
  c.fillStyle = 'rgba(30,15,0,0.55)'
  c.fillText(text, CW / 2 - 3, cy - 4)
  c.fillStyle = color
  c.fillText(text, CW / 2, cy)
}

function Plaque({ name, color, reduced }) {
  const group = useRef()
  const { camera, size } = useThree()
  const [fontTick, setFontTick] = useState(0)

  const { colorCanvas, bumpCanvas, colorTex, bumpTex } = useMemo(() => {
    const colorCanvas = document.createElement('canvas')
    const bumpCanvas = document.createElement('canvas')
    colorCanvas.width = bumpCanvas.width = CW
    colorCanvas.height = bumpCanvas.height = CH
    const colorTex = new THREE.CanvasTexture(colorCanvas)
    colorTex.colorSpace = THREE.SRGBColorSpace
    colorTex.anisotropy = 4
    const bumpTex = new THREE.CanvasTexture(bumpCanvas)
    return { colorCanvas, bumpCanvas, colorTex, bumpTex }
  }, [])

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
    drawName(colorCanvas, bumpCanvas, name, color)
    colorTex.needsUpdate = true
    bumpTex.needsUpdate = true
  }, [name, color, fontTick, colorCanvas, bumpCanvas, colorTex, bumpTex])

  // mică „săritură” la fiecare schimbare
  useEffect(() => {
    if (reduced || !group.current) return
    gsap.fromTo(group.current.scale, { x: 1.05, y: 1.05, z: 1.05 }, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'elastic.out(1,0.45)', overwrite: true })
  }, [name, color, reduced])

  useEffect(() => {
    const aspect = size.width / size.height
    const z = THREE.MathUtils.clamp((PW / 2 + 0.55) / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect), 5, 12)
    camera.position.set(0, 0.35, z)
    camera.lookAt(0, 0.25, 0)
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

  const wood = useMemo(() => woodMaterial('#f0c38a'), [])
  const stand = useMemo(() => woodMaterial('#b4824f'), [])

  return (
    <group position={[0, 0.2, 0]}>
      <group ref={group}>
        <RoundedBox args={[PW, PH, PD]} radius={0.09} smoothness={4} material={wood} position={[0, 0.7, 0]} />
        <mesh position={[0, 0.7, PD / 2 + 0.003]}>
          <planeGeometry args={[PW * 0.94, (PW * 0.94 * CH) / CW]} />
          <meshStandardMaterial
            map={colorTex}
            bumpMap={bumpTex}
            bumpScale={2.2}
            transparent
            roughness={0.5}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
        <RoundedBox args={[PW * 0.9, 0.16, 0.7]} radius={0.05} smoothness={3} material={stand} position={[0, 0.02, 0.05]} />
      </group>
      <Shadow size={5} position={[0, -0.06, 0]} opacity={0.8} />
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
