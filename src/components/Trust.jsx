import { icons } from './Icons'

const items = [
  ['gift', 'Numele e gratuit', 'Gravat sau pictat, fără cost în plus.'],
  ['clock', 'Gata în 7–10 zile', 'Fiecare piesă e făcută pe comandă.'],
  ['truck', 'Livrare în Moldova și internațional', 'Ajungem și la tine acasă.'],
  ['chat', 'Comenzi pe WhatsApp', 'Scrii, alegem împreună, gata.'],
]

export default function Trust() {
  return (
    <section className="trust" id="trust" aria-label="Avantaje">
      <ul className="trust__grid">
        {items.map(([ic, t, d]) => (
          <li key={t} className="trust__item" data-reveal>
            <span className="trust__ic">{icons[ic]}</span>
            <strong>{t}</strong>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
