import axios from "axios";
import crypto from "crypto";
import { env } from "./config";

interface GitHubSigningKeys {
  public_keys: {
    key_identifier: string;
    key: string;
    is_current: boolean;
  }[];
}

interface GithubRequestTokenData {
  token: string;
  type: string;
  url: string;
  source: string;
}

export type GithubRequestBody = GithubRequestTokenData[];

const GITHUB_KEYS_URI =
  "https://api.github.com/meta/public_keys/secret_scanning";
const KEYS_CACHE_TTL_MS = 5 * 60 * 1000;

let keysCache: {
  keys: GitHubSigningKeys["public_keys"];
  expiresAt: number;
} | null = null;

const getSigningKeys = async (): Promise<GitHubSigningKeys["public_keys"]> => {
  const now = Date.now();

  if (keysCache && keysCache.expiresAt > now) {
    return keysCache.keys;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (env.GITHUB_PUBLIC_KEYS_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_PUBLIC_KEYS_TOKEN}`;
  }

  const response = await axios.get<GitHubSigningKeys>(GITHUB_KEYS_URI, {
    headers,
    timeout: 10_000,
  });

  const keys = response.data?.public_keys ?? [];

  keysCache = { keys, expiresAt: now + KEYS_CACHE_TTL_MS };

  return keys;
};

/**
 * Verifies the ECDSA signature of a GitHub webhook.
 *
 * @param payload Original received content (string)
 * @param keyId ID of the public key used by GitHub
 * @param signatureBase64 Signature sent by GitHub (base64)
 *
 * @returns boolean indicating whether the signature is valid
 */

export const verifyWebhook = async (
  payload: string,
  signature: string,
  keyID: string,
) => {
  if (typeof payload !== "string" || payload.length === 0) {
    return false;
  }
  if (typeof signature !== "string" || signature.length === 0) {
    return false;
  }
  if (typeof keyID !== "string" || keyID.length === 0) {
    return false;
  }

  const keys = await getSigningKeys();

  if (!Array.isArray(keys) || keys.length === 0) {
    return false;
  }

  const publicKey = keys.find((k) => k.key_identifier === keyID) ?? null;
  if (publicKey === null) {
    return false;
  }

  const verify = crypto.createVerify("SHA256").update(payload);
  if (!verify.verify(publicKey.key, signature, "base64")) {
    return false;
  }

  return true;
};
