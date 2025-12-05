import { registry } from "../lib/swagger";
import {
  AuthResponseSchema,
  LoginBodySchema,
  RegisterBodySchema,
} from "../validators/auth.validator";

export const registerAuthDocs = () => {
  registry.register("AuthResponse", AuthResponseSchema);

  registry.registerPath({
    method: "post",
    path: "/auth/register",
    summary: "Create a new account",
    tags: ["Auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: RegisterBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "User registered",
        content: {
          "application/json": {
            schema: AuthResponseSchema,
          },
        },
      },
      400: {
        description: "Validation error",
      },
      409: {
        description: "Username already exists",
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/auth/login",
    summary: "Authenticate and get a token",
    tags: ["Auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Authenticated",
        content: {
          "application/json": {
            schema: AuthResponseSchema,
          },
        },
      },
      400: {
        description: "Validation error",
      },
      401: {
        description: "Invalid credentials",
      },
    },
  });
};
