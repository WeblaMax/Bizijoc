import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { House, Sign, Shadow } from './House'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { paintedMaterial, birchMaterial } from './plywood'
import { BRAND } from './letters'
import { maxDpr } from '../lib/hooks'

const clamp = THREE.MathUtils.clamp

// jucării-forme: prisme groase, în picioare (baza la y = 0)
function prism(shape, depth) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 16 })
  g.translate(0, 0, -depth / 2)
  g.computeBoundingBox()
  g.translate(0, -g.boundingBox.min.y, 0)
  return g
}
const TRI = (() => {
  const s = new THREE.Shape()
  s.moveTo(-0.32, 0); s.lineTo(0.32, 0); s.lineTo(0, 0.55); s.lineTo(-0.32, 0)
  return prism(s, 0.16)
})()
const STAR = (() => {
  const s = new THREE.Shape()
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const k = i % 2 ? 0.13 : 0.3
    i ? s.lineTo(Math.cos(a) * k, -Math.sin(a) * k) : s.moveTo(Math.cos(a) * k, -Math.sin(a) * k)
  }
  return prism(s, 0.14)
})()

/** lumină de studio generată local (fără descărcări), pentru reflexii naturale */
function StudioEnv() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.3
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

/** Pointer + giroscop → rotație țintă (x,y) */
function useTilt(enabled) {
  const target = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      target.current.y = nx * 0.55
      target.current.x = ny * 0.16
    }
    const onOrient = (e) => {
      if (e.gamma == null) return
      target.current.y = clamp(e.gamma / 35, -1, 1) * 0.55
      target.current.x = clamp(((e.beta ?? 45) - 55) / 45, -1, 1) * 0.16
    }
    let orientOn = false
    const startOrient = () => {
      if (orientOn) return
      orientOn = true
      window.addEventListener('deviceorientation', onOrient)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    // iOS cere permisiune explicită, într-un gest al utilizatorului
    const DOE = window.DeviceOrientationEvent
    let askHandler
    if (DOE && typeof DOE.requestPermission === 'function') {
      askHandler = () => {
        DOE.requestPermission()
          .then((r) => r === 'granted' && startOrient())
          .catch(() => {})
        window.removeEventListener('touchend', askHandler)
      }
      window.addEventListener('touchend', askHandler, { passive: true })
    } else if (DOE) {
      startOrient()
    }
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onOrient)
      if (askHandler) window.removeEventListener('touchend', askHandler)
    }
  }, [enabled])
  return target
}

function Rig({ reduced }) {
  const group = useRef()
  const toys = useRef([])
  const { camera, size } = useThree()
  const tilt = useTilt(!reduced)

  useEffect(() => {
    const aspect = size.width / size.height
    const z = clamp(3.1 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect), 8, 20)
    camera.position.set(0, 1.7, z)
    camera.lookAt(0, 1.3, 0)
    camera.updateProjectionMatrix()
  }, [camera, size])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const k = 1 - Math.exp(-dt * 4)
    const baseY = reduced ? -0.35 : -0.35 + Math.sin(state.clock.elapsedTime * 0.35) * 0.1
    g.rotation.y += (baseY + tilt.current.y - g.rotation.y) * k
    g.rotation.x += (tilt.current.x - g.rotation.x) * k
    if (!reduced) {
      toys.current.forEach((t, i) => {
        if (!t) return
        t.position.y = t.userData.y + Math.sin(state.clock.elapsedTime * 1.1 + i * 2) * 0.05
      })
    }
  })

  const ball = paintedMaterial(BRAND.red, 0.35)
  const toy = (c) => paintedMaterial(c)
  const block = birchMaterial(1, 0)
  return (
    <group ref={group}>
      <House />
      <Sign />
      {/* jucării din lemn împrăștiate în fața căsuței */}
      <mesh ref={(el) => { toys.current[0] = el; if (el) el.userData.y = 0.32 }} position={[1.9, 0.32, 1.6]} material={ball}>
        <sphereGeometry args={[0.32, 24, 16]} />
      </mesh>
      {/* formele din logo, decupate din placaj gros și vopsite */}
      <mesh ref={(el) => { toys.current[1] = el; if (el) el.userData.y = 0 }} position={[-2.05, 0, 1.45]} rotation={[0, 0.5, 0]} geometry={TRI} material={toy(BRAND.green)} />
      <mesh ref={(el) => { toys.current[2] = el; if (el) el.userData.y = 0.2 }} position={[-1.35, 0.2, 2.15]} rotation={[0, -0.5, 0]} material={block}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
      </mesh>
      <mesh ref={(el) => { toys.current[3] = el; if (el) el.userData.y = 0 }} position={[1.45, 0, 2.2]} rotation={[0, -0.6, 0]} geometry={STAR} material={toy(BRAND.yellow)} />
      <Shadow size={1} position={[1.9, 0.004, 1.6]} opacity={0.7} />
      <Shadow size={1.1} position={[-2.05, 0.004, 1.5]} opacity={0.7} />
      <Shadow size={0.9} position={[-1.35, 0.004, 2.15]} opacity={0.7} />
      <Shadow size={0.9} position={[1.45, 0.004, 2.2]} opacity={0.6} />
    </group>
  )
}

export default function HeroScene({ active, reduced }) {
  const [dpr, setDpr] = useState(() => Math.min(maxDpr(), window.devicePixelRatio || 1))
  return (
    <Canvas
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      dpr={dpr}
      camera={{ fov: 36, near: 0.1, far: 60, position: [0, 1.9, 9] }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      onPointerMissed={() => {}}
      aria-label="Căsuță 3D din lemn, interactivă"
    >
      <PerfWatch onLow={() => setDpr(1)} />
      <StudioEnv />
      <hemisphereLight args={['#fff4e2', '#6b5640', 0.45]} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} color="#ffe6c4" />
      <directionalLight position={[-5, 2.5, 3]} intensity={0.45} color="#cfe2ff" />
      <pointLight position={[0, 1.0, -0.1]} intensity={2.4} distance={4} decay={1.6} color="#ffb860" />
      <Rig reduced={reduced} />
    </Canvas>
  )
}

/** dacă FPS-ul scade constant, reducem rezoluția (dpr) */
function PerfWatch({ onLow }) {
  const acc = useRef({ t: 0, n: 0, done: false })
  useFrame((_, dt) => {
    const a = acc.current
    if (a.done) return
    a.t += dt
    a.n++
    if (a.t > 2) {
      if (a.n / a.t < 40) onLow()
      a.done = true
    }
  })
  return null
}
