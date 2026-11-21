# BiziJoc – jucării din lemn personalizate

Site-portofoliu 3D (React + Three.js / React Three Fiber, GSAP, Lenis).

```bash
npm install
npm run dev       # dezvoltare
npm run build     # produce dist/ (se poate pune pe orice hosting static)
npm run preview
```

## Ce trebuie completat înainte de lansare

| Ce | Unde |
|---|---|
| **Numărul WhatsApp** (acum e un placeholder `37300000000`) | `src/config.js` → `WA_NUMBER` |
| **Prețuri** (acum `null` → „Preț la cerere”) și **dimensiuni** (`TODO`) | `public/products.json` |
| **Pozele reale** (acum poze-substitut SVG) | `public/img/products/` + `images` din `products.json` |
| Textul „Despre noi” (ciornă bazată pe povestea brandului) | `src/components/About.jsx` |

## products.json

Fiecare produs: `id`, `name`, `category` (`casute` · `cuburi` · `placi` · `garaje` · `fructe`),
`dimensions`, `price` (număr în lei, sau `null` pentru „Preț la cerere”), `images` (prima = card,
a doua = la hover), `description`. Cardurile, filtrele și modalul se construiesc automat.
Prețul apare ca „de la X lei”. Moneda se schimbă în `src/config.js` (`CURRENCY`).

## Oferta „Prețurile de Crăciun”

Se editează în `src/config.js` (`OFFER`). Se ascunde singură după `hideAfter`, sau pune `enabled: false`.
Ca s-o scoți definitiv: șterge `<Offer />` din `src/App.jsx`.

## Intro 3D

* rulează doar la prima vizită (`localStorage`, cu try/catch); „Sari peste →” e vizibil de la început;
* `prefers-reduced-motion` ⇒ fără intro, hero static (fără rotație/Lenis);
* fără WebGL ⇒ fallback 2D;
* pentru a-l vedea din nou: `/?intro=1` sau linkul „Vezi din nou animația” din footer.
* Secvența și timpii sunt în `src/three/IntroScene.jsx` (funcția `start`, timeline GSAP).

## Performanță (mobil)

* lemnul (albedo + normal map) e generat procedural la runtime, 512 px, o singură dată – fără descărcări;
* fără shadow maps (umbre „blob”), dpr limitat la 1.5 pe touch, scade la 1 dacă FPS < 40;
* canvasurile (hero, configurator) se opresc când nu sunt în ecran; `three` e într-un chunk separat,
  încărcat leneș; introul nu se descarcă deloc pentru vizitatorii care l-au văzut deja.
