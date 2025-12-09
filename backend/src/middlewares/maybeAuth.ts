import { AuthUser } from "../types/auth";
import { NextFunction, Request, Response } from "express";
import { env } from "../lib/config";
import { API_KEY_PREFIX } from "../lib/tokens";
import jwt from "jsonwebtoken";

export const maybeAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) return next();

  const token = authorization.replace("Bearer ", "");

  if (!token) return next();

  if (token.startsWith(API_KEY_PREFIX)) {
    return next();
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as any as AuthUser;
  } catch {
    return res.unauthorized();
  }

  next();
};
