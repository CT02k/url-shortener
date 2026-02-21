import { apiScope } from "@prisma/client";
import { Router } from "express";
import {
  createShorten,
  getShorten,
  getShortenStats,
  redirectShorten,
} from "../controllers/shorten.controller";
import { registerShortenDocs } from "../docs/shorten.docs";
import { maybeAuth } from "../middlewares/maybeAuth";
import { requireApiAccess } from "../middlewares/requireApiAccess";
import { shortenValidators } from "../validators/shorten.validator";
import { optionalApiAccess } from "../middlewares/optionalApiAccess";

export const shortenRouter = Router();

registerShortenDocs();

shortenRouter.get("/:slug", shortenValidators.params, getShorten);

shortenRouter.get("/:slug/redirect", shortenValidators.params, redirectShorten);

shortenRouter.get(
  "/:slug/stats",
  shortenValidators.params,
  shortenValidators.statsQuery,
  getShortenStats,
);

shortenRouter.post(
  "/",
  maybeAuth,
  optionalApiAccess([apiScope.WRITE_LINKS]),
  shortenValidators.createBody,
  createShorten,
);
