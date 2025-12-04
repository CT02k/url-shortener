import { Router } from "express";
import { ping } from "../controllers/ping.controller";
import { registerPingDocs } from "../docs/ping.docs";

export const pingRouter = Router();

registerPingDocs();

pingRouter.get("/", ping);
