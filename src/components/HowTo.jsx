const steps = [
  ['Scrie-ne pe WhatsApp', 'Ne spui ce jucărie îți place și cum se numește copilul.'],
  ['Alegi jucăria', 'Stabilim împreună modelul, culorile și prețul final.'],
  ['Înregistrăm comanda', 'Începem lucrul: fiecare jucărie se face de mână, pe comandă.'],
  ['O primești în 7–10 zile', 'Livrăm în toată Moldova și în afara ei.'],
]
export default function HowTo() {
  return (
    <section className="section" id="cum">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="eyebrow">Cum comanzi</p>
          <h2>Patru pași simpli</h2>
        </header>
        <ol className="steps">
          {steps.map(([t, d], i) => (
            <li key={t} className="steps__item" data-reveal>
              <span className="steps__n">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
