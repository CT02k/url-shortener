import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

type RequestValidationSchema = {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

export const validateRequest =
  (schema: RequestValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        Object.keys(req.query as Record<string, unknown>).forEach((key) => {
          delete (req.query as Record<string, unknown>)[key];
        });
        Object.assign(req.query as Record<string, unknown>, parsedQuery);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          issues: err.issues,
        });
      }

      next(err);
    }
  };
