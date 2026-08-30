import { z } from "zod";

import { InvalidCredentialsError, loginWithCredentials, SessionAccessError } from "@/src/modules/identity";

import { authNotConfigured, getIdentityStore, invalidRequest, publicUser, withSessionCookie } from "../_shared";

const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return invalidRequest();
  const store = getIdentityStore();
  if (!store) return authNotConfigured();

  try {
    const result = await loginWithCredentials(store, parsed.data);
    return withSessionCookie(
      { ok: true, user: publicUser(result.user) },
      result.sessionToken,
      result.expiresAt,
    );
  } catch (error) {
    if (error instanceof SessionAccessError && error.reason === "USER_SUSPENDED") {
      return Response.json(
        { ok: false, code: "ACCOUNT_SUSPENDED", message: "Akun sedang ditangguhkan." },
        { status: 403 },
      );
    }
    if (error instanceof InvalidCredentialsError) return invalidRequest("Email atau kata sandi salah.");
    return Response.json(
      { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Login tidak dapat diproses." },
      { status: 503 },
    );
  }
}
