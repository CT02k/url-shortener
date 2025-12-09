import axios from "axios";
import crypto from "crypto";

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

  const keys: Record<string, any> = (
    await axios.get<GitHubSigningKeys>(
      "https://api.github.com/meta/public_keys/secret_scanning",
    )
  ).data;

  if (!Array.isArray(keys?.public_keys) || keys.length === 0) {
    return false;
  }

  const publicKey =
    keys.public_keys.find((k) => k.key_identifier === keyID) ?? null;
  if (publicKey === null) {
    return false;
  }

  const verify = crypto.createVerify("SHA256").update(payload);
  if (!verify.verify(publicKey.key, signature, "base64")) {
    return false;
  }

  return true;
};
