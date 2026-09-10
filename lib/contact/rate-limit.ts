import type { NextRequest } from "next/server";

const WINDOW_MS = 15 * 60 * 1_000;
const MAX_REQUESTS = 5;
const MAX_TRACKED_CLIENTS = 5_000;
const PRUNE_INTERVAL = 100;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type ContactRateLimitStore = Map<string, RateLimitEntry>;

const globalWithContactRateLimit = globalThis as typeof globalThis & {
  __beseContactRateLimit?: ContactRateLimitStore;
};

const entries =
  globalWithContactRateLimit.__beseContactRateLimit ??
  new Map<string, RateLimitEntry>();

globalWithContactRateLimit.__beseContactRateLimit = entries;

let checksSincePrune = 0;

export type ContactRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

function pruneEntries(now: number): void {
  for (const [identifier, entry] of entries) {
    if (entry.resetAt <= now) {
      entries.delete(identifier);
    }
  }

  // Keep memory bounded even if an instance receives many unique forged IPs.
  while (entries.size >= MAX_TRACKED_CLIENTS) {
    const oldestIdentifier = entries.keys().next().value as string | undefined;
    if (!oldestIdentifier) break;
    entries.delete(oldestIdentifier);
  }
}

export function getClientIdentifier(request: NextRequest): string {
  // Vercel replaces the forwarding headers at its edge. When self-hosting, only
  // trust these headers if the app is behind a proxy that overwrites them.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const candidate =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  return candidate.slice(0, 64);
}

/**
 * A deliberately lightweight abuse control for this low-volume contact form.
 *
 * This Map exists only inside one warm serverless instance. It resets on a cold
 * start and is not shared between concurrent regions or instances, so it cannot
 * be the sole protection for a high-risk endpoint. Replace it with a distributed
 * store (for example, Vercel KV/Upstash) if traffic or abuse grows.
 */
export function checkContactRateLimit(
  identifier: string,
  now = Date.now(),
): ContactRateLimitResult {
  checksSincePrune += 1;
  if (
    checksSincePrune >= PRUNE_INTERVAL ||
    entries.size >= MAX_TRACKED_CLIENTS
  ) {
    pruneEntries(now);
    checksSincePrune = 0;
  }

  const existing = entries.get(identifier);
  if (!existing || existing.resetAt <= now) {
    entries.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return {
      allowed: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      retryAfterSeconds: 0,
    };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((existing.resetAt - now) / 1_000),
  );

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - existing.count,
    retryAfterSeconds: 0,
  };
}
