import "server-only";

import type { ContactMessage } from "@/lib/contact/schema";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_ADDRESS = "BeSe Tech Website <website@mail.besetech.ca>";
const TO_ADDRESS = "info@besetech.ca";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function buildTextEmail(message: ContactMessage): string {
  return [
    "New project inquiry from besetech.ca",
    "",
    `Subject: ${message.subject}`,
    `Reply email: ${message.email}`,
    "",
    "Description:",
    message.description,
  ].join("\n");
}

function buildHtmlEmail(message: ContactMessage): string {
  const safeSubject = escapeHtml(message.subject);
  const safeEmail = escapeHtml(message.email);
  const safeDescription = escapeHtml(message.description).replace(/\n/g, "<br />");

  return `
    <main style="font-family:Arial,sans-serif;line-height:1.6;color:#06163a;max-width:680px;margin:0 auto;padding:24px">
      <p style="color:#657388;margin:0 0 8px">New project inquiry from besetech.ca</p>
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 24px">${safeSubject}</h1>
      <p style="margin:0 0 24px"><strong>Reply email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <h2 style="font-size:16px;margin:0 0 8px">Description</h2>
      <p style="margin:0">${safeDescription}</p>
    </main>
  `.trim();
}

export class ResendDeliveryError extends Error {
  constructor(public readonly status: number) {
    super("Resend rejected the email request.");
    this.name = "ResendDeliveryError";
  }
}

export async function deliverContactMessage(
  apiKey: string,
  message: ContactMessage,
): Promise<void> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [TO_ADDRESS],
      reply_to: message.email,
      subject: `[BeSe Tech website] ${message.subject}`,
      text: buildTextEmail(message),
      html: buildHtmlEmail(message),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    // Provider response bodies can change and may contain operational details,
    // so the route logs only the status and never returns provider data to users.
    throw new ResendDeliveryError(response.status);
  }
}
