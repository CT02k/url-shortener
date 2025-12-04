import { Router } from "express";
import {
  createShorten,
  getShorten,
  getShortenStats,
  redirectShorten,
} from "../controllers/shorten.controller";
import { registerShortenDocs } from "../docs/shorten.docs";
import { shortenValidators } from "../validators/shorten.validator";

export const shortenRouter = Router();

registerShortenDocs();

shortenRouter.get("/:slug", shortenValidators.params, getShorten);

shortenRouter.get("/:slug/redirect", shortenValidators.params, redirectShorten);

shortenRouter.get("/:slug/stats", shortenValidators.params, getShortenStats);

shortenRouter.post("/", shortenValidators.createBody, createShorten);
