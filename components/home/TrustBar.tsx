import type { Translation } from "@/lib/i18n/translations";
import { Icon } from "./Icons";

export function TrustBar({ trust }: { trust: Translation["trust"] }) {
  return (
    <section className="trust-bar" aria-label="BeSe Tech trust principles">
      <div className="shell trust-bar-grid">
        {trust.map(([icon, title, description]) => (
          <article key={title}>
            <span className="trust-icon"><Icon name={icon} /></span>
            <div><strong>{title}</strong><p>{description}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
