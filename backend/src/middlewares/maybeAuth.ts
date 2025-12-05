import { AuthUser } from "../types/auth";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/config";

export const maybeAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) return next();

  const token = authorization.replace("Bearer ", "");

  if (!token) return next();

  req.user = jwt.verify(token, env.JWT_SECRET) as any as AuthUser;

  next();
};
