import { useEffect, useState } from 'react'
import { WhatsAppIcon } from './Icons'
import { waLink, DEFAULT_MSG } from '../lib/wa'

/** Buton WhatsApp plutitor (mobil) – apare după ce treci de hero */
export default function FloatingWA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.7)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <a className={`fab ${show ? '' : 'is-hidden'}`} href={waLink(DEFAULT_MSG)} target="_blank" rel="noopener" aria-label="Comandă pe WhatsApp" tabIndex={show ? 0 : -1}>
      <WhatsAppIcon size={28} />
    </a>
  )
}
