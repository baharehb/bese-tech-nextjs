"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_LIMITS } from "@/lib/contact/schema";
import type { Translation } from "@/lib/i18n/translations";
import { Arrow } from "./Icons";
import { ManufacturingBackdrop } from "./ManufacturingBackdrop";

type ContactSectionProps = {
  contact: Translation["contact"];
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactSection({ contact }: ContactSectionProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submitContactForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitState === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: data.get("subject"),
          email: data.get("email"),
          description: data.get("description"),
          website: data.get("website"),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: { code?: string };
        } | null;
        const message =
          body?.error?.code === "RATE_LIMITED"
            ? contact.rateLimit
            : contact.error;
        throw new Error(message);
      }

      form.reset();
      setSubmitState("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : contact.error);
      setSubmitState("error");
    }
  }

  function clearCompletedStatus() {
    if (submitState === "success" || submitState === "error") {
      setSubmitState("idle");
      setErrorMessage("");
    }
  }

  return (
    <section className="contact section-pad" id="contact">
      <div className="shell contact-grid">
        <div className="contact-copy">
          <p className="eyebrow"><span /> {contact.eyebrow}</p>
          <h2>{contact.title}</h2>
          <p>{contact.p}</p>
          <a href="mailto:info@besetech.ca">info@besetech.ca</a>
          <ManufacturingBackdrop part="bracket" />
        </div>
        <form
          className="contact-form"
          onSubmit={submitContactForm}
          onChange={clearCompletedStatus}
          aria-busy={submitState === "submitting"}
        >
          <label className="contact-honeypot" aria-hidden="true">
            <span>Website</span>
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
          <label>
            <span>{contact.subject}</span>
            <input
              name="subject"
              type="text"
              placeholder={contact.subjectPlaceholder}
              required
              minLength={CONTACT_LIMITS.subject.min}
              maxLength={CONTACT_LIMITS.subject.max}
              disabled={submitState === "submitting"}
            />
          </label>
          <label>
            <span>{contact.email}</span>
            <input
              name="email"
              type="email"
              placeholder={contact.emailPlaceholder}
              required
              maxLength={CONTACT_LIMITS.email.max}
              autoComplete="email"
              disabled={submitState === "submitting"}
            />
          </label>
          <label>
            <span>{contact.description}</span>
            <textarea
              name="description"
              placeholder={contact.descriptionPlaceholder}
              required
              rows={7}
              minLength={CONTACT_LIMITS.description.min}
              maxLength={CONTACT_LIMITS.description.max}
              disabled={submitState === "submitting"}
            />
          </label>
          <button
            className="button button-primary"
            type="submit"
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting" ? contact.sending : contact.send}{" "}
            <Arrow />
          </button>
          <div
            className={`contact-status ${submitState}`}
            aria-live="polite"
            role={submitState === "error" ? "alert" : "status"}
          >
            {submitState === "success" && contact.success}
            {submitState === "error" && errorMessage}
          </div>
          <small>{contact.note}</small>
        </form>
      </div>
    </section>
  );
}
