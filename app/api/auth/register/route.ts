import { z } from "zod";

import { DuplicateEmailError, registerPublicUser } from "@/src/modules/identity";

import { authNotConfigured, getIdentityStore, invalidRequest, publicUser, withSessionCookie } from "../_shared";

const inputSchema = z.object({
  role: z.enum(["TALENT", "BUSINESS"]),
  fullName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
});

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (
    body && typeof body === "object" && "role" in body && body.role === "ADMIN"
  ) {
    return Response.json(
      {
        ok: false,
        code: "ROLE_REVOKED",
        message: "Pendaftaran publik hanya tersedia untuk Talent atau UMKM.",
      },
      { status: 400 },
    );
  }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return invalidRequest("Data pendaftaran tidak valid.");

  const store = getIdentityStore();
  if (!store) return authNotConfigured();
  try {
    const result = await registerPublicUser(store, {
      name: parsed.data.fullName,
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role,
      policyVersion: "2026-08-30",
    });
    return withSessionCookie(
      {
        ok: true,
        user: publicUser(result.user),
        verificationDelivery: "PENDING_UNCONFIGURED",
      },
      result.sessionToken,
      result.sessionExpiresAt,
    );
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return Response.json(
        { ok: false, code: "INVALID_CREDENTIALS", message: "Email sudah terdaftar." },
        { status: 409 },
      );
    }
    return Response.json(
      { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Pendaftaran tidak dapat diproses." },
      { status: 503 },
    );
  }
}
