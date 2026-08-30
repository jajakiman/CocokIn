export type PublicRole = "TALENT" | "BUSINESS";
export type Role = PublicRole | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export type StoredIdentityUser = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string | null;
  role: Role;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  sessionVersion: number;
};

export type SessionWrite = {
  userId: string;
  sessionToken: string;
  expiresAt: Date;
  sessionVersion: number;
};

export type SessionUserRecord = Omit<SessionWrite, "userId"> & {
  user: StoredIdentityUser;
};

export type RegistrationWrite = {
  user: {
    name: string | null;
    email: string;
    passwordHash: string;
    role: PublicRole;
  };
  profileRole: PublicRole;
  consents: Array<{
    purpose: "TERMS_ACCEPTANCE" | "PRIVACY_PROCESSING";
    status: "GRANTED";
    source: "REGISTRATION";
    policyVersion: string;
  }>;
  verificationToken: {
    tokenHash: string;
    expiresAt: Date;
  };
  session: Omit<SessionWrite, "userId">;
};

export interface IdentityStore {
  register(input: RegistrationWrite): Promise<{
    user: StoredIdentityUser;
    session: SessionUserRecord;
  }>;
  findUserByEmail(email: string): Promise<StoredIdentityUser | null>;
  createSession(input: SessionWrite): Promise<SessionUserRecord>;
  findSession(sessionToken: string): Promise<SessionUserRecord | null>;
  deleteSession(sessionToken: string): Promise<boolean>;
  incrementSessionVersion(userId: string): Promise<boolean>;
  consumeEmailVerificationToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredIdentityUser | null>;
}
