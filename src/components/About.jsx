import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../config'
import { InstagramIcon } from './Icons'

export default function About() {
  return (
    <section className="section section--warm" id="despre">
      <div className="wrap about">
        <div className="about__art" aria-hidden="true" data-reveal>
          {['B', 'I', 'Z', 'I'].map((l, i) => (
            <span key={i} className={`about__cube about__cube--${i}`}>{l}</span>
          ))}
        </div>
        <div className="about__copy" data-reveal>
          <p className="eyebrow">Despre noi</p>
          <h2>O mamă, patru copii și multe mâini îndemânatice</h2>
          <p>
            BiziJoc s-a născut acasă, într-o casă plină de joacă. O mamă cu patru copii a început să facă jucării din lemn
            cu mâinile ei, pentru că știa mai bine ca oricine ce înseamnă o jucărie care rezistă, care miroase a lemn
            adevărat și care îi aparține copilului.
          </p>
          <p>
            De aceea pe fiecare piesă apare numele celui mic, gratuit. Nu e un detaliu de marketing, e felul în care
            pornește orice jucărie de la noi: întâi un nume, apoi lemnul, apoi grija.
          </p>
          <p>
            Din atelierul de acasă, jucăriile BiziJoc ajung acum în toată Moldova și în afara ei, iar povestea
            continuă pe Instagram.
          </p>
          <ul className="about__stats">
            <li><strong>4</strong><span>copii acasă</span></li>
            <li><strong>4.200+</strong><span>urmăritori</span></li>
            <li><strong>~1.000</strong><span>postări</span></li>
          </ul>
          <a className="btn btn--ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener">
            <InstagramIcon /> {INSTAGRAM_HANDLE} pe Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
