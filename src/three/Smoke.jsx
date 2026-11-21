import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

const N = 90

const vert = /* glsl */ `
  attribute float aAge;
  attribute float aSize;
  uniform float uPx;
  varying float vAge;
  void main() {
    vAge = aAge;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (1.0 + aAge * 2.2) * uPx / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const frag = /* glsl */ `
  varying float vAge;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d) * (1.0 - vAge) * 0.42;
    if (vAge >= 1.0 || a < 0.003) discard;
    gl_FragColor = vec4(mix(vec3(1.0, 0.72, 0.4), vec3(0.62, 0.56, 0.5), vAge), a);
  }
`

/** „Fum” de la gravura laser: pool de particule, emise din cod prin ref.emit(vec3) */
const Smoke = forwardRef(function Smoke(_, ref) {
  const pts = useRef()
  const size = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)

  const data = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    geo.setAttribute('aAge', new THREE.BufferAttribute(new Float32Array(N).fill(1), 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(N), 1))
    return { geo, vel: new Float32Array(N * 3), life: new Float32Array(N).fill(1), age: new Float32Array(N).fill(1), next: 0 }
  }, [])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        uniforms: { uPx: { value: 600 } },
      }),
    [],
  )
  mat.uniforms.uPx.value = size.height * dpr * 0.09

  useImperativeHandle(ref, () => ({
    emit(v) {
      const i = data.next++ % N
      const p = data.geo.attributes.position
      p.setXYZ(i, v.x, v.y, v.z)
      data.vel[i * 3] = (Math.random() - 0.5) * 0.25
      data.vel[i * 3 + 1] = 0.25 + Math.random() * 0.35
      data.vel[i * 3 + 2] = 0.15 + Math.random() * 0.25
      data.age[i] = 0
      data.life[i] = 0.7 + Math.random() * 0.5
      data.geo.attributes.aSize.setX(i, 0.5 + Math.random() * 0.5)
    },
  }))

  useFrame((_, dt) => {
    const p = data.geo.attributes.position
    const a = data.geo.attributes.aAge
    let any = false
    for (let i = 0; i < N; i++) {
      if (data.age[i] >= 1) continue
      any = true
      data.age[i] += dt / data.life[i]
      p.setXYZ(
        i,
        p.getX(i) + data.vel[i * 3] * dt,
        p.getY(i) + data.vel[i * 3 + 1] * dt,
        p.getZ(i) + data.vel[i * 3 + 2] * dt,
      )
      a.setX(i, Math.min(1, data.age[i]))
    }
    if (any) {
      p.needsUpdate = true
      a.needsUpdate = true
      data.geo.attributes.aSize.needsUpdate = true
    }
  })

  return <points ref={pts} geometry={data.geo} material={mat} frustumCulled={false} renderOrder={5} />
})

export default Smoke
