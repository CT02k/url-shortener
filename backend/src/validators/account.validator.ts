import { validateRequest } from "../middlewares/validateRequest";
import { z } from "../lib/zod";
import { ShortenParamsSchema, ShortenedUrlSchema } from "./shorten.validator";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  createdAt: z.date(),
});

export const AccountLinksQuerySchema = z.object({
  page: z.coerce.number().int().positive().max(10_000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type AccountLinksQuery = z.infer<typeof AccountLinksQuerySchema>;

export const accountValidators = {
  linksQuery: validateRequest({ query: AccountLinksQuerySchema }),
  linkParams: validateRequest({ params: ShortenParamsSchema }),
};

export const AccountLinksResponseSchema = z.array(ShortenedUrlSchema);
