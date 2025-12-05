import { AuthUser } from "./auth";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUser;
      unauthorized: () => void;
    }
  }
}

export {};
