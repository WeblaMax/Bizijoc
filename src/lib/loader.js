import { getWood } from '../three/wood'

let productsPromise
export function loadProducts() {
  productsPromise ??= fetch(`${import.meta.env.BASE_URL}products.json`)
    .then((r) => {
      if (!r.ok) throw new Error('products.json')
      return r.json()
    })
    .catch((e) => {
      console.error('Nu am putut încărca products.json', e)
      return { categories: [{ id: 'all', label: 'Toate' }], products: [] }
    })
  return productsPromise
}

const tick = () => new Promise((r) => setTimeout(r, 0))

/**
 * Încarcă resursele pentru intro și raportează progresul (0..1) într-un ref.
 * Pași: textura de lemn, fonturile, products.json, primele poze de produs.
 */
export async function preloadAssets(progressRef) {
  const steps = 4
  let done = 0
  const bump = () => {
    done++
    progressRef.current = done / steps
  }
  progressRef.current = 0

  // 1. lemn PBR (generat procedural – ia câteva zeci de ms)
  await tick()
  getWood()
  bump()

  // 2. fonturi (cu diacritice românești)
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('700 100px "Fredoka Variable"', 'BIZIăâîșțĂÂÎȘȚ'),
        document.fonts.load('400 16px "Nunito Variable"', 'ăâîșț'),
      ]),
      new Promise((r) => setTimeout(r, 3000)),
    ])
  } catch {
    /* continuăm cu fonturile de rezervă */
  }
  bump()

  // 3. catalogul
  const data = await loadProducts()
  bump()

  // 4. primele poze din catalog
  const imgs = data.products.slice(0, 6).map((p) => p.images?.[0]).filter(Boolean)
  await Promise.race([
    Promise.all(
      imgs.map(
        (src) =>
          new Promise((res) => {
            const i = new Image()
            i.onload = i.onerror = res
            i.src = src
          }),
      ),
    ),
    new Promise((r) => setTimeout(r, 3000)),
  ])
  bump()
}
