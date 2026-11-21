import { useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import IntroScene from '../three/IntroScene'
import { markIntroSeen } from '../lib/storage'
import { maxDpr } from '../lib/hooks'

/**
 * Overlay-ul de intro: preloader (cubul se umple cu lemn) → cădere → gravură →
 * BIZI → căsuță → dolly prin ușă → hero.
 */
export default function Intro({ progressRef, onReveal, onDone }) {
  const root = useRef()
  const label = useRef()
  const fade = useRef()
  const skipRef = useRef()
  const finished = useRef(false)

  const finish = useCallback(
    (quick) => {
      if (finished.current) return
      finished.current = true
      markIntroSeen()
      onReveal?.()
      gsap.to(root.current, {
        opacity: 0,
        duration: quick ? 0.35 : 0.55,
        ease: 'power1.out',
        onComplete: onDone,
      })
    },
    [onReveal, onDone],
  )

  const onFinish = useCallback(() => finish(false), [finish])
  const onSkip = () => {
    skipRef.current?.()
    finish(true)
  }

  return (
    <div className="intro" ref={root} role="dialog" aria-label="Animație de introducere BiziJoc">
      <Canvas
        dpr={[1, maxDpr()]}
        camera={{ fov: 40, near: 0.05, far: 60, position: [0, 1.55, 8] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <IntroScene progressRef={progressRef} labelRef={label} fadeRef={fade} onFinish={onFinish} onReveal={onReveal} skipRef={skipRef} />
      </Canvas>
      <div className="intro__label" ref={label} aria-live="polite" />
      <div className="intro__fade" ref={fade} />
      <button className="intro__skip" onClick={onSkip} type="button">
        Sari peste <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
