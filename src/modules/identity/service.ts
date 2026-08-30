import { hashPassword, verifyPassword } from "./password";
import {
  createOpaqueToken,
  hashIdentityToken,
  sessionExpiry,
  verificationExpiry,
} from "./session";
import type { IdentityStore, PublicRole, StoredIdentityUser } from "./types";

export class DuplicateEmailError extends Error {
  constructor() {
    super("An account with this email already exists");
    this.name = "DuplicateEmailError";
  }
}

export class PublicRoleError extends Error {
  constructor() {
    super("Public registration supports TALENT or BUSINESS only");
    this.name = "PublicRoleError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

export type SessionAccessFailure =
  | "SESSION_NOT_FOUND"
  | "SESSION_EXPIRED"
  | "SESSION_REVOKED"
  | "USER_SUSPENDED"
  | "EMAIL_UNVERIFIED";

export class SessionAccessError extends Error {
  constructor(public readonly reason: SessionAccessFailure) {
    super(reason);
    this.name = "SessionAccessError";
  }
}

export class EmailVerificationTokenError extends Error {
  constructor() {
    super("Email verification token is invalid, expired, or consumed");
    this.name = "EmailVerificationTokenError";
  }
}

export async function registerPublicUser(
  store: IdentityStore,
  input: {
    name?: string | null;
    email: string;
    password: string;
    role: PublicRole;
    policyVersion: string;
  },
  now = new Date(),
) {
  if (input.role !== "TALENT" && input.role !== "BUSINESS") throw new PublicRoleError();

  const email = input.email.trim().toLowerCase();
  if (await store.findUserByEmail(email)) throw new DuplicateEmailError();

  const emailVerificationToken = createOpaqueToken();
  const sessionToken = createOpaqueToken();
  const { user, session } = await store.register({
    user: {
      name: input.name?.trim() || null,
      email,
      passwordHash: await hashPassword(input.password),
      role: input.role,
    },
    profileRole: input.role,
    consents: ["TERMS_ACCEPTANCE", "PRIVACY_PROCESSING"].map((purpose) => ({
      purpose: purpose as "TERMS_ACCEPTANCE" | "PRIVACY_PROCESSING",
      status: "GRANTED" as const,
      source: "REGISTRATION" as const,
      policyVersion: input.policyVersion,
    })),
    verificationToken: {
      tokenHash: hashIdentityToken(emailVerificationToken),
      expiresAt: verificationExpiry(now),
    },
    session: {
      sessionToken,
      expiresAt: sessionExpiry(now),
      sessionVersion: 1,
    },
  });

  return { user, sessionToken, sessionExpiresAt: session.expiresAt, emailVerificationToken };
}

export async function loginWithCredentials(
  store: IdentityStore,
  input: { email: string; password: string },
  now = new Date(),
) {
  const user = await store.findUserByEmail(input.email.trim().toLowerCase());
  if (!user?.passwordHash || !(await verifyPassword(user.passwordHash, input.password))) {
    throw new InvalidCredentialsError();
  }
  if (user.status === "SUSPENDED") throw new SessionAccessError("USER_SUSPENDED");

  return createDatabaseSession(store, user, now);
}

export async function createDatabaseSession(
  store: IdentityStore,
  user: StoredIdentityUser,
  now = new Date(),
) {
  const sessionToken = createOpaqueToken();
  const session = await store.createSession({
    userId: user.id,
    sessionToken,
    expiresAt: sessionExpiry(now),
    sessionVersion: user.sessionVersion,
  });
  return { user: session.user, sessionToken, expiresAt: session.expiresAt };
}

export async function getSessionUser(
  store: IdentityStore,
  sessionToken: string,
  options: { requireVerifiedEmail?: boolean; now?: Date } = {},
) {
  const session = await store.findSession(sessionToken);
  if (!session) throw new SessionAccessError("SESSION_NOT_FOUND");
  if (session.expiresAt <= (options.now ?? new Date())) {
    throw new SessionAccessError("SESSION_EXPIRED");
  }
  if (session.sessionVersion !== session.user.sessionVersion) {
    throw new SessionAccessError("SESSION_REVOKED");
  }
  if (session.user.status === "SUSPENDED") {
    throw new SessionAccessError("USER_SUSPENDED");
  }
  if (options.requireVerifiedEmail && !session.user.emailVerifiedAt) {
    throw new SessionAccessError("EMAIL_UNVERIFIED");
  }
  return session.user;
}

export async function revokeSession(store: IdentityStore, sessionToken: string) {
  return store.deleteSession(sessionToken);
}

export async function revokeAllSessions(store: IdentityStore, userId: string) {
  return store.incrementSessionVersion(userId);
}

export async function verifyEmailToken(
  store: IdentityStore,
  token: string,
  now = new Date(),
) {
  const user = await store.consumeEmailVerificationToken(hashIdentityToken(token), now);
  if (!user) throw new EmailVerificationTokenError();
  return user;
}
