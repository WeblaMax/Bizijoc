import { useEffect, useState } from 'react'
import { Logo, WhatsAppIcon } from './Icons'
import { waLink, DEFAULT_MSG } from '../lib/wa'
import { scrollToId } from '../lib/scroll'

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }
  const links = [
    ['numele-tau', 'Numele tău 3D'],
    ['produse', 'Produse'],
    ['despre', 'Despre noi'],
    ['contact', 'Contact'],
  ]

  return (
    <header className={`header ${solid || open ? 'is-solid' : ''}`}>
      <div className="header__in">
        <a href="#top" className="header__logo" onClick={go('top')} aria-label="BiziJoc – acasă">
          <Logo height={44} />
        </a>
        <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Principal">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>
              {label}
            </a>
          ))}
          <a className="btn btn--wa btn--sm nav__cta" href={waLink(DEFAULT_MSG)} target="_blank" rel="noopener">
            <WhatsAppIcon size={18} /> WhatsApp
          </a>
        </nav>
        <button
          className="burger"
          type="button"
          aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /> <span /> <span />
        </button>
      </div>
    </header>
  )
}
