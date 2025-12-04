import type { Request, Response, NextFunction } from "express";
import DiscordWebhook from "../lib/discord";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const alert = new DiscordWebhook();

  console.error(err);
  alert.sendAlert(err);

  res.status(500).json({
    message: "Internal server error",
  });
};
