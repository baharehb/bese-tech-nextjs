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
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  const translation = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      const startDark = saved ? saved === "dark" : prefersDark;
      setIsDark(startDark);
      document.documentElement.classList.toggle("dark", startDark);
    } catch {
      // Local storage can be unavailable in privacy-restricted browsers.
    }
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
      <ContactSection contact={translation.contact} />
      <PromiseSection promise={translation.promise} />
      <SiteFooter footer={translation.footer} />
    </main>
  );
}
