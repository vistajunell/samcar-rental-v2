import "server-only";
import { randomInt } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";

const ISSUER = "samcar-rental-v2";
const AUDIENCE = "samcar-admin-human-check";
const MAX_AGE_SECONDS = 10 * 60;

export interface HumanCheckChallenge {
  question: string;
  token: string;
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

export async function createHumanCheckChallenge(): Promise<HumanCheckChallenge> {
  const left = randomInt(2, 10);
  const right = randomInt(2, 10);
  const answer = String(left + right);

  const token = await new SignJWT({ answer })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());

  return {
    question: `${left} + ${right}`,
    token,
  };
}

export async function verifyHumanCheck(
  token: string,
  answer: string,
): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return (
      typeof payload.answer === "string" &&
      payload.answer === answer.trim()
    );
  } catch {
    return false;
  }
}
