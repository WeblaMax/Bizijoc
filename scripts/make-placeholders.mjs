// Generează poze-substitut (SVG) pentru produse, ca site-ul să arate bine
// până sosesc pozele reale. Pozele reale se pun în public/img/products/ și se
// trec în public/products.json. Rulare: npm run placeholders
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'

const out = 'public/img/products'
mkdirSync(out, { recursive: true })
const { products } = JSON.parse(readFileSync('public/products.json', 'utf8'))

const W1 = '#E8C48B', W2 = '#C9985A', W3 = '#8B5E34'
const R = '#E63946', B = '#2A9DF4', Y = '#FFC93C', G = '#5BB45B'

const house = (s = 1, dx = 0) => `
  <g transform="translate(${400 + dx} 330) scale(${s})">
    <rect x="-150" y="-30" width="300" height="190" rx="10" fill="${W1}" stroke="${W3}" stroke-width="5"/>
    <path d="M-185 -25 L0 -150 L185 -25Z" fill="${R}" stroke="${W3}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="-40" y="50" width="80" height="110" rx="40" fill="${B}" stroke="${W3}" stroke-width="5"/>
    <rect x="-125" y="10" width="55" height="55" rx="8" fill="${Y}" stroke="${W3}" stroke-width="5"/>
    <rect x="70" y="10" width="55" height="55" rx="8" fill="${Y}" stroke="${W3}" stroke-width="5"/>
  </g>`
const cube = (x, y, s, c, l) => `
  <g transform="translate(${x} ${y})"><rect width="${s}" height="${s}" rx="${s * 0.12}" fill="${W1}" stroke="${W3}" stroke-width="5"/>
  <text x="${s / 2}" y="${s * 0.72}" font-family="Arial Rounded MT Bold,Arial,sans-serif" font-weight="800" font-size="${s * 0.62}" text-anchor="middle" fill="${c}">${l}</text></g>`
const shapes = {
  casute: (v) => house(v ? 1.12 : 1, v ? 20 : 0),
  cuburi: (v) => (v ? cube(210, 180, 170, B, 'I') + cube(390, 180, 170, R, 'B') + cube(300, 20, 170, Y, 'Z')
                     : cube(300, 120, 220, R, 'B')),
  placi: (v) => `<g transform="translate(150 60)"><rect width="500" height="360" rx="26" fill="${W1}" stroke="${W3}" stroke-width="6"/>
    <circle cx="110" cy="120" r="48" fill="${R}"/><rect x="200" y="90" width="110" height="60" rx="14" fill="${B}"/>
    <circle cx="390" cy="120" r="34" fill="${Y}"/><rect x="70" y="230" width="150" height="26" rx="13" fill="${W3}"/>
    <circle cx="320" cy="260" r="46" fill="${G}"/><rect x="${v ? 400 : 380}" y="230" width="60" height="60" rx="10" fill="${R}"/></g>`,
  garaje: (v) => `<g transform="translate(160 120)"><rect width="480" height="${v ? 300 : 230}" rx="14" fill="${W1}" stroke="${W3}" stroke-width="6"/>
    <path d="M-20 0 L240 -90 L500 0Z" fill="${B}" stroke="${W3}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="70" y="${v ? 150 : 90}" width="340" height="${v ? 130 : 140}" rx="10" fill="#6b4a2b"/>
    <rect x="120" y="${v ? 215 : 160}" width="110" height="46" rx="14" fill="${R}"/><rect x="250" y="${v ? 215 : 160}" width="110" height="46" rx="14" fill="${Y}"/></g>`,
  fructe: (v) => (v
    ? `<g><path d="M200 380 Q260 150 300 340Z" fill="#F08A2C" stroke="${W3}" stroke-width="5"/><path d="M300 380 Q330 150 400 330Z" fill="${R}" stroke="${W3}" stroke-width="5"/><circle cx="520" cy="320" r="70" fill="${G}" stroke="${W3}" stroke-width="5"/></g>`
    : `<g><circle cx="270" cy="300" r="80" fill="${R}" stroke="${W3}" stroke-width="5"/><circle cx="440" cy="310" r="70" fill="${Y}" stroke="${W3}" stroke-width="5"/><circle cx="360" cy="190" r="62" fill="${G}" stroke="${W3}" stroke-width="5"/></g>`),
}
const bg = { casute: '#FFF1D6', cuburi: '#E6F2FB', placi: '#FFF1D6', garaje: '#E6F2FB', fructe: '#EAF5E2' }

for (const p of products) {
  for (const v of [0, 1]) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="${v ? '#F4E3C6' : bg[p.category]}"/>
  <ellipse cx="400" cy="510" rx="230" ry="26" fill="#000" opacity=".12"/>
  ${shapes[p.category](v)}
  <text x="400" y="575" font-family="Arial,sans-serif" font-size="22" text-anchor="middle" fill="#8B5E34" opacity=".7">poză în curând</text>
</svg>`
    writeFileSync(`${out}/${p.id}-${v + 1}.svg`, svg)
  }
}
console.log('Gata:', products.length * 2, 'imagini în', out)
