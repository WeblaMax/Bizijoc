import { lazy, Suspense, useState } from 'react'
import { WhatsAppIcon } from './Icons'
import { waLink } from '../lib/wa'
import { useInView, useReducedMotion } from '../lib/hooks'
import { hasWebGL } from '../lib/webgl'

const NameScene = lazy(() => import('../three/NameScene'))

export const COLORS = [
  { id: 'albastru', label: 'albastru', hex: '#5FC3E8' },
  { id: 'verde', label: 'verde', hex: '#A9D05F' },
  { id: 'galben', label: 'galben', hex: '#F2D64B' },
  { id: 'rosu', label: 'roșu', hex: '#EE4747' },
  { id: 'nuc', label: 'nuc', hex: '#5A3418' },
  { id: 'crem', label: 'alb', hex: '#FFF8EA' },
]

// scrisul literelor: ca pe jucăriile reale (rotunjit, de mână ca la „Milana”, bloc ca la „MARK”)
export const FONTS = [
  { id: 'rotunjit', label: 'Rotunjit', family: '"Fredoka Variable", "Fredoka", system-ui, sans-serif', weight: 700, size: 240 },
  { id: 'mana', label: 'De mână', family: '"Courgette", cursive', weight: 400, size: 210 },
  { id: 'bloc', label: 'Bloc', family: '"Nunito Variable", system-ui, sans-serif', weight: 900, size: 230, upper: true },
]

const MAX = 14

export default function Configurator() {
  const [name, setName] = useState('Matei')
  const [color, setColor] = useState(COLORS[0])
  const [font, setFont] = useState(FONTS[0])
  const reduced = useReducedMotion()
  const [ref, inView] = useInView('300px')
  const [seen, setSeen] = useState(false)
  if (inView && !seen) setSeen(true)

  const clean = name.trim()
  const shown = font.upper ? clean.toLocaleUpperCase('ro-RO') : clean
  const msg = `Bună! Vreau o jucărie cu numele ${clean || '[NUME]'}, culoarea ${color.label}, scrisul ${font.label.toLowerCase()}.`

  return (
    <section className="section section--warm" id="numele-tau">
      <div className="wrap config">
        <div className="config__copy" data-reveal>
          <p className="eyebrow">Configurator</p>
          <h2>Scrie numele și vezi-l gravat pe lemn</h2>
          <p className="lead">Alege culoarea și scrisul literelor și privește cum prinde viață. Numele copilului e gratuit la orice jucărie.</p>

          <label className="field" htmlFor="kid-name">
            Numele copilului
          </label>
          <input
            id="kid-name"
            className="input"
            type="text"
            value={name}
            maxLength={MAX}
            placeholder="ex. Matei"
            autoComplete="off"
            autoCapitalize="words"
            spellCheck="false"
            onChange={(e) => setName(e.target.value)}
          />
          <span className="hint">{clean.length}/{MAX} litere · diacriticele (ă â î ș ț) merg perfect</span>

          <fieldset className="swatches">
            <legend className="field">Culoarea literelor</legend>
            <div className="swatches__row">
              {COLORS.map((c) => (
                <label key={c.id} className={`swatch ${color.id === c.id ? 'is-on' : ''}`} title={c.label}>
                  <input type="radio" name="letter-color" checked={color.id === c.id} onChange={() => setColor(c)} />
                  <span className="swatch__dot" style={{ background: c.hex }} />
                  <span className="swatch__name">{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="swatches">
            <legend className="field">Scrisul</legend>
            <div className="fonts" role="radiogroup">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={font.id === f.id}
                  className={`chip chip--font ${font.id === f.id ? 'is-on' : ''}`}
                  style={{ fontFamily: f.family, fontWeight: f.weight }}
                  onClick={() => setFont(f)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </fieldset>

          <a className="btn btn--wa btn--lg" href={waLink(msg)} target="_blank" rel="noopener">
            <WhatsAppIcon /> Vreau asta!
          </a>
        </div>

        <div className="config__stage" ref={ref} data-reveal>
          {seen && hasWebGL() ? (
            <Suspense fallback={<div className="config__loading">Se pregătește placa…</div>}>
              <NameScene name={shown} color={color.hex} font={font} active={inView} reduced={reduced} />
            </Suspense>
          ) : (
            <div className="config__flat" style={{ color: color.hex, fontFamily: font.family, fontWeight: font.weight }}>{shown || 'Numele tău'}</div>
          )}
          <span className="config__tip">Mută cursorul peste placă</span>
        </div>
      </div>
    </section>
  )
}
