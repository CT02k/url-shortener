import { NextFunction, Request, Response } from "express";

export const responses = (req: Request, res: Response, next: NextFunction) => {
  req.unauthorized = () => {
    return res.status(401).json({ message: "Unauthorized" });
  };

  next();
};
