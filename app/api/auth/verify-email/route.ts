import { z } from "zod";

import { EmailVerificationTokenError, verifyEmailToken } from "@/src/modules/identity";

import { authNotConfigured, getIdentityStore, invalidRequest } from "../_shared";

const inputSchema = z.object({ token: z.string().min(1).max(512) });

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return invalidRequest("Token verifikasi tidak valid.");
  const store = getIdentityStore();
  if (!store) return authNotConfigured();
  try {
    await verifyEmailToken(store, parsed.data.token);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof EmailVerificationTokenError) {
      return Response.json(
        { ok: false, code: "INVALID_CREDENTIALS", message: "Token verifikasi tidak valid atau kedaluwarsa." },
        { status: 400 },
      );
    }
    return Response.json(
      { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Verifikasi tidak dapat diproses." },
      { status: 503 },
    );
  }
}
