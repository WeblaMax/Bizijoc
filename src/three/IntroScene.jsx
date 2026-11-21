import { useEffect, useMemo, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import gsap from 'gsap'
import { woodMaterial } from './wood'
import { House, LetterCube, Lights, Shadow, SIGN_Y, SIGN_S, SIGN_GAP, getPieces } from './House'
import { LETTERS, drawEngrave } from './letters'
import Smoke from './Smoke'

const CUBE = 1.5 // latura cubului mare
const REST_Y = CUBE / 2
const ROW_S = 0.62 // latura cuburilor mici în rând
const ROW_Z = 1.7 // „în față”, ca să nu fie acoperite de căsuță
const FACE_ORDER = [
  // ordinea în care fețele trec prin față când cubul se rotește pozitiv
  { n: [0, 0, 1], ry: 0 }, // B: +Z
  { n: [-1, 0, 0], ry: -Math.PI / 2 }, // I: −X
  { n: [0, 0, -1], ry: Math.PI }, // Z: −Z
  { n: [1, 0, 0], ry: Math.PI / 2 }, // I: +X
]
const smooth = (t) => t * t * (3 - 2 * t)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

const tmp = new THREE.Vector3()

/**
 * Scena introului. Totul e condus de un singur obiect `S` (animat de un timeline GSAP);
 * `useFrame` doar îl citește și aplică transformările.
 */
export default function IntroScene({ progressRef, labelRef, fadeRef, onReveal, onFinish, skipRef }) {
  const { camera, size, gl } = useThree()

  const S = useRef({
    shown: 0, // umplere afișată (0..1)
    started: false,
    idleAmp: 0.32,
    theta: -0.6,
    split: 0,
    sign: 0,
    pieceP: [],
    dolly: 0,
    fade: 0,
  }).current

  // fizica cubului
  const phys = useRef({ on: false, y: REST_Y, vy: 0, sq: 0, sqv: 0, lift: 0 }).current

  const big = useRef()
  const smalls = useRef([])
  const smoke = useRef()
  const shadow = useRef()
  const housePieces = useRef([])
  const puffs = useRef([])
  const decals = useRef([])
  const clock = useRef(0)
  const scene_houseShadow = useRef()

  // plan de tăiere pentru efectul „se umple cu lemn”
  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])
  const cubeMat = useMemo(() => {
    const m = woodMaterial('#ffffff').clone()
    m.clippingPlanes = [clip]
    m.side = THREE.DoubleSide
    return m
  }, [clip])

  useEffect(() => {
    gl.localClippingEnabled = true
  }, [gl])

  // canvasuri pentru gravură (câte unul pe față)
  const engrave = useMemo(
    () =>
      LETTERS.map((l, i) => {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 256
        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        return { canvas, tex, last: -1, ch: l.ch, face: FACE_ORDER[i] }
      }),
    [],
  )

  // căsuța: pornește „dezasamblată”
  const onPieces = useCallback((groups) => {
    housePieces.current = groups
    S.pieceP = groups.map(() => 0)
    groups.forEach((g, i) => {
      g.visible = false
      g.userData.dir = new THREE.Vector3(((i * 37) % 7 - 3) * 0.7, 1.5 + (i % 3) * 0.9, -(5 + (i % 4) * 0.8))
      g.userData.spin = new THREE.Vector3(((i * 13) % 5 - 2) * 0.5, ((i * 7) % 5 - 2) * 0.6, ((i * 11) % 5 - 2) * 0.4)
    })
  }, [S])

  // inele „clack” la fiecare îmbinare
  const clack = useCallback(
    (i) => {
      const g = housePieces.current[i]
      if (!g) return
      const ring = puffs.current.find((r) => !r.userData.busy)
      g.getWorldPosition(tmp)
      // „squash” scurt pe piesă
      gsap.fromTo(g.scale, { x: 1.05, y: 0.94, z: 1.05 }, { x: 1, y: 1, z: 1, duration: 0.22, ease: 'elastic.out(1.2,0.4)' })
      if (!ring) return
      const mesh = ring
      mesh.userData.busy = true
      mesh.position.copy(tmp)
      mesh.quaternion.copy(camera.quaternion)
      mesh.visible = true
      mesh.material.opacity = 0.75
      mesh.scale.setScalar(0.5)
      gsap.to(mesh.scale, { x: 2.4, y: 2.4, z: 2.4, duration: 0.38, ease: 'power2.out' })
      gsap.to(mesh.material, {
        opacity: 0,
        duration: 0.38,
        ease: 'power1.in',
        onComplete: () => {
          mesh.visible = false
          mesh.userData.busy = false
        },
      })
    },
    [camera],
  )

  // ── timeline-ul introului – pornește când s-a umplut cubul ──
  const tlRef = useRef(null)
  const start = useCallback(() => {
    const n = S.pieceP.length
    const tl = gsap.timeline({ onComplete: onFinish })
    tlRef.current = tl
    // 0.00  cubul „sare” în sus (iese din cadru), apoi cade cu fizică
    tl.to(phys, { lift: 1, duration: 0.22, ease: 'power2.in', onComplete: () => { phys.on = true; phys.y = 5.8; phys.vy = 0 } }, 0)
    tl.to(S, { idleAmp: 0, duration: 0.22 }, 0)
    // rotire lentă în timpul căderii / ricoșării
    tl.to(S, { theta: 0, duration: 0.9, ease: 'none' }, 0.22)
    // 1.05  o tură completă: literele se gravează pe rând, pe fiecare față
    tl.to(S, { theta: Math.PI * 2, duration: 1.4, ease: 'power1.inOut' }, 1.05)
    // 2.45  se desface în 4 cuburi
    tl.to(S, { split: 1, duration: 0.55, ease: 'back.out(1.5)' }, 2.45)
    // 2.5+  căsuța se asamblează piesă cu piesă, „din spate”
    for (let i = 0; i < n; i++) {
      tl.to(
        S.pieceP,
        { [i]: 1, duration: 0.36, ease: 'back.out(1.5)', onComplete: () => clack(i) },
        2.5 + i * 0.075,
      )
    }
    // 2.9   BIZI sare pe acoperiș ca semn
    tl.to(S, { sign: 1, duration: 0.75, ease: 'power3.inOut' }, 2.9)
    // 3.75  dolly-in prin ușă
    tl.to(S, { dolly: 1, duration: 1.0, ease: 'power2.inOut' }, 3.75)
    tl.call(() => onReveal?.(), null, 4.35)
    tl.to(S, { fade: 1, duration: 0.45, ease: 'power1.in' }, 4.4)
  }, [S, phys, clack, onFinish, onReveal])

  // „Sari peste” oprește tot imediat
  useEffect(() => {
    if (skipRef) skipRef.current = () => tlRef.current?.kill()
  }, [skipRef])
  useEffect(() => () => tlRef.current?.kill(), [])

  // camera responsivă (pe portret se depărtează ca să încapă căsuța)
  const baseCam = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    clock.current += dt
    const t = clock.current

    // ── preloader: cubul se umple pe măsură ce se încarcă resursele ──
    if (!S.started) {
      const target = progressRef.current
      S.shown = Math.min(target, S.shown + dt / 1.0) // minim ~1s ca să se vadă umplerea
      const level = 0.02 + S.shown * (CUBE + 0.05)
      clip.constant = level
      if (labelRef.current) labelRef.current.textContent = `Pregătim atelierul… ${Math.round(S.shown * 100)}%`
      if (S.shown >= 1) {
        S.started = true
        clip.constant = 10
        if (labelRef.current) labelRef.current.style.opacity = 0
        start()
      }
    }

    // ── camera ──
    const fov = 40
    const aspect = size.width / size.height
    const camZ = THREE.MathUtils.clamp(1.85 / (Math.tan(THREE.MathUtils.degToRad(fov / 2)) * aspect), 8.2, 13)
    baseCam.set(0, 1.45, camZ)
    const d = S.dolly
    camera.position.set(0, THREE.MathUtils.lerp(baseCam.y, 0.62, d), THREE.MathUtils.lerp(baseCam.z, -0.25, d))
    look.set(0, THREE.MathUtils.lerp(1.25, 0.6, d), THREE.MathUtils.lerp(0, -2, d))
    camera.lookAt(look)
    const f = THREE.MathUtils.lerp(fov, 64, d * d)
    if (camera.fov !== f) {
      camera.fov = f
      camera.updateProjectionMatrix()
    }

    // ── fizica cubului mare ──
    const g = big.current
    if (phys.on) {
      phys.vy -= 26 * dt
      phys.y += phys.vy * dt
      if (phys.y < REST_Y) {
        const impact = -phys.vy
        phys.y = REST_Y
        phys.vy = impact > 1.6 ? impact * 0.42 : 0
        if (impact > 1.6) phys.sqv = -impact * 0.55
      }
    }
    // arc „spring” pentru squash & stretch
    phys.sqv += (-phys.sq * 220 - phys.sqv * 11) * dt
    phys.sq += phys.sqv * dt
    let y = phys.y
    if (!phys.on && phys.lift > 0) y = REST_Y + (6.3 - REST_Y) * phys.lift // „sare” în sus
    const theta = S.theta + Math.sin(t * 1.4) * S.idleAmp
    if (g) {
      g.position.set(0, y, ROW_Z)
      g.rotation.y = theta
      const sq = THREE.MathUtils.clamp(phys.sq, -0.18, 0.18)
      g.scale.set(1 - sq * 0.55, 1 + sq, 1 - sq * 0.55)
      const sp = clamp01(1 - S.split * 3)
      g.visible = sp > 0.01
      g.scale.multiplyScalar(sp)
    }
    // umbra cubului
    if (shadow.current) {
      const h = Math.max(0, y - REST_Y)
      const k = 1 / (1 + h * 0.5)
      shadow.current.position.set(0, 0.01, ROW_Z)
      shadow.current.scale.setScalar(1.1 * k * (1 - S.split * 0.0))
      shadow.current.material.opacity = 0.85 * k * (1 - S.split)
    }

    // ── gravura laser pe fețe ──
    engrave.forEach((e, k) => {
      const thetaK = k * (Math.PI / 2)
      const p = clamp01((S.theta - (thetaK - 0.5)) / 0.85)
      if (p !== e.last) {
        if (p > 0 || e.last > 0) {
          drawEngrave(e.canvas, e.ch, p)
          e.tex.needsUpdate = true
        }
        // fum în dreptul liniei de scanare
        if (p > 0 && p < 1 && decals.current[k] && smoke.current) {
          const dm = decals.current[k]
          const fy = 0.04 + 0.92 * p
          for (let j = 0; j < 3; j++) {
            tmp.set((Math.random() - 0.5) * CUBE * 0.5, (0.5 - fy) * CUBE * 0.9, 0.01)
            dm.localToWorld(tmp)
            smoke.current.emit(tmp)
          }
        }
        e.last = p
      }
    })

    // ── cele 4 cuburi BIZI: split → rând → semn pe acoperiș ──
    const sp = smooth(S.split)
    const sg = smooth(S.sign)
    smalls.current.forEach((c, i) => {
      if (!c) return
      c.visible = S.split > 0.001
      const rowX = (i - 1.5) * (ROW_S + 0.1)
      const signX = (i - 1.5) * (1 + SIGN_GAP) * SIGN_S
      // faza 1: din centrul cubului mare spre rând
      const x1 = THREE.MathUtils.lerp(0, rowX, sp)
      const y1 = THREE.MathUtils.lerp(REST_Y, ROW_S / 2, sp) + Math.sin(sp * Math.PI) * 0.5
      const z1 = ROW_Z
      // faza 2: din rând spre semn (arc deasupra)
      const x = THREE.MathUtils.lerp(x1, signX, sg)
      const yy = THREE.MathUtils.lerp(y1, SIGN_Y, sg) + Math.sin(sg * Math.PI) * 0.9
      const z = THREE.MathUtils.lerp(z1, 0, sg)
      c.position.set(x, yy, z)
      const s = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.12, ROW_S, sp), SIGN_S, sg)
      c.scale.setScalar(s)
      c.rotation.y = (1 - sp) * (i % 2 ? -1 : 1) * Math.PI + Math.sin(sg * Math.PI) * 0.4 * (i % 2 ? -1 : 1)
      c.rotation.x = Math.sin(sp * Math.PI) * 0.4
    })

    // ── piesele căsuței ──
    housePieces.current.forEach((p, i) => {
      const e = S.pieceP[i] ?? 0
      p.visible = e > 0.001
      if (!p.visible) return
      const r = p.userData.rest
      const k = 1 - e
      p.position.set(r.p.x + p.userData.dir.x * k, r.p.y + p.userData.dir.y * k, r.p.z + p.userData.dir.z * k)
      p.rotation.set(r.r.x + p.userData.spin.x * k, r.r.y + p.userData.spin.y * k, r.r.z + p.userData.spin.z * k)
    })

    // umbra căsuței apare treptat
    const asm = S.pieceP.length ? S.pieceP.reduce((a, b) => a + b, 0) / S.pieceP.length : 0
    const hs = scene_houseShadow.current
    if (hs) hs.material.opacity = 0.9 * clamp01(asm)

    // ── fade final către hero ──
    if (fadeRef.current) fadeRef.current.style.opacity = S.fade
  })

  return (
    <>
      <color attach="background" args={['#FBF1E1']} />
      <Lights interior />
      <fog attach="fog" args={['#FBF1E1', 16, 34]} />

      {/* cubul mare (preloader + gravură) */}
      <group ref={big}>
        <RoundedBox args={[CUBE, CUBE, CUBE]} radius={0.12} smoothness={3} material={cubeMat} />
        {FACE_ORDER.map((f, k) => (
          <mesh
            key={k}
            ref={(el) => {
              decals.current[k] = el
            }}
            position={[f.n[0] * (CUBE / 2 + 0.004), 0, f.n[2] * (CUBE / 2 + 0.004)]}
            rotation={[0, f.ry, 0]}
          >
            <planeGeometry args={[CUBE * 0.9, CUBE * 0.9]} />
            <meshBasicMaterial map={engrave[k].tex} transparent toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
          </mesh>
        ))}
        <GhostCube started={() => S.started} />
      </group>
      <Shadow ref={shadow} size={2.8} />

      {/* cele 4 cuburi mici cu literele BIZI */}
      {LETTERS.map((l, i) => (
        <LetterCube key={i} ref={(el) => {
            smalls.current[i] = el
          }} letter={l.ch} color={l.color} visible={false} />
      ))}

      {/* căsuța */}
      <House onPieces={onPieces} shadow={false} />
      <HouseShadow innerRef={scene_houseShadow} />

      {/* inele „clack” */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} ref={(el) => {
            puffs.current[i] = el
          }} visible={false} renderOrder={6}>
          <ringGeometry args={[0.16, 0.2, 28]} />
          <meshBasicMaterial color="#fff0cf" transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}

      <Smoke ref={smoke} />
    </>
  )
}

/** conturul „fantomă” al cubului cât timp se încarcă */
function GhostCube({ started }) {
  const g = useRef()
  useFrame(() => {
    if (g.current && started()) g.current.visible = false
  })
  return (
    <group ref={g}>
      <mesh>
        <boxGeometry args={[CUBE, CUBE, CUBE]} />
        <meshBasicMaterial color="#d9bf97" transparent opacity={0.22} depthWrite={false} />
        <Edges color="#b98f5a" />
      </mesh>
    </group>
  )
}

function HouseShadow({ innerRef }) {
  return <Shadow ref={innerRef} size={5.2} position={[0, 0.003, 0]} opacity={0} />
}
