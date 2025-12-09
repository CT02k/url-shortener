import { registry } from "../lib/swagger";
import {
  ApiKeyListResponseSchema,
  ApiKeyParamsSchema,
  ApiKeySchema,
  CreateApiKeyBodySchema,
  CreateApiKeyResponseSchema,
} from "../validators/api-keys.validator";

export const registerApiKeysDocs = () => {
  registry.register("ApiKey", ApiKeySchema);

  registry.registerPath({
    method: "get",
    path: "/api-keys",
    summary: "List API keys for the authenticated user",
    tags: ["API Keys"],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "API keys",
        content: {
          "application/json": {
            schema: ApiKeyListResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api-keys",
    summary: "Create a new API key",
    tags: ["API Keys"],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateApiKeyBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "API key created",
        content: {
          "application/json": {
            schema: CreateApiKeyResponseSchema,
          },
        },
      },
      400: {
        description: "Validation error",
      },
      401: {
        description: "Unauthorized",
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api-keys/{id}",
    summary: "Revoke an API key",
    tags: ["API Keys"],
    security: [{ bearerAuth: [] }],
    request: {
      params: ApiKeyParamsSchema,
    },
    responses: {
      204: {
        description: "API key revoked",
      },
      401: {
        description: "Unauthorized",
      },
      404: {
        description: "API key not found",
      },
    },
  });
};
