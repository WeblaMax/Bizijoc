import { WA_NUMBER } from '../config'

export const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const DEFAULT_MSG = 'Bună! Vreau să comand o jucărie din lemn de la BiziJoc.'
