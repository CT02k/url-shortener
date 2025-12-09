import crypto from "crypto";
import { apiScope } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { env } from "./config";

const HMAC_SECRET = env.HMAC_SECRET;
export const API_KEY_PREFIX = "uskp_";

const RANDOM_SEGMENT_LENGTH = 43;
const CHECKSUM_HEX_LENGTH = 8;
const UUID_V4_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
export const KEY_REGEX_PATTERN = `${API_KEY_PREFIX}[A-Za-z0-9_-]{${RANDOM_SEGMENT_LENGTH}}_[0-9a-f]{${CHECKSUM_HEX_LENGTH}}_${UUID_V4_PATTERN}`;
export const KEY_REGEX = new RegExp(
  `^${API_KEY_PREFIX}([A-Za-z0-9_-]{${RANDOM_SEGMENT_LENGTH}})_([0-9a-f]{${CHECKSUM_HEX_LENGTH}})_(${UUID_V4_PATTERN})$`,
);

const calculateChecksum = (code: string, id: string) =>
  crypto
    .createHash("sha256")
    .update(`${code}_${id}`)
    .digest("hex")
    .slice(0, CHECKSUM_HEX_LENGTH);

export function generateTokenParts() {
  const id = crypto.randomUUID();
  const code = crypto.randomBytes(32).toString("base64url");
  const checksum = calculateChecksum(code, id);

  const token = `${API_KEY_PREFIX}${code}_${checksum}_${id}`;

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
  const match = token.match(KEY_REGEX);

  if (!match) return null;

  const [, code, checksum, id] = match;
  const expectedChecksum = calculateChecksum(code, id);

  if (checksum !== expectedChecksum) return null;

  const hash = hashToken(token);

  const stored = await prisma.apiToken.findUnique({
    where: { hash },
  });

  if (!stored) return null;

  return stored;
}
