import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getPrimaryProjectId() {
  const project = await prisma.project.findFirst({
    where: { isPrimary: true },
    select: { id: true, name: true, code: true, isSeedData: true },
  });
  return project;
}

export async function getSessionEmployee() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.employee.findFirst({
    where: { userId: session.user.id },
  });
}
