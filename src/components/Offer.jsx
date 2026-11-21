import { OFFER } from '../config'
import { WhatsAppIcon } from './Icons'
import { waLink } from '../lib/wa'

/** Oferta e activă doar dacă enabled și nu a trecut data de final */
export const offerActive = () => OFFER.enabled && Date.now() <= new Date(OFFER.hideAfter).getTime()

export default function Offer() {
  if (!offerActive()) return null
  const msg = `Bună! Vreau să comand cu ${OFFER.title} (−${OFFER.newClient}% client nou / −${OFFER.returningClient}% dacă am mai comandat).`
  return (
    <section className="offer" id="oferta" aria-labelledby="offer-title">
      <div className="offer__snow" aria-hidden="true" />
      <div className="wrap offer__in">
        <div data-reveal>
          <p className="eyebrow eyebrow--light">Ofertă de sezon</p>
          <h2 id="offer-title">{OFFER.title}</h2>
          <p className="lead lead--light">Un cadou din lemn, cu numele copilului, sub brad. Reducerile se aplică la toate jucăriile.</p>
        </div>
        <div className="offer__cards" data-reveal>
          <div className="offer__card">
            <span className="offer__pct">−{OFFER.newClient}%</span>
            <span>pentru clienții noi</span>
          </div>
          <div className="offer__card offer__card--alt">
            <span className="offer__pct">−{OFFER.returningClient}%</span>
            <span>dacă ai mai comandat</span>
          </div>
        </div>
        <ol className="offer__dates" data-reveal>
          <li><small>Comenzi</small><strong>{OFFER.ordersLabel}</strong></li>
          <li><small>Livrare</small><strong>{OFFER.deliveryLabel}</strong></li>
        </ol>
        <a className="btn btn--wa btn--lg offer__cta" href={waLink(msg)} target="_blank" rel="noopener" data-reveal>
          <WhatsAppIcon /> Vreau oferta
        </a>
      </div>
    </section>
  )
}
