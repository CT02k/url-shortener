import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { registerAuthDocs } from "../docs/auth.docs";
import { authValidators } from "../validators/auth.validator";

export const authRouter = Router();

registerAuthDocs();

authRouter.post("/register", authValidators.registerBody, register);
authRouter.post("/login", authValidators.loginBody, login);
