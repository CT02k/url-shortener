import { z } from "../lib/zod";
import { validateRequest } from "../middlewares/validateRequest";

export const ApiScopeSchema = z.enum(["READ_LINKS", "WRITE_LINKS"]);

export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  scopes: z.array(ApiScopeSchema),
  createdAt: z.date(),
});

export const ApiKeyListResponseSchema = z.object({
  apiKeys: z.array(ApiKeySchema),
});

export const CreateApiKeyBodySchema = z.object({
  name: z.string().min(1),
  scopes: z.array(ApiScopeSchema).default([]),
});

export const CreateApiKeyResponseSchema = z.object({
  token: z.string(),
  apiKey: ApiKeySchema,
});

export const ApiKeyParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateApiKeyBody = z.infer<typeof CreateApiKeyBodySchema>;
export type ApiKeyParams = z.infer<typeof ApiKeyParamsSchema>;

export const apiKeyValidators = {
  createBody: validateRequest({ body: CreateApiKeyBodySchema }),
  params: validateRequest({ params: ApiKeyParamsSchema }),
};
