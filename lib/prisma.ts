/**
 * Prisma client singleton.
 *
 * Prisma 7 requires a driver adapter at runtime — the connection string no
 * longer lives in `schema.prisma`. We build a `PrismaPg` adapter from
 * `DATABASE_URL` lazily so importing this file does NOT require a configured
 * DB. The first actual query is what triggers construction (and surfaces a
 * missing-URL error).
 *
 * In dev we cache the client on `globalThis` so HMR doesn't spin up new
 * clients on every reload (Prisma's recommended Next.js pattern).
 */
import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var __samcarPrisma: PrismaClient | undefined;
}

function buildClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
    );
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

let cached: PrismaClient | undefined;

function getOrCreate(): PrismaClient {
  if (cached) return cached;
  if (globalThis.__samcarPrisma) {
    cached = globalThis.__samcarPrisma;
    return cached;
  }
  cached = buildClient();
  if (process.env.NODE_ENV !== "production") {
    globalThis.__samcarPrisma = cached;
  }
  return cached;
}

/**
 * Lazy proxy — the real client is built on first property access. This lets
 * `next build`'s static page data collection import modules that re-export
 * `prisma` without requiring DATABASE_URL.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getOrCreate(), prop, receiver);
  },
}) as PrismaClient;
