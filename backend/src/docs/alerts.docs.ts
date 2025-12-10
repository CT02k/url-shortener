import { registry } from "../lib/swagger";
import {
  AlertParamsSchema,
  AlertSchema,
  AlertsResponseSchema,
} from "../validators/alerts.validator";

export const registerAlertsDocs = () => {
  registry.register("Alert", AlertSchema);

  registry.registerPath({
    method: "get",
    path: "/alerts",
    summary: "List alerts for the authenticated user",
    tags: ["Alerts"],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "User alerts",
        content: {
          "application/json": {
            schema: AlertsResponseSchema,
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
    path: "/alerts/{alertId}",
    summary: "Delete an alert for the authenticated user",
    tags: ["Alerts"],
    security: [{ bearerAuth: [] }],
    request: {
      params: AlertParamsSchema,
    },
    responses: {
      204: {
        description: "Alert deleted",
      },
      401: {
        description: "Unauthorized",
      },
      404: {
        description: "Alert not found",
      },
    },
  });
};
