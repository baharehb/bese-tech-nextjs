import type { Translation } from "@/lib/i18n/translations";
import { Arrow } from "./Icons";

type JourneySectionProps = {
  journey: Translation["journey"];
  foundation: Translation["journeyFoundation"];
  heading: Translation["journeyHeading"];
};

export function JourneySection({ journey, foundation, heading }: JourneySectionProps) {
  return (
    <section className="journey section-pad" id="process">
      <div className="shell">
        <div className="section-heading centered">
          <p className="eyebrow"><span /> {heading.eyebrow}</p>
          <h2>{heading.title}<br />{heading.subtitle}</h2>
          <p>{heading.desc}</p>
        </div>
        <ol className="journey-grid">
          {journey.map(([number, title, description]) => (
            <li key={number}>
              <div className="journey-number">{number}</div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="journey-arrow" aria-hidden="true"><Arrow /></span>
            </li>
          ))}
        </ol>
        <div className="journey-foundation">
          {foundation.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </section>
  );
}
