import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import type { MobileAccount, MobileRole } from "@prisma/client";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

export type MobileAuthContext = {
  account: MobileAccount;
  sessionId: string;
};

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function issueTokenPair() {
  return {
    accessToken: randomBytes(32).toString("hex"),
    refreshToken: randomBytes(32).toString("hex"),
  };
}

export async function createMobileSession(accountId: string) {
  const { accessToken, refreshToken } = issueTokenPair();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.mobileSession.create({
    data: {
      accountId,
      tokenHash: hashToken(accessToken),
      refreshTokenHash: hashToken(refreshToken),
      expiresAt,
    },
  });

  return { accessToken, refreshToken, expiresAt };
}

export async function revokeMobileSession(accessToken: string) {
  await prisma.mobileSession.updateMany({
    where: { tokenHash: hashToken(accessToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function resolveMobileAuth(
  authorizationHeader: string | null,
): Promise<MobileAuthContext | null> {
  if (!authorizationHeader?.startsWith("Bearer ")) return null;
  const token = authorizationHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const session = await prisma.mobileSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { account: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }
  if (!session.account.isActive) return null;

  return { account: session.account, sessionId: session.id };
}

export function requireRole(account: MobileAccount, roles: MobileRole[]) {
  return roles.includes(account.role);
}
