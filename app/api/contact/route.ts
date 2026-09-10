import { NextRequest, NextResponse } from "next/server";

import {
  checkContactRateLimit,
  getClientIdentifier,
} from "@/lib/contact/rate-limit";
import {
  parseContactPayload,
  type ContactFieldErrors,
} from "@/lib/contact/schema";
import {
  deliverContactMessage,
  ResendDeliveryError,
} from "@/lib/contact/resend";

export const runtime = "nodejs";

// Allows the validated character limits even when the message uses multi-byte
// Unicode, while still rejecting unexpectedly large request bodies early.
const MAX_REQUEST_BYTES = 32_000;

type ContactApiErrorCode =
  | "UNSUPPORTED_MEDIA_TYPE"
  | "INVALID_ORIGIN"
  | "PAYLOAD_TOO_LARGE"
  | "INVALID_JSON"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "SERVER_CONFIGURATION_ERROR"
  | "EMAIL_SERVICE_ERROR";

type ContactApiError = {
  ok: false;
  error: {
    code: ContactApiErrorCode;
    message: string;
    fieldErrors?: ContactFieldErrors;
  };
};

function errorResponse(
  status: number,
  code: ContactApiErrorCode,
  message: string,
  options?: {
    fieldErrors?: ContactFieldErrors;
    headers?: HeadersInit;
  },
) {
  const body: ContactApiError = {
    ok: false,
    error: {
      code,
      message,
      ...(options?.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
    },
  };

  return NextResponse.json(body, {
    status,
    headers: options?.headers,
  });
}

function isSameOrigin(request: NextRequest): boolean {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return false;

  try {
    return new URL(originHeader).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return errorResponse(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "Content-Type must be application/json.",
    );
  }

  // This blocks cross-site browser submissions. It complements validation and
  // throttling; it is not authentication because non-browser clients can forge it.
  if (!isSameOrigin(request)) {
    return errorResponse(
      403,
      "INVALID_ORIGIN",
      "This form can only be submitted from the BeSe Tech website.",
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return errorResponse(
      413,
      "PAYLOAD_TOO_LARGE",
      "The request is too large.",
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return errorResponse(400, "INVALID_JSON", "The request body is invalid.");
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return errorResponse(
      413,
      "PAYLOAD_TOO_LARGE",
      "The request is too large.",
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return errorResponse(400, "INVALID_JSON", "The request body is not valid JSON.");
  }

  const parsed = parseContactPayload(payload);
  if (!parsed.ok) {
    return errorResponse(400, "VALIDATION_ERROR", parsed.message, {
      fieldErrors: parsed.fieldErrors,
    });
  }

  if (parsed.isSpam) {
    return NextResponse.json({ ok: true as const });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact API is missing RESEND_API_KEY.");
    return errorResponse(
      503,
      "SERVER_CONFIGURATION_ERROR",
      "The contact form is temporarily unavailable.",
    );
  }

  const rateLimit = checkContactRateLimit(getClientIdentifier(request));
  if (!rateLimit.allowed) {
    return errorResponse(
      429,
      "RATE_LIMITED",
      "Too many messages were submitted. Please try again later.",
      {
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  try {
    await deliverContactMessage(apiKey, parsed.message);
  } catch (error) {
    if (error instanceof ResendDeliveryError) {
      console.error("Resend contact delivery failed with status:", error.status);
    } else {
      console.error("Contact email delivery failed:", error);
    }

    return errorResponse(
      502,
      "EMAIL_SERVICE_ERROR",
      "Your message could not be sent. Please try again later.",
    );
  }

  return NextResponse.json({ ok: true as const });
}
