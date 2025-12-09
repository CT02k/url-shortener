import { apiScope, apiToken } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { validateToken } from "../lib/tokens";

const extractApiKey = (req: Request): string | null => {
  const authorization = req.headers.authorization;

  if (authorization?.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  const apiKeyHeader = req.headers["x-api-key"];

  if (typeof apiKeyHeader === "string") return apiKeyHeader;

  return null;
};

type ApiKeyInfo = Pick<
  apiToken,
  "id" | "name" | "userId" | "scopes" | "createdAt"
>;

const hasRequiredScopes = (tokenScopes: apiScope[], required: apiScope[]) =>
  required.every((scope) => tokenScopes.includes(scope));

export const requireApiAccess =
  (requiredScopes: apiScope[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) return next();

    const rawKey = extractApiKey(req);

    if (!rawKey) {
      return res.unauthorized();
    }

    const apiKey = await validateToken(rawKey);

    if (!apiKey) {
      return res.unauthorized();
    }

    if (!hasRequiredScopes(apiKey.scopes, requiredScopes)) {
      return res.status(403).json({ message: "Insufficient scope" });
    }

    const { id, name, userId, scopes, createdAt } = apiKey;

    req.apiKey = { id, name, userId, scopes, createdAt } as ApiKeyInfo;

    return next();
  };
