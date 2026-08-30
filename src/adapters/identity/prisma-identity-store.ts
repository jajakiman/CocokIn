import { Prisma, type PrismaClient } from "@/src/generated/prisma/client";
import { DuplicateEmailError } from "@/src/modules/identity/service";
import type {
  IdentityStore,
  RegistrationWrite,
  SessionUserRecord,
  StoredIdentityUser,
} from "@/src/modules/identity/types";

const userSelect = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  role: true,
  status: true,
  emailVerified: true,
  sessionVersion: true,
} as const;

type PrismaUser = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string | null;
  role: "TALENT" | "BUSINESS" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  emailVerified: Date | null;
  sessionVersion: number;
};

function toUser(user: PrismaUser): StoredIdentityUser {
  const { emailVerified, ...rest } = user;
  return { ...rest, emailVerifiedAt: emailVerified };
}

export class PrismaIdentityStore implements IdentityStore {
  constructor(private readonly prisma: PrismaClient) {}

  async register(input: RegistrationWrite) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            ...input.user,
            consentRecords: { create: input.consents },
            identityTokens: {
              create: {
                identifier: input.user.email,
                token: input.verificationToken.tokenHash,
                type: "EMAIL_VERIFICATION",
                expires: input.verificationToken.expiresAt,
              },
            },
            sessions: {
              create: {
                sessionToken: input.session.sessionToken,
                expires: input.session.expiresAt,
                sessionVersion: input.session.sessionVersion,
              },
            },
            ...(input.profileRole === "TALENT"
              ? { talentProfile: { create: {} } }
              : { businessProfile: { create: {} } }),
          },
          select: userSelect,
        });
        const storedUser = toUser(user);
        return {
          user: storedUser,
          session: {
            sessionToken: input.session.sessionToken,
            expiresAt: input.session.expiresAt,
            sessionVersion: input.session.sessionVersion,
            user: storedUser,
          },
        };
      });
    } catch (error) {
      const target =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
          ? error.meta?.target
          : undefined;
      if (
        (Array.isArray(target) && target.includes("email")) ||
        (typeof target === "string" && target.includes("email"))
      ) {
        throw new DuplicateEmailError();
      }
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, select: userSelect });
    return user ? toUser(user) : null;
  }

  async createSession(input: {
    userId: string;
    sessionToken: string;
    expiresAt: Date;
    sessionVersion: number;
  }) {
    const session = await this.prisma.session.create({
      data: {
        userId: input.userId,
        sessionToken: input.sessionToken,
        expires: input.expiresAt,
        sessionVersion: input.sessionVersion,
      },
      include: { user: { select: userSelect } },
    });
    return this.toSession(session);
  }

  async findSession(sessionToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionToken },
      include: { user: { select: userSelect } },
    });
    return session ? this.toSession(session) : null;
  }

  async deleteSession(sessionToken: string) {
    const result = await this.prisma.session.deleteMany({ where: { sessionToken } });
    return result.count > 0;
  }

  async incrementSessionVersion(userId: string) {
    const result = await this.prisma.user.updateMany({
      where: { id: userId },
      data: { sessionVersion: { increment: 1 } },
    });
    return result.count > 0;
  }

  async consumeEmailVerificationToken(tokenHash: string, now: Date) {
    return this.prisma.$transaction(async (tx) => {
      const token = await tx.identityToken.findUnique({ where: { token: tokenHash } });
      if (!token || token.type !== "EMAIL_VERIFICATION" || token.consumedAt || token.expires <= now) {
        return null;
      }
      const consumed = await tx.identityToken.updateMany({
        where: { id: token.id, consumedAt: null, expires: { gt: now } },
        data: { consumedAt: now },
      });
      if (consumed.count !== 1 || !token.userId) return null;
      const user = await tx.user.update({
        where: { id: token.userId },
        data: { emailVerified: now },
        select: userSelect,
      });
      return toUser(user);
    });
  }

  private toSession(session: {
    sessionToken: string;
    expires: Date;
    sessionVersion: number;
    user: PrismaUser;
  }): SessionUserRecord {
    return {
      sessionToken: session.sessionToken,
      expiresAt: session.expires,
      sessionVersion: session.sessionVersion,
      user: toUser(session.user),
    };
  }
}
