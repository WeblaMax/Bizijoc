import { lazy, Suspense } from 'react'
import { WhatsAppIcon } from './Icons'
import { waLink, DEFAULT_MSG } from '../lib/wa'
import { scrollToId } from '../lib/scroll'
import { useInView, useReducedMotion } from '../lib/hooks'
import { hasWebGL } from '../lib/webgl'

const HeroScene = lazy(() => import('../three/HeroScene'))

function FlatHouse() {
  return (
    <svg className="hero__flat" viewBox="0 0 400 340" role="img" aria-label="Căsuță din lemn">
      <ellipse cx="200" cy="318" rx="140" ry="14" fill="#000" opacity=".12" />
      <rect x="80" y="130" width="240" height="180" rx="10" fill="#E8C48B" stroke="#8B5E34" strokeWidth="5" />
      <path d="M55 135 L200 40 L345 135Z" fill="#E63946" stroke="#8B5E34" strokeWidth="5" strokeLinejoin="round" />
      <path d="M165 310v-80a35 35 0 0 1 70 0v80z" fill="#2A9DF4" stroke="#8B5E34" strokeWidth="5" />
      <rect x="100" y="170" width="46" height="46" rx="8" fill="#FFC93C" stroke="#8B5E34" strokeWidth="5" />
      <rect x="254" y="170" width="46" height="46" rx="8" fill="#FFC93C" stroke="#8B5E34" strokeWidth="5" />
    </svg>
  )
}

export default function Hero({ live, ready }) {
  const reduced = useReducedMotion()
  const [stageRef, inView] = useInView('100px')
  const webgl = hasWebGL()

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`} id="top">
      <div className="hero__stage" ref={stageRef}>
        {live && webgl ? (
          <Suspense fallback={null}>
            <HeroScene active={inView} reduced={reduced} />
          </Suspense>
        ) : (
          !webgl && <FlatHouse />
        )}
      </div>
      <div className="hero__copy">
        <p className="eyebrow hero__in">Atelier BiziJoc · Moldova</p>
        <h1 className="hero__in">
          Jucării din lemn cu <span className="hl">numele copilului</span> tău
        </h1>
        <p className="hero__sub hero__in">
          <span>Lucrate de mână</span> · <span>Numele gratuit</span> · <span>Gata în 7–10 zile</span>
        </p>
        <div className="hero__cta hero__in">
          <a className="btn btn--wa btn--lg" href={waLink(DEFAULT_MSG)} target="_blank" rel="noopener">
            <WhatsAppIcon /> Comandă pe WhatsApp
          </a>
          <a
            className="btn btn--ghost btn--lg"
            href="#produse"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('produse')
            }}
          >
            Vezi produsele
          </a>
        </div>
      </div>
      <a
        className="hero__scroll hero__in"
        href="#produse"
        onClick={(e) => {
          e.preventDefault()
          scrollToId('trust')
        }}
        aria-label="Derulează în jos"
      >
        <span />
      </a>
    </section>
  )
}
