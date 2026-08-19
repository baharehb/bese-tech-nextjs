"use client";

import { useEffect, useState } from "react";

const linkedIn = "https://ca.linkedin.com/in/behrang-behboodi-115abb7a";

const TRANSLATIONS = {
  en: {
    nav: ["How it works", "Services", "Why BeSe"],
    hero: {
      eyebrow: "Trusted manufacturing execution",
      h1: ["The right part.", "The right partner.", "Delivered with confidence."],
      lede: "BeSe Tech combines supplier qualification, AI-assisted sourcing and project coordination to help advanced manufacturing teams move from requirement to delivery with less risk and greater control.",
      primary: "Start a project conversation",
      secondary: "Explore our services",
    },
    header: { discuss: "Discuss a project" },
    command: {
      index: "BT / PROJECT CONTROL",
      micro: "MANUFACTURING PROJECT",
      title: "Critical component program",
      active: "Active",
      briefSmall: "PROJECT REQUIREMENT",
      briefStrong: "Metal additive · Protected IP",
      briefP: "Technical, commercial and delivery requirements aligned",
      controls: [
        ["Partner fit", "Capability and experience matched", "Confirmed"],
        ["Qualification", "Required evidence reviewed", "Cleared"],
        ["Production plan", "Milestones and ownership defined", "Aligned"],
        ["Execution control", "Quality and delivery monitored", "In progress"],
      ],
      tags: ["VERIFIED PARTNER", "VISIBLE RISK"],
      footer: ["QUALIFY", "COORDINATE", "DELIVER"],
    },
    trust: [
      ["quality", "Quality", "Evidence-led requirements, inspection and documentation"],
      ["security", "Security & IP", "Confidential handling of sensitive project information"],
      ["compliance", "Compliance", "Standards and qualification needs built into the workflow"],
      ["communication", "Transparency", "Clear ownership, decisions, milestones and follow-ups"],
    ],
    journey: [
      ["01", "Share the requirement", "Part, process, timeline and commercial needs"],
      ["02", "Technical review", "Manufacturability, material and process fit"],
      ["03", "Partner matching", "Capabilities and relevant experience compared"],
      ["04", "Qualification", "Evidence, certifications and readiness reviewed"],
      ["05", "Quote & plan", "Clear options, lead times and delivery plan"],
      ["06", "Managed execution", "Production, post-processing and quality control"],
      ["07", "Confident delivery", "Documentation, packaging and delivery coordinated"],
    ],
    journeyFoundation: ["Quality assurance", "Security & IP protection", "Compliance visibility", "Clear communication"],
    services: {
      heading: { eyebrow: "What BeSe Tech delivers", title: "Four services.", subtitle: "One standard of confidence.", desc: "Each service can solve a focused challenge or work as part of a coordinated manufacturing engagement." },
      list: [
        { number: "01", icon: "search", title: "AI-Assisted Sourcing & Quotations", description: "Turn manufacturing requirements into better-informed supplier and production options.", items: ["Compare capabilities, lead times and supplier fit", "Identify efficient manufacturing routes", "Present clearer commercial and technical options"], result: "Faster, stronger sourcing decisions" },
        { number: "02", icon: "audit", title: "Supplier & Buyer Qualification", description: "Create a consistent evidence-based view of readiness on both sides of the project.", items: ["Review capabilities, certifications and quality evidence", "Map buyer requirements and qualification criteria", "Identify gaps, follow-ups and project risks"], result: "Confidence before commitment" },
        { number: "03", icon: "execute", title: "End-to-End Project Execution", description: "Coordinate the manufacturing journey through one accountable point of contact.", items: ["Control scope, milestones and partner communication", "Coordinate production, post-processing and inspection", "Keep quality records and delivery requirements aligned"], result: "One coordinated path to delivery" },
        { number: "04", icon: "consult", title: "Manufacturing Advisory", description: "Bring technical and commercial clarity to complex manufacturing decisions.", items: ["Design for manufacturability guidance", "Material and process selection support", "Audit readiness, supply-chain risk and IP consulting"], result: "Expert support where it matters" },
      ],
    },
    why: {
      eyebrow: "Why BeSe Tech",
      title: "Trust is built into the process—not added at the end.",
      p: "Finding a supplier is only one decision. A successful manufacturing project also requires technical fit, verified readiness, clear accountability and disciplined execution.",
      button: "Talk about your project",
      outcomes: [
        ["Better-informed partner decisions", "Compare real capabilities and evidence, not just claims or directory listings."],
        ["Risk visible before it becomes delay", "Surface qualification gaps, unclear requirements and execution concerns earlier."],
        ["One accountable manufacturing workflow", "Keep technical, commercial, quality and delivery decisions connected."],
        ["AI-supported, human-reviewed", "Use AI for comparison and consistency while experienced judgment remains in the loop."],
      ],
    },
    promise: { eyebrow: "Our promise", title: "Complex manufacturing.", em: "Clearer decisions.", p: "We help you get the right part, from the right partner, with the right controls—on time and with confidence.", button: "Discuss a project" },
    footer: { leftP: "Trusted manufacturing partners.\nQualified, coordinated and ready to deliver.", navTitle: "Explore", navLinks: ["How it works", "Services", "Why BeSe"], contactTitle: "Start a conversation", contactP: "Have a manufacturing challenge or partnership opportunity?", connect: "Connect on LinkedIn", bottom: "Advanced manufacturing · Supplier qualification · Project execution" },
  },
  fr: {
    nav: ["Comment ça marche", "Services", "Pourquoi BeSe"],
    hero: {
      eyebrow: "Exécution de fabrication de confiance",
      h1: ["La bonne pièce.", "Le bon partenaire.", "Livré en toute confiance."],
      lede: "BeSe Tech combine la qualification des fournisseurs, le sourcing assisté par IA et la coordination de projet pour aider les équipes de fabrication avancée à passer de l'exigence à la livraison avec moins de risques et plus de maîtrise.",
      primary: "Commencer une conversation",
      secondary: "Explorer nos services",
    },
    header: { discuss: "Discuter d'un projet" },
    command: {
      index: "BT / CONTRÔLE DU PROJET",
      micro: "PROJET DE FABRICATION",
      title: "Programme de composant critique",
      active: "Actif",
      briefSmall: "EXIGENCE DU PROJET",
      briefStrong: "Additif métallique · IP protégé",
      briefP: "Exigences techniques, commerciales et de livraison alignées",
      controls: [
        ["Adéquation du partenaire", "Capacité et expérience vérifiées", "Confirmé"],
        ["Qualification", "Preuves requises examinées", "Validé"],
        ["Plan de production", "Jalons et responsabilités définis", "Aligné"],
        ["Contrôle d'exécution", "Qualité et livraison surveillées", "En cours"],
      ],
      tags: ["PARTENAIRE VÉRIFIÉ", "RISQUE VISIBLE"],
      footer: ["QUALIFIER", "COORDONNER", "LIVRER"],
    },
    trust: [
      ["quality", "Qualité", "Exigences, inspections et documentation fondées sur des preuves"],
      ["security", "Sécurité & IP", "Traitement confidentiel des informations sensibles du projet"],
      ["compliance", "Conformité", "Normes et besoins de qualification intégrés au workflow"],
      ["communication", "Transparence", "Propriété claire, décisions, jalons et suivis"],
    ],
    journey: [
      ["01", "Partager l'exigence", "Pièce, processus, calendrier et besoins commerciaux"],
      ["02", "Revue technique", "Fabricabilité, adéquation des matériaux et procédés"],
      ["03", "Appariement des partenaires", "Capacités et expériences pertinentes comparées"],
      ["04", "Qualification", "Preuves, certifications et préparation examinées"],
      ["05", "Devis & plan", "Options claires, délais et plan de livraison"],
      ["06", "Exécution gérée", "Production, post-traitement et contrôle qualité"],
      ["07", "Livraison en confiance", "Documentation, emballage et livraison coordonnés"],
    ],
    journeyFoundation: ["Assurance qualité", "Sécurité & protection IP", "Visibilité conformité", "Communication claire"],
    services: {
      heading: { eyebrow: "Ce que BeSe Tech fournit", title: "Quatre services.", subtitle: "Un standard de confiance.", desc: "Chaque service peut résoudre un défi ciblé ou fonctionner dans le cadre d'un engagement manufacturier coordonné." },
      list: [
        { number: "01", icon: "search", title: "Sourcing et devis assistés par IA", description: "Transformer les exigences de fabrication en options fournisseurs et de production mieux informées.", items: ["Comparer capacités, délais et adéquation des fournisseurs", "Identifier des voies de fabrication efficaces", "Présenter des options commerciales et techniques plus claires"], result: "Décisions d'approvisionnement plus rapides et plus solides" },
        { number: "02", icon: "audit", title: "Qualification fournisseur & acheteur", description: "Établir une vision cohérente et fondée sur des preuves de l'état de préparation des deux côtés du projet.", items: ["Examiner capacités, certifications et preuves qualité", "Cartographier exigences acheteur et critères de qualification", "Identifier écarts, suivis et risques projet"], result: "Confiance avant engagement" },
        { number: "03", icon: "execute", title: "Exécution de projet de bout en bout", description: "Coordonner le parcours de fabrication via un point de contact responsable.", items: ["Gérer périmètre, jalons et communication", "Coordonner production, post-traitement et inspection", "Conserver les enregistrements qualité et exigences de livraison alignés"], result: "Un parcours coordonné vers la livraison" },
        { number: "04", icon: "consult", title: "Conseil en fabrication", description: "Apporter clarté technique et commerciale pour des décisions complexes de fabrication.", items: ["Conseils pour la fabricabilité", "Aide au choix des matériaux et procédés", "Audit de préparation, gestion des risques et IP"], result: "Soutien expert là où il compte" },
      ],
    },
    why: {
      eyebrow: "Pourquoi BeSe Tech",
      title: "La confiance est intégrée au processus — pas ajoutée à la fin.",
      p: "Trouver un fournisseur n'est qu'une décision. Un projet de fabrication réussi nécessite aussi une adéquation technique, une disponibilité vérifiée, une responsabilité claire et une exécution rigoureuse.",
      button: "Parlons de votre projet",
      outcomes: [
        ["Décisions partenaires mieux informées", "Comparer des capacités et preuves réelles, pas seulement des déclarations ou des annuaires."],
        ["Risques visibles avant qu'ils ne causent retard", "Faire ressortir les lacunes de qualification, exigences floues et préoccupations d'exécution plus tôt."],
        ["Un workflow de fabrication responsable", "Maintenir les décisions techniques, commerciales, qualité et livraison connectées."],
        ["IA assistée, revue humaine", "Utiliser l'IA pour comparer et maintenir la cohérence, tout en conservant le jugement humain expérimenté."],
      ],
    },
    promise: { eyebrow: "Notre promesse", title: "Fabrication complexe.", em: "Décisions plus claires.", p: "Nous vous aidons à obtenir la bonne pièce, du bon partenaire, avec les bons contrôles — à temps et en toute confiance.", button: "Discuter d'un projet" },
    footer: { leftP: "Partenaires de fabrication de confiance.\nQualifiés, coordonnés et prêts à livrer.", navTitle: "Explorer", navLinks: ["Comment ça marche", "Services", "Pourquoi BeSe"], contactTitle: "Commencer une conversation", contactP: "Vous avez un défi de fabrication ou une opportunité de partenariat ?", connect: "Connectez-vous sur LinkedIn", bottom: "Fabrication avancée · Qualification des fournisseurs · Exécution de projet" },
  },
} as const;

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" fill="none">
      <path d="m4.5 9.4 2.7 2.7 6.3-6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Icon({ name }: { name: "search" | "audit" | "execute" | "consult" | "quality" | "security" | "compliance" | "communication" }) {
  const paths = {
    search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4M4 4h5M4 7h3" /></>,
    audit: <><path d="M8 4h8l3 3v13H8z" /><path d="M16 4v4h4M11 12l2 2 4-4M4 8v12" /></>,
    execute: <><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
    consult: <><circle cx="9" cy="8" r="4" /><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M17 8h4M19 6v4" /></>,
    quality: <><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    security: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    compliance: <><path d="M7 3h10l3 3v15H7z" /><path d="M17 3v4h4M10 12h7M10 16h7" /></>,
    communication: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="BeSe Tech home">
      <span className="brand-mark" aria-hidden="true"><i /><b /></span>
      <span>BeSe <strong>Tech</strong></span>
    </a>
  );
}

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>("en");

  useEffect(() => {
    try {
      const s = localStorage.getItem("lang");
      if (s === "fr" || s === "en") setLang(s as keyof typeof TRANSLATIONS);
    } catch {}
  }, []);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const startDark = saved ? saved === "dark" : prefersDark;
      setIsDark(startDark);
      document.documentElement.classList.toggle("dark", startDark);
    } catch (e) {
      // ignore
    }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch (e) {}
  }

  function toggleMenu() {
    setShowMenu((s) => !s);
  }

  function toggleLang() {
    const next = lang === "en" ? "fr" : "en";
    setLang(next);
    try { localStorage.setItem("lang", next); } catch {}
  }

  return (
      <main id="top">
      <header className="site-header">
        <div className="shell nav-wrap">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#process">{t.nav[0]}</a>
            <a href="#services">{t.nav[1]}</a>
            <a href="#why">{t.nav[2]}</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a className="button button-small button-outline" href={linkedIn} target="_blank" rel="noreferrer">{t.header.discuss} <Arrow /></a>

            <button onClick={toggleLang} className="button button-small button-outline" aria-label="Switch language">{lang.toUpperCase()}</button>

            <button onClick={toggleTheme} aria-label="Basculer le thème" className="button button-small button-outline" title="Basculer le thème">
              {isDark ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4" strokeWidth="1.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>

            <button className="hamburger" aria-label="Basculer le menu" onClick={toggleMenu} aria-expanded={showMenu}>
              {showMenu ? (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"><path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="mobile-nav" role="dialog" aria-modal="true">
            <div className="shell">
              <nav>
                <a href="#process" onClick={() => setShowMenu(false)}>{t.nav[0]}</a>
                <a href="#services" onClick={() => setShowMenu(false)}>{t.nav[1]}</a>
                <a href="#why" onClick={() => setShowMenu(false)}>{t.nav[2]}</a>
              </nav>
            </div>
          </div>
        )}
      </header>

      <section className="hero section-pad">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="shell hero-grid">
            <div className="hero-copy">
            <p className="eyebrow"><span /> {t.hero.eyebrow}</p>
            <h1>{t.hero.h1[0]}<br />{t.hero.h1[1]}<br /><em>{t.hero.h1[2]}</em></h1>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={linkedIn} target="_blank" rel="noreferrer">{t.hero.primary} <Arrow /></a>
              <a className="text-link" href="#services">{t.hero.secondary} <span>↓</span></a>
            </div>
          </div>

          <div className="command-wrap" aria-label="Illustration of a BeSe Tech managed manufacturing project">
            <div className="command-index" aria-hidden="true">{t.command.index}</div>
            <article className="command-card">
              <header>
                  <div><span className="micro">{t.command.micro}</span><h2>{t.command.title}</h2></div>
                  <span className="active"><i /> {t.command.active}</span>
              </header>
              <div className="project-brief">
                  <div className="brief-mark"><span>AM</span></div>
                  <div><small>{t.command.briefSmall}</small><strong>{t.command.briefStrong}</strong><p>{t.command.briefP}</p></div>
              </div>
              <div className="control-list">
                {t.command.controls.map(([title, small, status], idx) => (
                  <div key={idx}><span className="control-icon">{idx < 3 ? <Check /> : <span className="control-icon current">{String(idx+1).padStart(2,'0')}</span>}</span><p><strong>{title}</strong><small>{small}</small></p><b className={status === t.command.controls[3][2] ? 'in-progress' : ''}>{status}</b></div>
                ))}
              </div>
              <footer><span>{t.command.footer[0]}</span><i /><span>{t.command.footer[1]}</span><i /><span>{t.command.footer[2]}</span></footer>
            </article>
              <div className="floating-tag tag-one"><span>01</span> {t.command.tags[0]}</div>
              <div className="floating-tag tag-two"><span>02</span> {t.command.tags[1]}</div>
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="BeSe Tech trust principles">
        <div className="shell trust-bar-grid">
          {t.trust.map(([icon, title, description]) => (
            <article key={title}><span className="trust-icon"><Icon name={icon as any} /></span><div><strong>{title}</strong><p>{description}</p></div></article>
          ))}
        </div>
      </section>

      <section className="journey section-pad" id="process">
        <div className="shell">
          <div className="section-heading centered">
            <p className="eyebrow"><span /> Un flux de travail connecté</p>
            <h2>Du besoin de fabrication<br />à la pièce livrée.</h2>
            <p>BeSe Tech relie des décisions souvent fragmentées entre sourcing, qualification, ingénierie, qualité et gestion de projet.</p>
          </div>
          <ol className="journey-grid">
            {t.journey.map(([number, title, description]) => (
              <li key={number}>
                <div className="journey-number">{number}</div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="journey-arrow" aria-hidden="true"><Arrow /></span>
              </li>
            ))}
          </ol>
          <div className="journey-foundation">
            <span>Assurance qualité</span><span>Sécurité & protection IP</span><span>Visibilité conformité</span><span>Communication claire</span>
          </div>
        </div>
      </section>

      <section className="services section-pad" id="services">
        <div className="shell">
          <div className="section-heading services-heading">
            <div><p className="eyebrow eyebrow-light"><span /> Ce que BeSe Tech fournit</p><h2>Quatre services.<br />Un standard de confiance.</h2></div>
            <p>Chaque service peut résoudre un défi ciblé ou fonctionner dans le cadre d'un engagement manufacturier coordonné.</p>
          </div>
          <div className="services-grid">
            {t.services.list.map((service) => (
              <article className="service-card" key={service.number}>
                <header><span className="service-icon"><Icon name={service.icon as any} /></span><span className="service-number">{service.number}</span></header>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul>{service.items.map((item) => <li key={item}><span><Check /></span>{item}</li>)}</ul>
                <footer><span>Outcome</span><strong>{service.result}</strong></footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why section-pad" id="why">
        <div className="shell why-grid">
          <div className="why-copy">
            <p className="eyebrow"><span /> Pourquoi BeSe Tech</p>
            <h2>La confiance est intégrée au processus — pas ajoutée à la fin.</h2>
            <p>Trouver un fournisseur n'est qu'une décision. Un projet de fabrication réussi nécessite aussi une adéquation technique, une disponibilité vérifiée, une responsabilité claire et une exécution rigoureuse.</p>
            <a className="button button-primary" href={linkedIn} target="_blank" rel="noreferrer">Parlons de votre projet <Arrow /></a>
          </div>
          <div className="outcomes">
            {t.why.outcomes.map((out, i) => (
              <article key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{out[0]}</h3><p>{out[1]}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="promise">
        <div className="shell promise-inner">
          <div className="promise-mark" aria-hidden="true"><span /><i /></div>
          <div><p className="eyebrow eyebrow-light"><span /> Notre promesse</p><h2>Fabrication complexe.<br /><em>Décisions plus claires.</em></h2><p>Nous vous aidons à obtenir la bonne pièce, du bon partenaire, avec les bons contrôles — à temps et en toute confiance.</p></div>
          <a className="button button-white" href={linkedIn} target="_blank" rel="noreferrer">Discuter d'un projet <Arrow /></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-main">
          <div><Brand /><p>Partenaires de fabrication de confiance.<br />Qualifiés, coordonnés et prêts à livrer.</p></div>
          <div className="footer-nav"><strong>Explorer</strong><a href="#process">Comment ça marche</a><a href="#services">Services</a><a href="#why">Pourquoi BeSe</a></div>
          <div className="footer-contact"><strong>Commencer une conversation</strong><p>Vous avez un défi de fabrication ou une opportunité de partenariat ?</p><a href={linkedIn} target="_blank" rel="noreferrer">Connectez-vous sur LinkedIn <Arrow /></a></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 BeSe Tech</span><span>Fabrication avancée · Qualification des fournisseurs · Exécution de projet</span></div>
      </footer>
    </main>
  );
}
