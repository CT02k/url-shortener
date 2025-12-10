import { Router } from "express";
import { deleteAlert, listAlerts } from "../controllers/alerts.controller";
import { registerAlertsDocs } from "../docs/alerts.docs";
import { requireAuth } from "../middlewares/requireAuth";
import { alertsValidators } from "../validators/alerts.validator";

export const alertsRouter = Router();

registerAlertsDocs();

alertsRouter.get("/", requireAuth, listAlerts);

alertsRouter.delete(
  "/:alertId",
  requireAuth,
  alertsValidators.alertParams,
  deleteAlert,
);
