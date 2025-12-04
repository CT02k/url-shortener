import { validateRequest } from "../middlewares/validateRequest";
import { z } from "../lib/zod";

export const ShortenedUrlSchema = z.object({
  slug: z.string(),
  redirect: z.string().url(),
});

export const ShortenedUrlStatsSchema = z.object({
  id: z.number(),
  slug: z.string(),
  clicks: z.number(),
  uniqueClicks: z.number(),
  lastClickAt: z.date(),
});

export const CreateShortenBodySchema = z.object({
  redirect: z.string().url(),
});

export const ShortenParamsSchema = z.object({
  slug: z.string(),
});

export type CreateShortenBody = z.infer<typeof CreateShortenBodySchema>;
export type ShortenParams = z.infer<typeof ShortenParamsSchema>;

export const shortenValidators = {
  params: validateRequest({ params: ShortenParamsSchema }),
  createBody: validateRequest({ body: CreateShortenBodySchema }),
};
