"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function upsertStandupAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.standup.upsert({
    where: {
      userId_date: { userId: session.user.id, date: today },
    },
    create: {
      userId: session.user.id,
      date: today,
      yesterday: String(formData.get("yesterday") || ""),
      today: String(formData.get("today") || ""),
      blockers: String(formData.get("blockers") || ""),
      helpNeeded: String(formData.get("helpNeeded") || ""),
      expectedEodOutput: String(formData.get("expectedEodOutput") || ""),
    },
    update: {
      yesterday: String(formData.get("yesterday") || ""),
      today: String(formData.get("today") || ""),
      blockers: String(formData.get("blockers") || ""),
      helpNeeded: String(formData.get("helpNeeded") || ""),
      expectedEodOutput: String(formData.get("expectedEodOutput") || ""),
    },
  });

  revalidatePath("/standups");
}
