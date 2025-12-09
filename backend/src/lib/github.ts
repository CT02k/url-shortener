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

export async function verifyWebhook(
  payload: string,
  keyId: string,
  signatureBase64: string,
): Promise<boolean> {
  try {
    const response = await axios.get<GitHubSigningKeys>(
      "https://api.github.com/meta/public_keys/secret_scanning",
    );

    const keys = response.data;

    const found = keys.public_keys.find((k) => k.key_identifier === keyId);
    if (!found) {
      return false;
    }

    const pem = found.key;

    let publicKey: crypto.KeyObject;
    try {
      publicKey = crypto.createPublicKey(pem);
    } catch (err) {
      console.error("[verify] Error parsing public key PEM:", err);
      return false;
    }

    let signature: Buffer;
    try {
      signature = Buffer.from(signatureBase64, "base64");
    } catch (err) {
      console.error("[verify] Error decoding signature base64:", err);
      return false;
    }

    const digest = crypto.createHash("sha256").update(payload).digest();

    const valid = crypto.verify(null, digest, publicKey, signature);

    return valid;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("[verify] Axios error:", {
        msg: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    } else {
      console.error("[verify] Unexpected error:", err);
    }

    return false;
  }
}
