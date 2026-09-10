import type { Language, Translation } from "@/lib/i18n/translations";
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
        <div className="services-grid">
          {services.list.map((service) => (
            <article className="service-card" key={service.number}>
              <header><span className="service-icon"><Icon name={service.icon} /></span><span className="service-number">{service.number}</span></header>
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul>{service.items.map((item) => <li key={item}><span><Check /></span>{item}</li>)}</ul>
              <footer><span>{lang === "en" ? "Outcome" : "Résultat"}</span><strong>{service.result}</strong></footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
