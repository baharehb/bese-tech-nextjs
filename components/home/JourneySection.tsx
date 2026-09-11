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
      <div className="shell journey-layout">
        <div className="section-heading journey-intro">
          <p className="eyebrow"><span /> {heading.eyebrow}</p>
          <h2>{heading.title}<br />{heading.subtitle}</h2>
          <p>{heading.desc}</p>
          <div className="journey-foundation">
            {foundation.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <div className="journey-route">
          <span className="route-signal" aria-hidden="true" />
          <ol className="journey-grid">
          {journey.map(([number, title, description]) => (
            <li key={number}>
              <div className="journey-number">{Number(number)}</div>
              <div><h3>{title}</h3><p>{description}</p></div>
              <span className="journey-arrow" aria-hidden="true"><Arrow /></span>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
