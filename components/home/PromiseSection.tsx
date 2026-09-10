import type { Translation } from "@/lib/i18n/translations";
import { Arrow } from "./Icons";

export function PromiseSection({ promise }: { promise: Translation["promise"] }) {
  return (
    <section className="promise">
      <div className="shell promise-inner">
        <div className="promise-mark" aria-hidden="true"><span /><i /></div>
        <div><p className="eyebrow eyebrow-light"><span /> {promise.eyebrow}</p><h2>{promise.title}<br /><em>{promise.em}</em></h2><p>{promise.p}</p></div>
        <a className="button button-white" href="#contact">{promise.button} <Arrow /></a>
      </div>
    </section>
  );
}
