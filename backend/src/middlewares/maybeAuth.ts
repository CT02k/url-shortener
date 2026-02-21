import { NextFunction, Request, Response } from "express";
import { env } from "../lib/config";
import jwt from "jsonwebtoken";
import { getCredentials } from "../lib/authCredentials";
import { parseAuthUser } from "../lib/authUser";

export const maybeAuth = (req: Request, res: Response, next: NextFunction) => {
  const { bearerToken } = getCredentials(req);

  if (!bearerToken) return next();

  try {
    const decoded = jwt.verify(bearerToken, env.JWT_SECRET);
    const user = parseAuthUser(decoded);

    if (!user) return res.unauthorized();

    req.user = user;
    return next();
  } catch {
    return res.unauthorized();
  }
};
