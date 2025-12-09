import { registry } from "../lib/swagger";
import {
  CreateShortenBodySchema,
  ShortenParamsSchema,
  ShortenStatsQuerySchema,
  ShortenedUrlSchema,
  ShortenStatsResponseSchema,
} from "../validators/shorten.validator";

export const registerShortenDocs = () => {
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
    method: "get",
    path: "/shorten/{slug}/redirect",
    summary: "Redirect to the final destination",
    tags: ["Shortener"],
    responses: {
      302: {
        description: "Redirects to the target URL",
        headers: {
          Location: {
            description: "URL",
            schema: {
              type: "string",
              format: "uri",
            },
          },
        },
      },
      404: {
        description: "Not found",
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/shorten/{slug}/stats",
    summary: "Get URL stats",
    tags: ["Shortener"],
    request: {
      params: ShortenParamsSchema,
      query: ShortenStatsQuerySchema,
    },
    responses: {
      200: {
        description: "URL Stats",
        content: {
          "application/json": {
            schema: ShortenStatsResponseSchema,
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
    security: [{ bearerAuth: [] }],
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
      401: {
        description: "Missing or invalid credentials",
      },
      403: {
        description: "API key does not have the required scope",
      },
    },
  });
};
