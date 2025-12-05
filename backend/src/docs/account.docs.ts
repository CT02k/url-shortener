import { registry } from "../lib/swagger";
import {
  AccountLinksQuerySchema,
  AccountLinksResponseSchema,
  UserSchema,
} from "../validators/account.validator";
import { ShortenParamsSchema } from "../validators/shorten.validator";

export const registerAccountDocs = () => {
  registry.register("User", UserSchema);

  registry.registerPath({
    method: "get",
    path: "/me",
    summary: "Get current user profile",
    tags: ["Account"],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Current user",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/me/links",
    summary: "List links for the current user",
    tags: ["Account"],
    security: [{ bearerAuth: [] }],
    request: {
      query: AccountLinksQuerySchema,
    },
    responses: {
      200: {
        description: "Links owned by the user",
        content: {
          "application/json": {
            schema: AccountLinksResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/me/links/{slug}",
    summary: "Delete a link owned by the current user",
    tags: ["Account"],
    security: [{ bearerAuth: [] }],
    request: {
      params: ShortenParamsSchema,
    },
    responses: {
      204: {
        description: "Link deleted",
      },
      401: {
        description: "Unauthorized",
      },
      404: {
        description: "Link not found",
      },
    },
  });
};
