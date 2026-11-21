// ─────────────────────────────────────────────────────────────
//  SETĂRI ALE SITE-ULUI – aici se editează lucrurile „de client”
// ─────────────────────────────────────────────────────────────

// Numărul WhatsApp, format internațional, doar cifre (ex: Moldova = 373...).
// TODO: ÎNLOCUIEȘTE cu numărul real al BiziJoc.
export const WA_NUMBER = '37300000000'

export const INSTAGRAM_URL = 'https://www.instagram.com/bizijoc/'
export const INSTAGRAM_HANDLE = '@bizijoc'

// Moneda afișată lângă prețuri (în products.json prețul e doar un număr).
export const CURRENCY = 'lei'

// ── Oferta sezonieră „Prețurile de Crăciun” ──
// Ca s-o scoți: pune enabled: false (sau las-o să dispară singură după hideAfter).
export const OFFER = {
  enabled: true,
  title: 'Prețurile de Crăciun',
  newClient: 10, // % reducere clienți noi
  returningClient: 15, // % reducere pentru cei care au mai comandat
  ordersLabel: '9–25 noiembrie',
  deliveryLabel: '10–18 decembrie',
  // după această dată secțiunea se ascunde automat (sfârșitul perioadei de comenzi)
  hideAfter: '2026-11-25T23:59:59',
}

// Cheia din localStorage care reține că introul a fost deja văzut.
export const INTRO_KEY = 'bizijoc_intro_seen_v1'
