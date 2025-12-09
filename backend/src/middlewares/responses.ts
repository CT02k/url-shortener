import { NextFunction, Request, Response } from "express";
import { verifyWebhook } from "../lib/github";

export const responses = (req: Request, res: Response, next: NextFunction) => {
  res.unauthorized = () => {
    return res.status(401).json({ message: "Unauthorized" });
  };

  res.notFound = () => {
    return res.status(404).json({ message: "Not found" });
  };

  req.verifyWebhook = () => {
    return verifyWebhook(
      req.body,
      req.headers["github-public-key-identifier"]?.toString() ?? "",
      req.headers["github-public-key-signature"]?.toString() ?? "",
    );
  };

  next();
};
