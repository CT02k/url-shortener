import { Router } from "express";
import {
  createApiKey,
  deleteApiKey,
  listApiKeys,
} from "../controllers/api-keys.controller";
import { registerApiKeysDocs } from "../docs/api-keys.docs";
import { requireAuth } from "../middlewares/requireAuth";
import { apiKeyValidators } from "../validators/api-keys.validator";

export const apiKeysRouter = Router();

registerApiKeysDocs();

apiKeysRouter.get("/", requireAuth, listApiKeys);
apiKeysRouter.post("/", requireAuth, apiKeyValidators.createBody, createApiKey);
apiKeysRouter.delete(
  "/:id",
  requireAuth,
  apiKeyValidators.params,
  deleteApiKey,
);
