import type { Translation } from "@/lib/i18n/translations";
import { Check } from "./Icons";

type ProjectCommandProps = {
  command: Translation["command"];
};

export function ProjectCommand({ command }: ProjectCommandProps) {
  return (
    <div className="command-wrap" aria-label="Illustration of a BeSe Tech managed manufacturing project">
      <div className="command-index" aria-hidden="true">{command.index}</div>
      <article className="command-card">
        <header>
          <div><span className="micro">{command.micro}</span><h2>{command.title}</h2></div>
          <span className="active"><i /> {command.active}</span>
        </header>
        <div className="project-brief">
          <div className="brief-mark"><span>AM</span></div>
          <div><small>{command.briefSmall}</small><strong>{command.briefStrong}</strong><p>{command.briefP}</p></div>
        </div>
        <div className="control-list">
          {command.controls.map(([title, small, status], index) => (
            <div key={title}>
              <span className="control-icon">
                {index < 3 ? <Check /> : <span className="control-icon current">{String(index + 1).padStart(2, "0")}</span>}
              </span>
              <p><strong>{title}</strong><small>{small}</small></p>
              <b className={status === command.controls[3][2] ? "in-progress" : ""}>{status}</b>
            </div>
          ))}
        </div>
        <footer><span>{command.footer[0]}</span><i /><span>{command.footer[1]}</span><i /><span>{command.footer[2]}</span></footer>
      </article>
      <div className="floating-tag tag-one"><span>01</span> {command.tags[0]}</div>
      <div className="floating-tag tag-two"><span>02</span> {command.tags[1]}</div>
    </div>
  );
}
