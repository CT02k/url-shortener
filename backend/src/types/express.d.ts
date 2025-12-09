import { apiScope } from "@prisma/client";
import { AuthUser } from "./auth";

type RequestApiKey = {
  id: string;
  name: string;
  userId: string;
  scopes: apiScope[];
  createdAt: Date;
};

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUser;
      apiKey?: RequestApiKey;
      verifyWebhook: () => Promise<boolean>;
    }
    export interface Response {
      unauthorized: () => void;
      notFound: () => void;
    }
  }
}

export {};
