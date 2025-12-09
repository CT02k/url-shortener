import crypto from "crypto";
import { apiScope } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { env } from "./config";

const HMAC_SECRET = env.HMAC_SECRET;
export const API_KEY_PREFIX = "usk_";

export function generateToken(): string {
  return `${API_KEY_PREFIX}${crypto.randomBytes(64).toString("base64url")}`;
}

export function hashToken(token: string): string {
  return crypto.createHmac("sha256", HMAC_SECRET).update(token).digest("hex");
}

export async function createApiToken(
  userId: string,
  name: string,
  scopes: apiScope[],
) {
  const token = generateToken();
  const hash = hashToken(token);

  const created = await prisma.apiToken.create({
    data: {
      userId,
      name,
      hash,
      scopes,
    },
    select: {
      id: true,
      name: true,
      scopes: true,
      createdAt: true,
    },
  });

  return { token, created };
}

export async function validateToken(token: string) {
  if (!token.startsWith(API_KEY_PREFIX)) return null;

  const hash = hashToken(token);

  const stored = await prisma.apiToken.findUnique({
    where: { hash },
  });

  if (!stored) return null;

  return stored;
}
