import type { Translation } from "@/lib/i18n/translations";
import { Arrow } from "./Icons";

export function WhySection({ why }: { why: Translation["why"] }) {
  return (
    <section className="why section-pad" id="why">
      <div className="shell why-grid">
        <div className="why-copy">
          <p className="eyebrow"><span /> {why.eyebrow}</p>
          <h2>{why.title}</h2>
          <p>{why.p}</p>
          <a className="button button-primary" href="#contact">{why.button} <Arrow /></a>
        </div>
        <div className="outcomes">
          {why.outcomes.map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
