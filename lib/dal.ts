import "server-only";
import { getAdminSession } from "@/lib/admin/session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getAdminSession();
  if (!session) return null;
  return {
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  };
}
