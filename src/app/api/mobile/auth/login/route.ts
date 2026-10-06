import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { createMobileSession } from "@/lib/mobile/auth";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const requestId = nanoid(10);
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "Invalid credentials payload", requestId },
        { status: 400 },
      );
    }

    const account = await prisma.mobileAccount.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!account || !account.isActive) {
      return NextResponse.json(
        { code: "AUTH_FAILED", message: "Invalid email or password", requestId },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(parsed.data.password, account.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { code: "AUTH_FAILED", message: "Invalid email or password", requestId },
        { status: 401 },
      );
    }

    const tokens = await createMobileSession(account.id);

    return NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt.toISOString(),
      account: {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
      },
      requestId,
    });
  } catch {
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Login failed", requestId },
      { status: 500 },
    );
  }
}
