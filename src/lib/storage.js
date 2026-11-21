import { INTRO_KEY } from '../config'

export function introSeen() {
  try {
    return localStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}
export function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* modul privat / blocat – ignorăm */
  }
}
export function resetIntro() {
  try {
    localStorage.removeItem(INTRO_KEY)
  } catch {
    /* ignorăm */
  }
}
