import { AuthUser } from "../types/auth";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/config";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return req.unauthorized();
  }

  const token = authorization.replace("Bearer ", "");

  if (!token) next();

  req.user = jwt.verify(token, env.JWT_SECRET) as any as AuthUser;

  next();
};
