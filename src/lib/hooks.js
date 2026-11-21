import { useEffect, useState, useRef } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useReducedMotion() {
  const [v, setV] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setV(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return v
}

/** true cât timp elementul e (aproape) vizibil – folosit ca să punem pe pauză canvasurile 3D */
export function useInView(rootMargin = '200px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, inView]
}

export const isCoarse = () => window.matchMedia?.('(pointer: coarse)').matches

/** dpr limitat: mobilul rămâne rapid */
export const maxDpr = () => (isCoarse() ? 1.5 : 2)
