import type { Translation } from "@/lib/i18n/translations";
import { Brand } from "./Brand";
import { Arrow } from "./Icons";

const LINKED_IN_URL = "https://www.linkedin.com/company/besetech/";

export function SiteFooter({ footer }: { footer: Translation["footer"] }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Brand />
          <p>{footer.leftP.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
        </div>
        <div className="footer-nav">
          <strong>{footer.navTitle}</strong>
          <a href="#process">{footer.navLinks[0]}</a>
          <a href="#services">{footer.navLinks[1]}</a>
          <a href="#why">{footer.navLinks[2]}</a>
        </div>
        <div className="footer-contact">
          <strong>{footer.contactTitle}</strong>
          <p>{footer.contactP}</p>
          <a href="#contact">{footer.connect} <Arrow /></a>
          <a href={LINKED_IN_URL} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
        </div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 BeSe Tech</span><span>{footer.bottom}</span></div>
    </footer>
  );
}
