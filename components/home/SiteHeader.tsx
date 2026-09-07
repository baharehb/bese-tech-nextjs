import type { Language, Translation } from "@/lib/i18n/translations";
import { Brand } from "./Brand";
import { Arrow } from "./Icons";

function ThemeIcon({ isDark }: { isDark: boolean }) {
  return isDark ? (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type SiteHeaderProps = {
  isDark: boolean;
  isMenuOpen: boolean;
  lang: Language;
  translation: Translation;
  onLanguageToggle: () => void;
  onMenuClose: () => void;
  onMenuToggle: () => void;
  onThemeToggle: () => void;
};

export function SiteHeader({
  isDark,
  isMenuOpen,
  lang,
  translation: t,
  onLanguageToggle,
  onMenuClose,
  onMenuToggle,
  onThemeToggle,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Brand />
        <nav aria-label={t.a11y.mainNavigation}>
          <a href="#process">{t.nav[0]}</a>
          <a href="#services">{t.nav[1]}</a>
          <a href="#why">{t.nav[2]}</a>
        </nav>
        <div className="header-actions">
          <a
            className="button button-small button-outline header-primary-action"
            href="#contact"
          >
            {t.header.discuss} <Arrow />
          </a>

          <button
            onClick={onLanguageToggle}
            className="button button-small button-outline header-utility-action"
            aria-label={t.a11y.switchLanguage}
          >
            {lang === "en" ? "FR" : "EN"}
          </button>

          <button
            onClick={onThemeToggle}
            aria-label={isDark ? t.a11y.useLightTheme : t.a11y.useDarkTheme}
            className="button button-small button-outline header-utility-action"
            title={isDark ? t.a11y.useLightTheme : t.a11y.useDarkTheme}
          >
            <ThemeIcon isDark={isDark} />
          </button>

          <button
            className="hamburger"
            aria-label={isMenuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={onMenuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-nav" id="mobile-navigation">
          <div className="shell">
            <nav aria-label={t.a11y.mobileNavigation}>
              <a href="#process" onClick={onMenuClose}>
                {t.nav[0]}
              </a>
              <a href="#services" onClick={onMenuClose}>
                {t.nav[1]}
              </a>
              <a href="#why" onClick={onMenuClose}>
                {t.nav[2]}
              </a>
              <a href="#contact" onClick={onMenuClose}>
                {t.header.discuss}
              </a>
              <div className="mobile-nav-actions">
                <button
                  className="button button-small button-outline"
                  onClick={() => {
                    onLanguageToggle();
                    onMenuClose();
                  }}
                  aria-label={t.a11y.switchLanguage}
                >
                  {lang === "en" ? "FR" : "EN"}
                </button>
                <button
                  className="button button-small button-outline"
                  onClick={onThemeToggle}
                  aria-label={
                    isDark ? t.a11y.useLightTheme : t.a11y.useDarkTheme
                  }
                  title={
                    isDark ? t.a11y.useLightTheme : t.a11y.useDarkTheme
                  }
                >
                  <ThemeIcon isDark={isDark} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
