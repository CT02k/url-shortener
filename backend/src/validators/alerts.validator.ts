import { alertTypes } from "@prisma/client";
import { validateRequest } from "../middlewares/validateRequest";
import { z } from "../lib/zod";

export const AlertSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  type: z.nativeEnum(alertTypes),
});

export const AlertsResponseSchema = z.array(AlertSchema);

export const AlertParamsSchema = z.object({
  alertId: z.string().uuid(),
});

export const alertsValidators = {
  alertParams: validateRequest({ params: AlertParamsSchema }),
};
