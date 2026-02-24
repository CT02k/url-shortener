import { registry } from "../lib/swagger";
import { z } from "../lib/zod";

const HealthResponseSchema = z.object({
  status: z.literal("ok"),
});

const SecretScanningHeadersSchema = z.object({
  "github-public-key-signature": z.string(),
  "github-public-key-identifier": z.string(),
});

const SecretScanningItemSchema = z.object({
  token: z.string(),
  type: z.string(),
  source: z.string(),
  url: z.string().optional(),
});

const ErrorMessageSchema = z.object({
  message: z.string(),
});

export const registerSystemDocs = () => {
  registry.registerPath({
    method: "get",
    path: "/health",
    summary: "Simple health check",
    tags: ["System"],
    security: [],
    responses: {
      200: {
        description: "Service is healthy",
        content: {
          "application/json": {
            schema: HealthResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/github/secret_scanning",
    summary: "GitHub secret scanning webhook",
    tags: ["System"],
    security: [],
    request: {
      headers: SecretScanningHeadersSchema,
      body: {
        content: {
          "application/json": {
            schema: z.array(SecretScanningItemSchema),
          },
        },
      },
    },
    responses: {
      204: {
        description: "Webhook processed",
      },
      400: {
        description: "Invalid payload",
        content: {
          "application/json": {
            schema: ErrorMessageSchema,
          },
        },
      },
      401: {
        description: "Invalid signature",
        content: {
          "application/json": {
            schema: ErrorMessageSchema,
          },
        },
      },
    },
  });
};
