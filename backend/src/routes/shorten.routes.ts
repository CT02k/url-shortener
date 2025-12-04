import { Router } from "express";
import { prisma } from "../lib/prisma";
import { registry } from "../lib/swagger";
import { validateRequest } from "../middlewares/validateRequest";
import { z } from "../lib/zod";

export const shortenRouter = Router();

const ShortenedUrlSchema = z.object({
  slug: z.string(),
  redirect: z.string().url(),
});

const CreateShortenBodySchema = z.object({
  redirect: z.string().url(),
});

const ShortenParamsSchema = z.object({
  slug: z.string(),
});

type CreateShortenBody = z.infer<typeof CreateShortenBodySchema>;
type ShortenParams = z.infer<typeof ShortenParamsSchema>;

registry.register("ShortenedUrl", ShortenedUrlSchema);

registry.registerPath({
  method: "get",
  path: "/shorten/{slug}",
  summary: "Get shorten URL data by slug",
  tags: ["Shortener"],
  request: {
    params: ShortenParamsSchema,
  },
  responses: {
    200: {
      description: "URL Data",
      content: {
        "application/json": {
          schema: ShortenedUrlSchema,
        },
      },
    },
    404: {
      description: "Not found",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/shorten",
  summary: "Create a new shortened URL",
  tags: ["Shortener"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateShortenBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Shortened URL created",
      content: {
        "application/json": {
          schema: ShortenedUrlSchema,
        },
      },
    },
    400: {
      description: "Missing or invalid redirect",
    },
  },
});

shortenRouter.get(
  "/:slug",
  validateRequest({ params: ShortenParamsSchema }),
  async (req, res, next) => {
    try {
      const { slug } = req.params as ShortenParams;

      const data = await prisma.shortenedUrl.findUnique({
        where: {
          slug: slug,
        },
      });

      if (!data) {
        return res.status(404).json({
          message: "Not found",
        });
      }

      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

shortenRouter.post(
  "/",
  validateRequest({ body: CreateShortenBodySchema }),
  async (req, res, next) => {
    try {
      const { redirect } = req.body as CreateShortenBody;

      const data = await prisma.shortenedUrl.create({
        data: {
          redirect,
        },
      });

      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);
