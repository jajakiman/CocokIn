import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/src/auth-contract";
import { revokeSession } from "@/src/modules/identity";

import { authNotConfigured, getIdentityStore } from "../_shared";

export async function POST(request?: Request) {
  const token = request?.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);
  const store = getIdentityStore();
  if (!store) {
    const response = authNotConfigured();
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      ...SESSION_COOKIE_OPTIONS,
      expires: new Date(0),
      maxAge: 0,
    });
    return response;
  }
  if (token) await revokeSession(store, decodeURIComponent(token));

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
