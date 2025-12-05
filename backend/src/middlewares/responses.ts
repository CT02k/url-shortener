import { NextFunction, Request, Response } from "express";

export const responses = (_req: Request, res: Response, next: NextFunction) => {
  res.unauthorized = () => {
    return res.status(401).json({ message: "Unauthorized" });
  };

  res.notFound = () => {
    return res.status(404).json({ message: "Not found" });
  };

  next();
};
