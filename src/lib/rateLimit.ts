// Simple in-memory brute-force protection for the admin login.
// Suitable for a single-instance deployment (matches the SQLite setup).
// Tracks failed attempts per key (IP) and locks the key after too many failures.

type Entry = {
  fails: number;
  firstFailAt: number;
  lockedUntil: number;
};

const MAX_ATTEMPTS = 5; // failures allowed within the window
const WINDOW_MS = 15 * 60 * 1000; // counting window: 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // lockout duration after too many failures

const attempts = new Map<string, Entry>();

export type RateLimitStatus = {
  blocked: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

function cleanup(now: number) {
  for (const [key, entry] of attempts) {
    const expired =
      entry.lockedUntil < now && now - entry.firstFailAt > WINDOW_MS;
    if (expired) attempts.delete(key);
  }
}

/** Call before checking credentials. If blocked, reject the request. */
export function checkRateLimit(key: string): RateLimitStatus {
  const now = Date.now();
  const entry = attempts.get(key);

  if (entry && entry.lockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
      remaining: 0,
    };
  }

  const remaining = entry ? Math.max(0, MAX_ATTEMPTS - entry.fails) : MAX_ATTEMPTS;
  return { blocked: false, retryAfterSeconds: 0, remaining };
}

/** Record a failed attempt; returns the updated status (possibly now blocked). */
export function registerFailure(key: string): RateLimitStatus {
  const now = Date.now();
  cleanup(now);

  let entry = attempts.get(key);

  // Reset the counter if the counting window has elapsed.
  if (!entry || (entry.lockedUntil < now && now - entry.firstFailAt > WINDOW_MS)) {
    entry = { fails: 0, firstFailAt: now, lockedUntil: 0 };
  }

  entry.fails += 1;
  if (entry.fails >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(key, entry);

  if (entry.lockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
      remaining: 0,
    };
  }
  return {
    blocked: false,
    retryAfterSeconds: 0,
    remaining: Math.max(0, MAX_ATTEMPTS - entry.fails),
  };
}

/** Clear attempts for a key after a successful login. */
export function resetRateLimit(key: string) {
  attempts.delete(key);
}

/** Best-effort client IP from proxy headers. */
export function clientKeyFromRequest(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
