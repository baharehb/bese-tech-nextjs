import type { Language, Translation } from "@/lib/i18n/translations";
import type { CSSProperties } from "react";
import { Check, Icon } from "./Icons";

type ServicesSectionProps = {
  lang: Language;
  services: Translation["services"];
};

export function ServicesSection({ lang, services }: ServicesSectionProps) {
  return (
    <section className="services section-pad" id="services">
      <div className="shell">
        <div className="section-heading services-heading">
          <div><p className="eyebrow eyebrow-light"><span /> {services.heading.eyebrow}</p><h2>{services.heading.title}<br />{services.heading.subtitle}</h2></div>
          <p>{services.heading.desc}</p>
        </div>
      </div>
      <div className="shell">
        <div className="services-grid">
          {services.list.map((service, index) => (
            <article className="service-card" key={service.number}>
              <div className={`service-visual visual-${index + 1}`} aria-hidden="true">
                <span className="service-number">{Number(service.number)}</span>
                {index === 0 && <div className="partner-network"><i className="network-core" />{[0,1,2,3,4].map((item) => <span key={item} style={{ "--node": item } as CSSProperties}><b /></span>)}</div>}
                {index === 1 && <div className="evidence-stack"><i /><i /><i /><span><Check /></span><b /></div>}
                {index === 2 && <div className="execution-line"><i /><span /><span /><span /><span /><b /></div>}
                {index === 3 && <div className="decision-field"><i /><span /><span /><span /><span /><b /></div>}
              </div>
              <div className="service-content">
                <header><span className="service-icon"><Icon name={service.icon} /></span></header>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul>{service.items.map((item) => <li key={item}><span><Check /></span>{item}</li>)}</ul>
                <footer><span>{lang === "en" ? "Outcome" : "Résultat"}</span><strong>{service.result}</strong></footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
