import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkCredentials,
  createSessionToken,
} from "@/lib/auth";
import {
  checkRateLimit,
  clientKeyFromRequest,
  registerFailure,
  resetRateLimit,
} from "@/lib/rateLimit";

function tooManyRequests(retryAfterSeconds: number) {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return NextResponse.json(
    {
      error: `Слишком много попыток входа. Попробуйте снова через ${minutes} мин.`,
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}

export async function POST(request: NextRequest) {
  const key = clientKeyFromRequest(request);

  // Reject early if this client is currently locked out.
  const status = checkRateLimit(key);
  if (status.blocked) {
    return tooManyRequests(status.retryAfterSeconds);
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";

  if (!checkCredentials(username, password)) {
    const after = registerFailure(key);
    if (after.blocked) {
      return tooManyRequests(after.retryAfterSeconds);
    }
    return NextResponse.json(
      {
        error: `Неверный логин или пароль. Осталось попыток: ${after.remaining}`,
      },
      { status: 401 }
    );
  }

  // Successful login: clear the failure counter for this client.
  resetRateLimit(key);

  // Mark the cookie Secure only when the request actually came over HTTPS
  // (detected via the reverse proxy's X-Forwarded-Proto header). This lets the
  // admin work over plain http://IP before a domain/HTTPS is set up, and
  // upgrades to a Secure cookie automatically once HTTPS is in place.
  const isHttps = request.headers.get("x-forwarded-proto") === "https";

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
