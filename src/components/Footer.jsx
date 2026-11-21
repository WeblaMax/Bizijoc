import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../config'
import { Logo, WhatsAppIcon, InstagramIcon } from './Icons'
import { waLink, DEFAULT_MSG } from '../lib/wa'
import { resetIntro } from '../lib/storage'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap footer__in">
        <div>
          <Logo height={44} />
          <p className="footer__tag">Jucării din lemn personalizate, lucrate de mână.</p>
        </div>
        <div className="footer__col">
          <h3>Scrie-ne</h3>
          <a className="btn btn--wa" href={waLink(DEFAULT_MSG)} target="_blank" rel="noopener">
            <WhatsAppIcon size={18} /> Comandă pe WhatsApp
          </a>
          <a className="footer__link" href={INSTAGRAM_URL} target="_blank" rel="noopener">
            <InstagramIcon size={18} /> {INSTAGRAM_HANDLE}
          </a>
        </div>
        <div className="footer__col">
          <h3>Pe scurt</h3>
          <p>Numele copilului gratuit<br />Gata în 7–10 zile<br />Livrare în Moldova și internațional</p>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <span>© {new Date().getFullYear()} BiziJoc</span>
        <button
          type="button"
          className="footer__again"
          onClick={() => {
            resetIntro()
            location.reload()
          }}
        >
          ↻ Vezi din nou animația
        </button>
      </div>
    </footer>
  )
}
