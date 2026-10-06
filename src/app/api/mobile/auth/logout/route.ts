import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { revokeMobileSession } from "@/lib/mobile/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const requestId = nanoid(10);
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    await revokeMobileSession(auth.slice("Bearer ".length).trim());
  }
  return NextResponse.json({ ok: true, requestId });
}
