"use client";

import { useEffect, useState } from "react";
import { TRANSLATIONS, type Language } from "@/lib/i18n/translations";
import { ContactSection } from "./ContactSection";
import { Hero } from "./Hero";
import { JourneySection } from "./JourneySection";
import { PromiseSection } from "./PromiseSection";
import { ServicesSection } from "./ServicesSection";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { TrustBar } from "./TrustBar";
import { WhySection } from "./WhySection";

export function HomePage() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  const translation = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const startDark = saved ? saved === "dark" : true;
      setIsDark(startDark);
      document.documentElement.classList.toggle("dark", startDark);
    } catch {
      // Local storage can be unavailable in privacy-restricted browsers.
    }
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const revealTargets = document.querySelectorAll<HTMLElement>(
      ".section-heading, .journey-grid li, .journey-foundation span, .service-card, .why-copy, .outcomes article, .contact-copy, .contact-form, .promise-inner > *",
    );

    revealTargets.forEach((element, index) => {
      element.classList.add("motion-reveal");
      element.style.setProperty("--reveal-order", String(index % 7));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7%" },
    );

    revealTargets.forEach((element) => observer.observe(element));

    const serviceCards = document.querySelectorAll<HTMLElement>(".service-card");
    const updateSpotlight = (event: Event) => {
      const pointer = event as PointerEvent;
      const card = pointer.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${pointer.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${pointer.clientY - rect.top}px`);
    };
    serviceCards.forEach((card) => card.addEventListener("pointermove", updateSpotlight));

    return () => {
      observer.disconnect();
      serviceCards.forEach((card) => card.removeEventListener("pointermove", updateSpotlight));
    };
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Keep the in-memory selection when local storage is unavailable.
    }
  }

  function toggleLanguage() {
    setLang((current) => current === "en" ? "fr" : "en");
  }

  return (
    <main id="top">
      <SiteHeader
        isDark={isDark}
        isMenuOpen={isMenuOpen}
        lang={lang}
        translation={translation}
        onLanguageToggle={toggleLanguage}
        onMenuClose={() => setIsMenuOpen(false)}
        onMenuToggle={() => setIsMenuOpen((current) => !current)}
        onThemeToggle={toggleTheme}
      />
      <Hero translation={translation} />
      <TrustBar trust={translation.trust} />
      <JourneySection
        journey={translation.journey}
        foundation={translation.journeyFoundation}
        heading={translation.journeyHeading}
      />
      <ServicesSection lang={lang} services={translation.services} />
      <WhySection why={translation.why} />
      <PromiseSection promise={translation.promise} />
      <ContactSection contact={translation.contact} />
      <SiteFooter footer={translation.footer} />
    </main>
  );
}
