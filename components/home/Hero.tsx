import type { Translation } from "@/lib/i18n/translations";
import { Arrow } from "./Icons";
import { ProjectCommand } from "./ProjectCommand";
import { ManufacturingBackdrop } from "./ManufacturingBackdrop";

export function Hero({ translation: t }: { translation: Translation }) {
  return (
    <section className="hero section-pad">
      <div className="hero-grid-lines" aria-hidden="true" />
      <ManufacturingBackdrop part="impeller" />
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span /> {t.hero.eyebrow}</p>
          <h1>{t.hero.h1[0]}<br />{t.hero.h1[1]}<br /><em>{t.hero.h1[2]}</em></h1>
          <p className="hero-lede">{t.hero.lede}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">{t.hero.primary} <Arrow /></a>
            <a className="text-link" href="#services">{t.hero.secondary} <span>↓</span></a>
          </div>
        </div>

        <ProjectCommand command={t.command} />
      </div>
    </section>
  );
}
