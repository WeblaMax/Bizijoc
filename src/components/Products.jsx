import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { loadProducts } from '../lib/loader'
import { gsap, Flip, ScrollTrigger } from '../lib/scroll'
import { useReducedMotion, isCoarse } from '../lib/hooks'
import { CURRENCY } from '../config'
import ProductModal from './ProductModal'

export const priceLabel = (p) => (typeof p.price === 'number' ? `de la ${p.price} ${CURRENCY}` : 'Preț la cerere')

function Card({ p, onOpen, hidden }) {
  const inner = useRef()
  const reduced = useReducedMotion()

  const move = (e) => {
    if (reduced || isCoarse()) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    inner.current.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(0)`
    inner.current.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    inner.current.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => {
    inner.current.style.transform = ''
  }

  return (
    <li className={`card ${hidden ? 'is-hidden' : ''}`} data-cat={p.category} data-id={p.id}>
      <button
        type="button"
        className="card__btn"
        onClick={() => onOpen(p)}
        onPointerMove={move}
        onPointerLeave={leave}
        onBlur={leave}
        aria-label={`${p.name} – deschide detalii`}
      >
        <div className="card__inner" ref={inner}>
          <div className="card__imgs">
            <img className="card__img card__img--a" src={p.images[0]} alt="" loading="lazy" width="800" height="600" decoding="async" />
            {p.images[1] && (
              <img className="card__img card__img--b" src={p.images[1]} alt="" loading="lazy" width="800" height="600" decoding="async" />
            )}
            <span className="card__shine" aria-hidden="true" />
          </div>
          <div className="card__body">
            <h3>{p.name}</h3>
            <p className="card__price">{priceLabel(p)}</p>
          </div>
        </div>
      </button>
    </li>
  )
}

export default function Products() {
  const [data, setData] = useState(null)
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState(null)
  const grid = useRef()
  const flipState = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    loadProducts().then(setData)
  }, [])

  const choose = useCallback(
    (id) => {
      if (id === cat) return
      if (!reduced && grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll('.card'))
      setCat(id)
    },
    [cat, reduced],
  )

  // animația filtrelor: Flip între aranjamentul vechi și cel nou
  useLayoutEffect(() => {
    const st = flipState.current
    if (!st) return
    flipState.current = null
    Flip.from(st, {
      duration: 0.55,
      ease: 'power2.inOut',
      absolute: true,
      scale: true,
      stagger: 0.025,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, delay: 0.15, ease: 'back.out(1.5)' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    })
  }, [cat])

  const products = data?.products ?? []
  const categories = data?.categories ?? []

  return (
    <section className="section" id="produse">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="eyebrow">Portofoliu</p>
          <h2>Ce lucrăm în atelier</h2>
          <p className="lead">Alege o categorie, apasă pe un produs și vezi detaliile. Orice jucărie poartă numele copilului tău.</p>
        </header>

        <div className="filters" role="tablist" aria-label="Categorii de produse" data-reveal>
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={cat === c.id}
              className={`chip ${cat === c.id ? 'is-on' : ''}`}
              onClick={() => choose(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {!data && <p className="muted">Se încarcă produsele…</p>}
        {data && products.length === 0 && <p className="muted">Produsele vor apărea în curând.</p>}

        <ul className="grid" ref={grid}>
          {products.map((p) => (
            <Card key={p.id} p={p} onOpen={setOpen} hidden={cat !== 'all' && p.category !== cat} />
          ))}
        </ul>
      </div>
      {open && <ProductModal product={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
