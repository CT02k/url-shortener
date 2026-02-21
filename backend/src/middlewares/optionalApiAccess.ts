import { apiScope } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { validateToken } from "../lib/tokens";
import { getCredentials } from "../lib/authCredentials";

const hasRequiredScopes = (tokenScopes: apiScope[], required: apiScope[]) =>
  required.every((scope) => tokenScopes.includes(scope));

export const optionalApiAccess =
  (requiredScopes: apiScope[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) return next();

    const { bearerToken, apiKey: xApiKey } = getCredentials(req);
    const rawKey = xApiKey ?? bearerToken;

    if (!rawKey) return next();

    const apiKey = await validateToken(rawKey);
    if (!apiKey) return res.unauthorized();

    if (!hasRequiredScopes(apiKey.scopes, requiredScopes)) {
      return res.status(403).json({ message: "Insufficient scope" });
    }

    req.apiKey = {
      id: apiKey.id,
      name: apiKey.name,
      userId: apiKey.userId,
      scopes: apiKey.scopes,
      createdAt: apiKey.createdAt,
    };

    return next();
  };
