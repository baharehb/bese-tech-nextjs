"use client";

import { useEffect, useState } from "react";

const linkedIn = "https://ca.linkedin.com/in/behrang-behboodi-115abb7a";

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

const journey = [
  ["01", "Share the requirement", "Part, process, timeline and commercial needs"],
  ["02", "Technical review", "Manufacturability, material and process fit"],
  ["03", "Partner matching", "Capabilities and relevant experience compared"],
  ["04", "Qualification", "Evidence, certifications and readiness reviewed"],
  ["05", "Quote & plan", "Clear options, lead times and delivery plan"],
  ["06", "Managed execution", "Production, post-processing and quality control"],
  ["07", "Confident delivery", "Documentation, packaging and delivery coordinated"],
];

const services = [
  {
    number: "01",
    icon: "search" as const,
    title: "AI-Assisted Sourcing & Quotations",
    description: "Turn manufacturing requirements into better-informed supplier and production options.",
    items: ["Compare capabilities, lead times and supplier fit", "Identify efficient manufacturing routes", "Present clearer commercial and technical options"],
    result: "Faster, stronger sourcing decisions",
  },
  {
    number: "02",
    icon: "audit" as const,
    title: "Supplier & Buyer Qualification",
    description: "Create a consistent evidence-based view of readiness on both sides of the project.",
    items: ["Review capabilities, certifications and quality evidence", "Map buyer requirements and qualification criteria", "Identify gaps, follow-ups and project risks"],
    result: "Confidence before commitment",
  },
  {
    number: "03",
    icon: "execute" as const,
    title: "End-to-End Project Execution",
    description: "Coordinate the manufacturing journey through one accountable point of contact.",
    items: ["Control scope, milestones and partner communication", "Coordinate production, post-processing and inspection", "Keep quality records and delivery requirements aligned"],
    result: "One coordinated path to delivery",
  },
  {
    number: "04",
    icon: "consult" as const,
    title: "Manufacturing Advisory",
    description: "Bring technical and commercial clarity to complex manufacturing decisions.",
    items: ["Design for manufacturability guidance", "Material and process selection support", "Audit readiness, supply-chain risk and IP consulting"],
    result: "Expert support where it matters",
  },
];

const trust = [
  ["quality" as const, "Quality", "Evidence-led requirements, inspection and documentation"],
  ["security" as const, "Security & IP", "Confidential handling of sensitive project information"],
  ["compliance" as const, "Compliance", "Standards and qualification needs built into the workflow"],
  ["communication" as const, "Transparency", "Clear ownership, decisions, milestones and follow-ups"],
] as const;

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <main id="top">
      <header className="site-header">
        <div className="shell nav-wrap">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#process">How it works</a>
            <a href="#services">Services</a>
            <a href="#why">Why BeSe</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={toggleTheme} aria-label="Toggle color theme" className="button button-small button-white" title="Toggle theme">
              {isDark ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4" strokeWidth="1.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>

            <a className="button button-small button-outline" href={linkedIn} target="_blank" rel="noreferrer">Discuss a project <Arrow /></a>

            <button className="hamburger" aria-label="Toggle menu" onClick={toggleMenu} aria-expanded={showMenu}>
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
                <a href="#process" onClick={() => setShowMenu(false)}>How it works</a>
                <a href="#services" onClick={() => setShowMenu(false)}>Services</a>
                <a href="#why" onClick={() => setShowMenu(false)}>Why BeSe</a>
              </nav>
            </div>
          </div>
        )}
      </header>

      <section className="hero section-pad">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Trusted manufacturing execution</p>
            <h1>The right part.<br />The right partner.<br /><em>Delivered with confidence.</em></h1>
            <p className="hero-lede">BeSe Tech combines supplier qualification, AI-assisted sourcing and project coordination to help advanced manufacturing teams move from requirement to delivery with less risk and greater control.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={linkedIn} target="_blank" rel="noreferrer">Start a project conversation <Arrow /></a>
              <a className="text-link" href="#services">Explore our services <span>↓</span></a>
            </div>
          </div>

          <div className="command-wrap" aria-label="Illustration of a BeSe Tech managed manufacturing project">
            <div className="command-index" aria-hidden="true">BT / PROJECT CONTROL</div>
            <article className="command-card">
              <header>
                <div><span className="micro">MANUFACTURING PROJECT</span><h2>Critical component program</h2></div>
                <span className="active"><i /> Active</span>
              </header>
              <div className="project-brief">
                <div className="brief-mark"><span>AM</span></div>
                <div><small>PROJECT REQUIREMENT</small><strong>Metal additive · Protected IP</strong><p>Technical, commercial and delivery requirements aligned</p></div>
              </div>
              <div className="control-list">
                <div><span className="control-icon"><Check /></span><p><strong>Partner fit</strong><small>Capability and experience matched</small></p><b>Confirmed</b></div>
                <div><span className="control-icon"><Check /></span><p><strong>Qualification</strong><small>Required evidence reviewed</small></p><b>Cleared</b></div>
                <div><span className="control-icon"><Check /></span><p><strong>Production plan</strong><small>Milestones and ownership defined</small></p><b>Aligned</b></div>
                <div><span className="control-icon current">04</span><p><strong>Execution control</strong><small>Quality and delivery monitored</small></p><b className="in-progress">In progress</b></div>
              </div>
              <footer><span>QUALIFY</span><i /><span>COORDINATE</span><i /><span>DELIVER</span></footer>
            </article>
            <div className="floating-tag tag-one"><span>01</span> VERIFIED PARTNER</div>
            <div className="floating-tag tag-two"><span>02</span> VISIBLE RISK</div>
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="BeSe Tech trust principles">
        <div className="shell trust-bar-grid">
          {trust.map(([icon, title, description]) => (
            <article key={title}><span className="trust-icon"><Icon name={icon} /></span><div><strong>{title}</strong><p>{description}</p></div></article>
          ))}
        </div>
      </section>

      <section className="journey section-pad" id="process">
        <div className="shell">
          <div className="section-heading centered">
            <p className="eyebrow"><span /> One connected workflow</p>
            <h2>From manufacturing need<br />to delivered part.</h2>
            <p>BeSe Tech connects decisions that are often fragmented across sourcing, qualification, engineering, quality and project management.</p>
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
            <span>Quality assurance</span><span>Security & IP protection</span><span>Compliance visibility</span><span>Clear communication</span>
          </div>
        </div>
      </section>

      <section className="services section-pad" id="services">
        <div className="shell">
          <div className="section-heading services-heading">
            <div><p className="eyebrow eyebrow-light"><span /> What BeSe Tech delivers</p><h2>Four services.<br />One standard of confidence.</h2></div>
            <p>Each service can solve a focused challenge or work as part of a coordinated manufacturing engagement.</p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <header><span className="service-icon"><Icon name={service.icon} /></span><span className="service-number">{service.number}</span></header>
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
            <p className="eyebrow"><span /> Why BeSe Tech</p>
            <h2>Trust is built into the process—not added at the end.</h2>
            <p>Finding a supplier is only one decision. A successful manufacturing project also requires technical fit, verified readiness, clear accountability and disciplined execution.</p>
            <a className="button button-primary" href={linkedIn} target="_blank" rel="noreferrer">Talk about your project <Arrow /></a>
          </div>
          <div className="outcomes">
            <article><span>01</span><div><h3>Better-informed partner decisions</h3><p>Compare real capabilities and evidence, not just claims or directory listings.</p></div></article>
            <article><span>02</span><div><h3>Risk visible before it becomes delay</h3><p>Surface qualification gaps, unclear requirements and execution concerns earlier.</p></div></article>
            <article><span>03</span><div><h3>One accountable manufacturing workflow</h3><p>Keep technical, commercial, quality and delivery decisions connected.</p></div></article>
            <article><span>04</span><div><h3>AI-supported, human-reviewed</h3><p>Use AI for comparison and consistency while experienced judgment remains in the loop.</p></div></article>
          </div>
        </div>
      </section>

      <section className="promise">
        <div className="shell promise-inner">
          <div className="promise-mark" aria-hidden="true"><span /><i /></div>
          <div><p className="eyebrow eyebrow-light"><span /> Our promise</p><h2>Complex manufacturing.<br /><em>Clearer decisions.</em></h2><p>We help you get the right part, from the right partner, with the right controls—on time and with confidence.</p></div>
          <a className="button button-white" href={linkedIn} target="_blank" rel="noreferrer">Discuss a project <Arrow /></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-main">
          <div><Brand /><p>Trusted manufacturing partners.<br />Qualified, coordinated and ready to deliver.</p></div>
          <div className="footer-nav"><strong>Explore</strong><a href="#process">How it works</a><a href="#services">Services</a><a href="#why">Why BeSe</a></div>
          <div className="footer-contact"><strong>Start a conversation</strong><p>Have a manufacturing challenge or partnership opportunity?</p><a href={linkedIn} target="_blank" rel="noreferrer">Connect on LinkedIn <Arrow /></a></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 BeSe Tech</span><span>Advanced manufacturing · Supplier qualification · Project execution</span></div>
      </footer>
    </main>
  );
}
