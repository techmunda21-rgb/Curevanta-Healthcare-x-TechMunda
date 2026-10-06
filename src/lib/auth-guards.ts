import { auth } from "@/lib/auth";
import { roleHasPermission, type PermissionCode } from "@/lib/rbac";
import type { SystemRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requirePermission(permission: PermissionCode) {
  const session = await requireSession();
  if (!roleHasPermission(session.user.role as SystemRole, permission)) {
    redirect("/unauthorized");
  }
  return session;
}

export async function hasPermission(permission: PermissionCode): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  return roleHasPermission(session.user.role as SystemRole, permission);
}

export function assertPermission(role: SystemRole, permission: PermissionCode) {
  if (!roleHasPermission(role, permission)) {
    throw new Error("FORBIDDEN");
  }
}
