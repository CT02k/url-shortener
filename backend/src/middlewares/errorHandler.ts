import type { Request, Response, NextFunction } from "express";
import DiscordWebhook from "../lib/discord";

type JsonParseError = SyntaxError & {
  status?: number;
  type?: string;
  body?: unknown;
};

const isInvalidJsonError = (err: unknown): err is JsonParseError => {
  if (!(err instanceof SyntaxError)) return false;

  const candidate = err as JsonParseError;
  return (
    candidate.status === 400 &&
    candidate.type === "entity.parse.failed" &&
    "body" in candidate
  );
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isInvalidJsonError(err)) {
    return res.status(400).json({
      message: "Invalid JSON body",
    });
  }

  const alert = new DiscordWebhook();

  console.error(err);
  alert.sendAlert(err);

  res.status(500).json({
    message: "Internal server error",
  });
};
