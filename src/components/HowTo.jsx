const steps = [
  ['1', 'Alegi jucăria', 'Răsfoiești produsele și scrii numele copilului în configurator.'],
  ['2', 'Ne scrii pe WhatsApp', 'Confirmăm culorile, dimensiunea și prețul final, împreună.'],
  ['3', 'Primești în 7–10 zile', 'O facem pe comandă și o livrăm în Moldova sau în afară.'],
]
export default function HowTo() {
  return (
    <section className="section" id="cum">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="eyebrow">Cum comanzi</p>
          <h2>Trei pași, fără formulare lungi</h2>
        </header>
        <ol className="steps">
          {steps.map(([n, t, d]) => (
            <li key={n} className="steps__item" data-reveal>
              <span className="steps__n">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
