import type { Translation } from "@/lib/i18n/translations";
import { Icon } from "./Icons";

export function TrustBar({ trust }: { trust: Translation["trust"] }) {
  return (
    <section className="trust-bar trust-marquee" aria-label="BeSe Tech trust principles">
      <div className="trust-marquee-track">
        {[0, 1].map((copy) => (
          <div className="trust-marquee-group" aria-hidden={copy === 1} key={copy}>
            {trust.map(([icon, title, description]) => (
              <article key={`${copy}-${title}`}>
                <span className="trust-icon"><Icon name={icon} /></span>
                <div><strong>{title}</strong><p>{description}</p></div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
