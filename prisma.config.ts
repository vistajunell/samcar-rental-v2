/**
 * Prisma 7 configuration — replaces the legacy `"prisma"` package.json block.
 *
 * The connection string moved out of `schema.prisma` in Prisma 7. The CLI
 * (`prisma migrate`, `prisma db push`, `prisma db seed`) reads it from
 * `datasource.url` below; the runtime client in `lib/prisma.ts` constructs
 * its own adapter from the same DATABASE_URL.
 */
import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
    );
  }
  return url;
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: requireDatabaseUrl(),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
