import { z } from "../lib/zod";
import { validateRequest } from "../middlewares/validateRequest";

export const ShortenedUrlSchema = z.object({
  slug: z.string(),
  redirect: z.string().url(),
});

export const ShortenedUrlStatsSchema = z.object({
  id: z.number(),
  slug: z.string(),
  clicks: z.number(),
  uniqueClicks: z.number(),
  lastClickAt: z.date().nullable(),
});

const TimeRangeSchema = z.enum(["hour", "day", "week", "month"]);

const ReferrerCountSchema = z.object({
  referrer: z.string(),
  count: z.number(),
});

const BrowserCountSchema = z.object({
  browser: z.string(),
  count: z.number(),
});

const CountryCountSchema = z.object({
  country: z.string(),
  count: z.number(),
});

export const ShortenStatsResponseSchema = z.object({
  slug: z.string(),
  total: z.object({
    clicks: z.number(),
    uniqueClicks: z.number(),
    lastClickAt: z.date().nullable(),
  }),
  range: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
      clicks: z.number(),
      uniqueVisitors: z.number(),
      topReferrers: z.array(ReferrerCountSchema),
      topBrowsers: z.array(BrowserCountSchema),
      topCountries: z.array(CountryCountSchema),
    })
    .nullable(),
});

export const ShortenStatsQuerySchema = z.object({
  range: TimeRangeSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const CreateShortenBodySchema = z.object({
  redirect: z.string().url(),
  expiresAt: z.coerce.date().optional(),
  password: z.string().optional(),
});

export const ShortenParamsSchema = z.object({
  slug: z.string(),
  password: z.string().optional(),
});

export type CreateShortenBody = z.infer<typeof CreateShortenBodySchema>;
export type ShortenParams = z.infer<typeof ShortenParamsSchema>;
export type ShortenStatsQuery = z.infer<typeof ShortenStatsQuerySchema>;

export const shortenValidators = {
  params: validateRequest({ params: ShortenParamsSchema }),
  createBody: validateRequest({ body: CreateShortenBodySchema }),
  statsQuery: validateRequest({ query: ShortenStatsQuerySchema }),
};
