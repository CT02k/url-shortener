import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/config";
import { getCredentials } from "../lib/authCredentials";
import { parseAuthUser } from "../lib/authUser";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { bearerToken } = getCredentials(req);
  if (!bearerToken) {
    return res.unauthorized();
  }

  try {
    const decoded = jwt.verify(bearerToken, env.JWT_SECRET);
    const user = parseAuthUser(decoded);

    if (!user) return res.unauthorized();

    req.user = user;
  } catch {
    return res.unauthorized();
  }

  return next();
};
