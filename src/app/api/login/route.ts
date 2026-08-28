import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  passwordMatches,
  sessionToken,
  sitePassword,
} from "@/lib/auth";

function safeNext(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/";
  }
  return value;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let password = "";
  let next = "/";

  if (contentType.includes("application/json")) {
    let body: { password?: unknown; next?: unknown };
    try {
      const value: unknown = await request.json();
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Invalid request");
      }
      body = value as { password?: unknown; next?: unknown };
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    password = typeof body.password === "string" ? body.password : "";
    next = safeNext(body.next);
  } else {
    const form = await request.formData();
    password = String(form.get("password") || "");
    next = safeNext(String(form.get("next") || "/"));
  }

  if (!sitePassword()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  if (!passwordMatches(password)) {
    if (contentType.includes("application/json")) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const err = new URL("/login", request.url);
    err.searchParams.set("error", "1");
    if (next !== "/") err.searchParams.set("next", next);
    return NextResponse.redirect(err, { status: 303 });
  }

  const response = contentType.includes("application/json")
    ? NextResponse.json({ ok: true, next })
    : NextResponse.redirect(new URL(next, request.url), { status: 303 });

  const token = await sessionToken();
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
