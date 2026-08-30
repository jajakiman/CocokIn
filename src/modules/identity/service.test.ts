import { describe, expect, test } from "vitest";
import {
  DuplicateEmailError,
  EmailVerificationTokenError,
  InvalidCredentialsError,
  PublicRoleError,
  SessionAccessError,
  createDatabaseSession,
  getSessionUser,
  loginWithCredentials,
  registerPublicUser,
  revokeAllSessions,
  revokeSession,
  verifyEmailToken,
} from "./service";
import { hashPassword, verifyPassword } from "./password";
import type {
  IdentityStore,
  RegistrationWrite,
  SessionUserRecord,
  StoredIdentityUser,
} from "./types";

class InMemoryIdentityStore implements IdentityStore {
  users: StoredIdentityUser[] = [];
  registrations: RegistrationWrite[] = [];
  sessions: SessionUserRecord[] = [];
  tokens: Array<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    consumedAt: Date | null;
  }> = [];

  async register(input: RegistrationWrite) {
    if (this.users.some((user) => user.email === input.user.email)) {
      throw new DuplicateEmailError();
    }

    const user: StoredIdentityUser = {
      id: `user-${this.users.length + 1}`,
      ...input.user,
      emailVerifiedAt: null,
      status: "ACTIVE",
      sessionVersion: 1,
    };
    this.users.push(user);
    this.registrations.push(input);
    this.tokens.push({
      userId: user.id,
      tokenHash: input.verificationToken.tokenHash,
      expiresAt: input.verificationToken.expiresAt,
      consumedAt: null,
    });
    const session = this.addSession(user, input.session);
    return { user, session };
  }

  async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async createSession(input: {
    userId: string;
    sessionToken: string;
    expiresAt: Date;
    sessionVersion: number;
  }) {
    const user = this.users.find((candidate) => candidate.id === input.userId);
    if (!user) throw new Error("Unknown test user");
    return this.addSession(user, input);
  }

  async findSession(sessionToken: string) {
    return this.sessions.find((session) => session.sessionToken === sessionToken) ?? null;
  }

  async deleteSession(sessionToken: string) {
    const index = this.sessions.findIndex((session) => session.sessionToken === sessionToken);
    if (index === -1) return false;
    this.sessions.splice(index, 1);
    return true;
  }

  async incrementSessionVersion(userId: string) {
    const user = this.users.find((candidate) => candidate.id === userId);
    if (!user) return false;
    user.sessionVersion += 1;
    return true;
  }

  async consumeEmailVerificationToken(tokenHash: string, now: Date) {
    const token = this.tokens.find((candidate) => candidate.tokenHash === tokenHash);
    if (!token || token.consumedAt || token.expiresAt <= now) return null;
    token.consumedAt = now;
    const user = this.users.find((candidate) => candidate.id === token.userId)!;
    user.emailVerifiedAt = now;
    for (const session of this.sessions) {
      if (session.user.id === user.id) session.user.emailVerifiedAt = now;
    }
    return user;
  }

  private addSession(
    user: StoredIdentityUser,
    session: {
      sessionToken: string;
      expiresAt: Date;
      sessionVersion: number;
    },
  ) {
    const record: SessionUserRecord = {
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
      sessionVersion: session.sessionVersion,
      user,
    };
    this.sessions.push(record);
    return record;
  }
}

const registration = {
  name: "Ayu",
  email: "  AYU@Example.COM ",
  password: "correct horse battery staple",
  role: "TALENT" as const,
  policyVersion: "2026-08-30",
};

describe("identity service", () => {
  test("registers a normalized email with matching profile and required consent events atomically", async () => {
    const store = new InMemoryIdentityStore();

    const result = await registerPublicUser(store, registration);

    expect(result.user.email).toBe("ayu@example.com");
    expect(result.user.role).toBe("TALENT");
    expect(store.registrations[0].profileRole).toBe("TALENT");
    expect(store.registrations[0].consents).toEqual([
      {
        purpose: "TERMS_ACCEPTANCE",
        status: "GRANTED",
        source: "REGISTRATION",
        policyVersion: "2026-08-30",
      },
      {
        purpose: "PRIVACY_PROCESSING",
        status: "GRANTED",
        source: "REGISTRATION",
        policyVersion: "2026-08-30",
      },
    ]);
    expect(result.emailVerificationToken).not.toBe(
      store.registrations[0].verificationToken.tokenHash,
    );
  });

  test("rejects a normalized duplicate email", async () => {
    const store = new InMemoryIdentityStore();
    await registerPublicUser(store, registration);

    await expect(
      registerPublicUser(store, { ...registration, email: "ayu@example.com" }),
    ).rejects.toBeInstanceOf(DuplicateEmailError);
  });

  test("rejects public ADMIN registration", async () => {
    const store = new InMemoryIdentityStore();

    await expect(
      registerPublicUser(store, { ...registration, role: "ADMIN" as never }),
    ).rejects.toBeInstanceOf(PublicRoleError);
    expect(store.users).toHaveLength(0);
  });

  test("hashes passwords with Argon2id and verifies only the matching password", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash).toMatch(/^\$argon2id\$/);
    await expect(verifyPassword(hash, "correct horse battery staple")).resolves.toBe(true);
    await expect(verifyPassword(hash, "wrong password")).resolves.toBe(false);
  });

  test("creates opaque database sessions and permits login before email verification", async () => {
    const store = new InMemoryIdentityStore();
    const registered = await registerPublicUser(store, registration);

    const loggedIn = await loginWithCredentials(store, {
      email: "AYU@example.com",
      password: registration.password,
    });

    expect(loggedIn.user.emailVerifiedAt).toBeNull();
    expect(loggedIn.sessionToken).not.toBe(registered.sessionToken);
    expect(loggedIn.sessionToken).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(store.sessions[1].sessionVersion).toBe(1);
    await expect(
      loginWithCredentials(store, { email: registration.email, password: "wrong" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("rejects unverified, suspended, revoked-version, and expired sessions for chat access", async () => {
    const store = new InMemoryIdentityStore();
    const registered = await registerPublicUser(store, registration);

    await expect(
      getSessionUser(store, registered.sessionToken, { requireVerifiedEmail: true }),
    ).rejects.toMatchObject({ reason: "EMAIL_UNVERIFIED" });

    store.users[0].emailVerifiedAt = new Date();
    store.sessions[0].user.emailVerifiedAt = store.users[0].emailVerifiedAt;
    store.users[0].status = "SUSPENDED";
    await expect(getSessionUser(store, registered.sessionToken)).rejects.toMatchObject({
      reason: "USER_SUSPENDED",
    });

    store.users[0].status = "ACTIVE";
    store.users[0].sessionVersion += 1;
    await expect(getSessionUser(store, registered.sessionToken)).rejects.toMatchObject({
      reason: "SESSION_REVOKED",
    });

    store.sessions[0].sessionVersion = store.users[0].sessionVersion;
    store.sessions[0].expiresAt = new Date(0);
    await expect(getSessionUser(store, registered.sessionToken)).rejects.toMatchObject({
      reason: "SESSION_EXPIRED",
    });
  });

  test("revokes one session or all user sessions through the version snapshot", async () => {
    const store = new InMemoryIdentityStore();
    const registered = await registerPublicUser(store, registration);
    const second = await createDatabaseSession(store, registered.user);

    await revokeSession(store, registered.sessionToken);
    await expect(getSessionUser(store, registered.sessionToken)).rejects.toBeInstanceOf(
      SessionAccessError,
    );
    await expect(getSessionUser(store, second.sessionToken)).resolves.toMatchObject({
      id: registered.user.id,
    });

    await revokeAllSessions(store, registered.user.id);
    await expect(getSessionUser(store, second.sessionToken)).rejects.toMatchObject({
      reason: "SESSION_REVOKED",
    });
  });

  test("consumes an email verification token once and marks the user verified", async () => {
    const store = new InMemoryIdentityStore();
    const registered = await registerPublicUser(store, registration);

    const user = await verifyEmailToken(store, registered.emailVerificationToken);

    expect(user.emailVerifiedAt).toBeInstanceOf(Date);
    await expect(
      verifyEmailToken(store, registered.emailVerificationToken),
    ).rejects.toBeInstanceOf(EmailVerificationTokenError);
  });

  test("rejects expired email verification tokens", async () => {
    const store = new InMemoryIdentityStore();
    const registered = await registerPublicUser(store, registration);
    store.tokens[0].expiresAt = new Date(0);

    await expect(
      verifyEmailToken(store, registered.emailVerificationToken),
    ).rejects.toBeInstanceOf(EmailVerificationTokenError);
    expect(store.users[0].emailVerifiedAt).toBeNull();
  });
});
