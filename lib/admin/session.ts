import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME =
  process.env.ADMIN_SESSION_COOKIE || "samcar_admin_session";
const MAX_AGE_SECONDS = Number(
  process.env.ADMIN_SESSION_MAX_AGE_SECONDS || 60 * 60 * 24 * 7,
);
const ISSUER = "samcar-rental-v2";
const AUDIENCE = "samcar-admin";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  loggedInAt: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Generate one and add it to .env (see .env.example).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "STAFF") ||
      typeof payload.loggedInAt !== "string"
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      loggedInAt: payload.loggedInAt,
    };
  } catch {
    return null;
  }
}

export async function setAdminSession(
  session: AdminSession,
): Promise<void> {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
