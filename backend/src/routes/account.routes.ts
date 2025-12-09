import { Router } from "express";
import {
  deleteMyLink,
  getProfile,
  listMyLinks,
} from "../controllers/account.controller";
import { registerAccountDocs } from "../docs/account.docs";
import { requireAuth } from "../middlewares/requireAuth";
import { accountValidators } from "../validators/account.validator";
import { requireApiAccess } from "../middlewares/requireApiAccess";
import { apiScope } from "@prisma/client";
import { maybeAuth } from "../middlewares/maybeAuth";

export const accountRouter = Router();

registerAccountDocs();

accountRouter.get("/", requireAuth, getProfile);
accountRouter.get(
  "/links",
  maybeAuth,
  requireApiAccess([apiScope.READ_LINKS]),
  accountValidators.linksQuery,
  listMyLinks,
);
accountRouter.delete(
  "/links/:slug",
  requireAuth,
  accountValidators.linkParams,
  deleteMyLink,
);
