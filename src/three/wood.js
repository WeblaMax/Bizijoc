import * as THREE from 'three'

/** Umbră moale (blob) – ieftină, fără shadow map, bună pe mobil */
let blobTex
export function blobShadowTexture() {
  if (blobTex) return blobTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62)
  grd.addColorStop(0, 'rgba(60,35,10,0.55)')
  grd.addColorStop(0.6, 'rgba(60,35,10,0.18)')
  grd.addColorStop(1, 'rgba(60,35,10,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  blobTex = new THREE.CanvasTexture(c)
  blobTex.colorSpace = THREE.SRGBColorSpace
  return blobTex
}
