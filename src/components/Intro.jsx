import { useCallback, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { LogoTileParts, LogoWordParts } from './Icons'
import { markIntroSeen } from '../lib/storage'

const MAX_WAIT = 9 // secunde: după atât pornim site-ul chiar dacă nu s-a încărcat tot

/**
 * Intro cu logo-ul: plăcuța cade și sare, formele se așază pe rând, șiretul se înșiră,
 * apoi apar literele BIZ! și JOC. Servește și ca preloader: la final așteaptă resursele.
 */
export default function Intro({ progressRef, onReveal, onDone }) {
  const root = useRef()
  const logo = useRef()
  const label = useRef()
  const tl = useRef()
  const finished = useRef(false)

  const finish = useCallback(
    (quick) => {
      if (finished.current) return
      finished.current = true
      tl.current?.kill()
      markIntroSeen()
      onReveal?.()
      gsap.to(logo.current, { scale: quick ? 1 : 1.12, duration: quick ? 0.3 : 0.6, ease: 'power2.in' })
      gsap.to(root.current, { opacity: 0, duration: quick ? 0.35 : 0.6, ease: 'power1.out', onComplete: onDone })
    },
    [onReveal, onDone],
  )

  useLayoutEffect(() => {
    const q = gsap.utils.selector(logo.current)
    const tile = q('[data-part=tile]')
    const shapes = q('[data-part=shape]')
    const holes = q('[data-part=hole]')
    const laces = q('[data-part=lace]').map((g) => g.querySelectorAll('path'))
    const letters = q('[data-part=letter]')
    const joc = q('[data-part=joc]')
    const tileGroup = q('.intro__tile')

    gsap.set(tileGroup, { transformOrigin: '50% 100%', y: -900, rotation: -8 })
    gsap.set(shapes, { transformOrigin: '50% 50%', scale: 0, rotation: (i) => [-40, 35, -60, 25][i] })
    gsap.set(holes, { transformOrigin: '50% 50%', scale: 0 })
    laces.forEach((ps) => gsap.set(ps, { strokeDasharray: 1, strokeDashoffset: 1 }))
    gsap.set(letters, { transformOrigin: '50% 100%', y: 140, opacity: 0 })
    gsap.set(joc, { x: 90, opacity: 0 })

    const t = gsap.timeline({ delay: 0.15 })
    tl.current = t
    // 1. plăcuța cade și sare (arc amortizat)
    t.to(tileGroup, { y: 0, rotation: 0, duration: 0.7, ease: 'bounce.out' })
      .to(tileGroup, { scaleY: 0.9, scaleX: 1.06, duration: 0.08, ease: 'power1.out' }, 0.32)
      .to(tileGroup, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1.1, 0.35)' }, 0.4)
      // 2. formele se așază pe rând, cu „clac”
      .to(shapes, { scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.6)', stagger: 0.15 }, 0.85)
      .to(holes, { scale: 1, duration: 0.2, ease: 'back.out(3)', stagger: 0.05 }, 1.55)
    // 3. șiretul se înșiră prin găuri
    laces.forEach((ps, i) => t.to(ps, { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut' }, 1.75 + i * 0.3))
    // 4. BIZ! apar literă cu literă, apoi JOC
    t.to(letters, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.1 }, 2.55)
      .to(joc, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 3.1)
      .to(logo.current, { scale: 1.04, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 3.55)

    // 5. la final: dacă resursele sunt gata pornim site-ul, altfel arătăm progresul
    let waited = 0
    let rafId
    t.call(() => {
      const check = () => {
        const p = progressRef.current ?? 1
        if (p >= 1 || waited > MAX_WAIT - 4.2) return finish(false)
        if (label.current) label.current.textContent = `Se încarcă… ${Math.round(p * 100)}%`
        waited += 1 / 60
        rafId = requestAnimationFrame(check)
      }
      check()
    }, null, 4.2)

    return () => {
      t.kill()
      cancelAnimationFrame(rafId)
    }
  }, [finish, progressRef])

  return (
    <div className="intro" ref={root} role="dialog" aria-label="Animație de introducere BiziJoc">
      <svg className="intro__logo" ref={logo} viewBox="400 130 480 720" role="img" aria-label="BiziJoc">
        <g className="intro__tile">
          <LogoTileParts />
        </g>
        <LogoWordParts />
      </svg>
      <div className="intro__label" ref={label} aria-live="polite" />
      <button className="intro__skip" onClick={() => finish(true)} type="button">
        Sari peste <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
