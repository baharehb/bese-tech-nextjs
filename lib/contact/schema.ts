export const CONTACT_LIMITS = {
  subject: { min: 3, max: 120 },
  email: { max: 254 },
  description: { min: 20, max: 5_000 },
} as const;

export type ContactField = "subject" | "email" | "description" | "website";

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactMessage = {
  subject: string;
  email: string;
  description: string;
};

export type ContactPayloadResult =
  | { ok: true; isSpam: true }
  | { ok: true; isSpam: false; message: ContactMessage }
  | { ok: false; message: string; fieldErrors?: ContactFieldErrors };

const ALLOWED_FIELDS = new Set<ContactField>([
  "subject",
  "email",
  "description",
  "website",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function normalizeMultiline(value: string): string {
  return value.replace(/\r\n?/g, "\n").trim().normalize("NFC");
}

function normalizeSubject(value: string): string {
  return value.replace(/\s+/g, " ").trim().normalize("NFC");
}

function normalizeEmail(value: string): string {
  const normalized = value.trim().normalize("NFC");
  const atIndex = normalized.lastIndexOf("@");
  if (atIndex <= 0) return normalized;

  // Domain names are case-insensitive. The local part technically is not, so
  // preserve it exactly instead of lowercasing the visitor's entire address.
  return `${normalized.slice(0, atIndex)}@${normalized.slice(atIndex + 1).toLowerCase()}`;
}

function isValidEmail(value: string): boolean {
  const atIndex = value.lastIndexOf("@");
  if (atIndex <= 0 || atIndex !== value.indexOf("@")) {
    return false;
  }

  const localPart = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);

  return (
    localPart.length <= 64 &&
    domain.length <= 253 &&
    domain.includes(".") &&
    !value.includes("..") &&
    !/[\s\u0000-\u001f\u007f-\u009f]/u.test(value) &&
    /^[^@]+@[^@]+$/u.test(value)
  );
}

export function parseContactPayload(value: unknown): ContactPayloadResult {
  if (!isPlainObject(value)) {
    return { ok: false, message: "The request body must be a JSON object." };
  }

  const unknownFields = Object.keys(value).filter(
    (field) => !ALLOWED_FIELDS.has(field as ContactField),
  );

  if (unknownFields.length > 0) {
    return { ok: false, message: "The request contains unsupported fields." };
  }

  const website = value.website;
  if (website !== undefined && typeof website !== "string") {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: { website: "Website must be text." },
    };
  }

  // Real visitors never see or fill this field. Returning an ordinary success
  // response gives basic form-filling bots no feedback about the spam check.
  if (typeof website === "string" && website.trim().length > 0) {
    return { ok: true, isSpam: true };
  }

  const fieldErrors: ContactFieldErrors = {};
  const subject =
    typeof value.subject === "string" ? normalizeSubject(value.subject) : "";
  const email =
    typeof value.email === "string" ? normalizeEmail(value.email) : "";
  const description =
    typeof value.description === "string"
      ? normalizeMultiline(value.description)
      : "";

  if (subject.length < CONTACT_LIMITS.subject.min) {
    fieldErrors.subject = `Subject must be at least ${CONTACT_LIMITS.subject.min} characters.`;
  } else if (subject.length > CONTACT_LIMITS.subject.max) {
    fieldErrors.subject = `Subject must be no more than ${CONTACT_LIMITS.subject.max} characters.`;
  } else if (/[\u0000-\u001f\u007f-\u009f]/u.test(subject)) {
    fieldErrors.subject = "Subject contains unsupported control characters.";
  }

  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (
    email.length > CONTACT_LIMITS.email.max ||
    !isValidEmail(email)
  ) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (description.length < CONTACT_LIMITS.description.min) {
    fieldErrors.description = `Description must be at least ${CONTACT_LIMITS.description.min} characters.`;
  } else if (description.length > CONTACT_LIMITS.description.max) {
    fieldErrors.description = `Description must be no more than ${CONTACT_LIMITS.description.max} characters.`;
  } else if (
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/u.test(description)
  ) {
    fieldErrors.description =
      "Description contains unsupported control characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    isSpam: false,
    message: { subject, email, description },
  };
}
