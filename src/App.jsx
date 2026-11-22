import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Trust from './components/Trust'
import Configurator from './components/Configurator'
import Products from './components/Products'
import About from './components/About'
import HowTo from './components/HowTo'
import Footer from './components/Footer'
import FloatingWA from './components/FloatingWA'
import { introSeen } from './lib/storage'
import { prefersReducedMotion } from './lib/hooks'
import { preloadAssets, loadProducts } from './lib/loader'
import { initScroll, startScroll, stopScroll, gsap, ScrollTrigger } from './lib/scroll'

const Intro = lazy(() => import('./components/Intro'))

function decideMode() {
  const force = new URLSearchParams(location.search).get('intro') === '1'
  if (prefersReducedMotion()) return 'none'
  if (!force && introSeen()) return 'none' // doar la prima vizită
  return 'intro'
}

export default function App() {
  const [mode] = useState(decideMode)
  const [phase, setPhase] = useState(mode === 'intro' ? 'playing' : 'done') // playing → revealing → done
  const [ready, setReady] = useState(false)
  const progress = useRef(0)

  // smooth scroll + reveal-uri la scroll
  useEffect(() => {
    initScroll()
    if (prefersReducedMotion()) return
    document.documentElement.classList.add('reveal-on')
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out', overwrite: true }),
    })
    loadProducts().then(() => setTimeout(() => ScrollTrigger.refresh(), 100))
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  // în timpul introului pagina nu derulează
  useEffect(() => {
    if (phase === 'playing') {
      document.body.classList.add('no-scroll')
      stopScroll()
    } else {
      document.body.classList.remove('no-scroll')
      startScroll()
    }
  }, [phase])

  // preloader: resursele se încarcă în timpul introului
  useEffect(() => {
    if (mode !== 'intro') return
    preloadAssets(progress)
  }, [mode])

  // intrarea textului din hero, după intro
  useEffect(() => {
    if (phase === 'playing') return
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [phase])

  const onReveal = useCallback(() => setPhase((p) => (p === 'playing' ? 'revealing' : p)), [])
  const onDone = useCallback(() => setPhase('done'), [])

  return (
    <>
      <Header />
      <main>
        <Hero live={phase !== 'playing'} ready={ready} />
        <Trust />
        <Configurator />
        <Products />
        <About />
        <HowTo />
      </main>
      <Footer />
      <FloatingWA />
      {phase !== 'done' && mode === 'intro' && (
        <Suspense fallback={<div className="intro" />}>
          <Intro progressRef={progress} onReveal={onReveal} onDone={onDone} />
        </Suspense>
      )}
    </>
  )
}
