import { RequestHandler } from "express";
import { GithubRequestBody, verifyWebhook } from "../lib/github";
import { prisma } from "../lib/prisma";
import { alertTypes } from "@prisma/client";
import { hashToken } from "../lib/tokens";

const isSecretScanningItem = (
  value: unknown,
): value is GithubRequestBody[number] => {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.token === "string" &&
    typeof item.type === "string" &&
    typeof item.source === "string" &&
    (typeof item.url === "string" || typeof item.url === "undefined")
  );
};

export const secretScanning: RequestHandler = async (req, res, next) => {
  try {
    const rawBody = typeof req.body === "string" ? req.body : "";

    const isValidSignature = await verifyWebhook(
      rawBody,
      req.headers["github-public-key-signature"]?.toString() ?? "",
      req.headers["github-public-key-identifier"]?.toString() ?? "",
    );

    if (!isValidSignature) {
      return res.unauthorized();
    }

    let payload: unknown;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ message: "Invalid JSON payload" });
    }

    if (!Array.isArray(payload) || !payload.every(isSecretScanningItem)) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    for (const data of payload) {
      const token = await prisma.apiToken.findUnique({
        where: {
          hash: hashToken(data.token),
        },
      });

      if (!token) continue;

      await prisma.$transaction([
        prisma.apiToken.delete({
          where: {
            id: token.id,
          },
        }),
        prisma.alert.create({
          data: {
            type: alertTypes.TOKEN_LEAK,
            title: "Your token has been compromised",
            content: data.source,
            userId: token.userId,
          },
        }),
      ]);
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
