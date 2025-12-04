import { validateRequest } from "../middlewares/validateRequest";
import { z } from "../lib/zod";

export const RegisterBodySchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(6).max(128),
});

export const LoginBodySchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(6).max(128),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;

export const authValidators = {
  registerBody: validateRequest({ body: RegisterBodySchema }),
  loginBody: validateRequest({ body: LoginBodySchema }),
};
