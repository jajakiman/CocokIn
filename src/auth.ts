import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import type { NextRequest } from "next/server";

import { isDatabaseAuthConfigured, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/src/auth-contract";
import { getPrisma } from "@/src/lib/db/prisma";

function isGoogleAuthConfigured() {
  return Boolean(
    isDatabaseAuthConfigured() && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
}

let instance: ReturnType<typeof NextAuth> | undefined;

function getAuthInstance() {
  if (!isDatabaseAuthConfigured()) return null;
  if (instance) return instance;

  const prisma = getPrisma();
  const adapter = PrismaAdapter(prisma);
  instance = NextAuth({
    adapter: {
      ...adapter,
      async getSessionAndUser(sessionToken) {
        const record = await prisma.session.findUnique({
          where: { sessionToken },
          include: { user: true },
        });
        if (
          !record ||
          record.expires <= new Date() ||
          record.sessionVersion !== record.user.sessionVersion ||
          record.user.status === "SUSPENDED"
        ) return null;
        return {
          session: {
            sessionToken: record.sessionToken,
            userId: record.userId,
            expires: record.expires,
          },
          user: record.user,
        };
      },
    },
    secret: process.env.AUTH_SECRET,
    session: { strategy: "database" },
    cookies: {
      sessionToken: { name: SESSION_COOKIE_NAME, options: SESSION_COOKIE_OPTIONS },
    },
    providers: isGoogleAuthConfigured()
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : [],
    callbacks: {
      session({ session, user }) {
        const projected = user as typeof user & {
          role: "TALENT" | "BUSINESS" | "ADMIN";
          status: "ACTIVE" | "SUSPENDED";
          emailVerified: Date | null;
        };
        session.user.id = user.id;
        session.user.role = projected.role;
        session.user.status = projected.status;
        session.user.verified = Boolean(projected.emailVerified);
        return session;
      },
    },
  });
  return instance;
}

function notConfigured() {
  return Response.json(
    { ok: false, code: "AUTH_NOT_CONFIGURED", message: "Autentikasi belum dikonfigurasi." },
    { status: 503 },
  );
}

export const handlers = {
  GET(request: NextRequest) {
    const auth = getAuthInstance();
    return auth ? auth.handlers.GET(request) : notConfigured();
  },
  POST(request: NextRequest) {
    const auth = getAuthInstance();
    return auth ? auth.handlers.POST(request) : notConfigured();
  },
};

export async function auth() {
  const configured = getAuthInstance();
  return configured ? configured.auth() : null;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "TALENT" | "BUSINESS" | "ADMIN";
      status: "ACTIVE" | "SUSPENDED";
      verified: boolean;
    } & DefaultSession["user"];
  }
}
