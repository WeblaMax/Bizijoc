import { useEffect, useRef, useState } from 'react'
import { WhatsAppIcon } from './Icons'
import { waLink } from '../lib/wa'
import { stopScroll, startScroll } from '../lib/scroll'
import { priceLabel } from './Products'

export default function ProductModal({ product: p, onClose }) {
  const [i, setI] = useState(0)
  const closeBtn = useRef()
  const lastFocus = useRef(document.activeElement)

  useEffect(() => {
    stopScroll()
    document.body.classList.add('no-scroll')
    closeBtn.current?.focus()
    const prev = lastFocus.current
    return () => {
      startScroll()
      document.body.classList.remove('no-scroll')
      prev?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((n) => (n + 1) % p.images.length)
      if (e.key === 'ArrowLeft') setI((n) => (n - 1 + p.images.length) % p.images.length)
      if (e.key === 'Tab') {
        // capcană de focus simplă
        const f = document.querySelectorAll('.modal button, .modal a[href]')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, p.images.length])

  const msg = `Bună! Mă interesează „${p.name}”. Aș vrea numele copilului gravat pe el.`

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__panel" data-lenis-prevent>
        <button ref={closeBtn} className="modal__close" type="button" onClick={onClose} aria-label="Închide">
          ×
        </button>
        <div className="modal__gallery">
          <div className="modal__main">
            <img src={p.images[i]} alt={`${p.name} – poza ${i + 1}`} width="800" height="600" />
          </div>
          {p.images.length > 1 && (
            <div className="modal__thumbs">
              {p.images.map((src, k) => (
                <button key={src} type="button" className={k === i ? 'is-on' : ''} onClick={() => setI(k)} aria-label={`Poza ${k + 1}`}>
                  <img src={src} alt="" width="120" height="90" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="modal__info">
          <h3 id="modal-title">{p.name}</h3>
          <p className="modal__price">{priceLabel(p)}</p>
          <p>{p.description}</p>
          <dl className="modal__facts">
            <div><dt>Dimensiuni</dt><dd>{p.dimensions || 'La cerere'}</dd></div>
            <div><dt>Personalizare</dt><dd>Numele copilului – gratuit</dd></div>
            <div><dt>Termen</dt><dd>7–10 zile</dd></div>
          </dl>
          <a className="btn btn--wa btn--lg" href={waLink(msg)} target="_blank" rel="noopener">
            <WhatsAppIcon /> Comandă pe WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
