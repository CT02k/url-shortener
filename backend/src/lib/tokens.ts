import crypto from "crypto";
import { apiScope } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { env } from "./config";

const HMAC_SECRET = env.HMAC_SECRET;
export const API_KEY_PREFIX = "usk_";

export const KEY_REGEX =
  /^usk_([A-Za-z0-9_-]+)_([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/;

export function generateTokenParts() {
  const id = crypto.randomUUID();
  const code = crypto
    .randomBytes(32)
    .toString("base64url")
    .replace(/[^A-Za-z0-9_-]/g, "");

  const token = `${API_KEY_PREFIX}${code}_${id}`;

  return { token, id };
}

export function hashToken(token: string): string {
  return crypto.createHmac("sha256", HMAC_SECRET).update(token).digest("hex");
}

export async function createApiToken(
  userId: string,
  name: string,
  scopes: apiScope[],
) {
  const { token, id } = generateTokenParts();
  const hash = hashToken(token);

  const created = await prisma.apiToken.create({
    data: {
      id,
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
  if (!KEY_REGEX.test(token)) return null;

  const hash = hashToken(token);

  const stored = await prisma.apiToken.findUnique({
    where: { hash },
  });

  if (!stored) return null;

  return stored;
}
