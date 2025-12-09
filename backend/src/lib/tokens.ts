import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { env } from "./config";
import { apiScope } from "@prisma/client";

const HMAC_SECRET = env.HMAC_SECRET;

export function generateToken(): string {
  return crypto.randomBytes(64).toString("base64url");
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
  const hash = hashToken(token);

  const stored = await prisma.apiToken.findUnique({
    where: { hash },
  });

  if (!stored) return null;

  return stored;
}
