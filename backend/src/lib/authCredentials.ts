import { Request } from "express";

export type Credentials = {
  bearerToken: string | null;
  apiKey: string | null;
};

export function getCredentials(req: Request): Credentials {
  const authorization = req.headers.authorization;
  const bearerToken =
    authorization && authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim() || null
      : null;

  const xApiKey = req.headers["x-api-key"];
  const apiKey = typeof xApiKey === "string" ? xApiKey.trim() || null : null;

  return { bearerToken, apiKey };
}
