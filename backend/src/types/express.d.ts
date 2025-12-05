import { AuthUser } from "./auth";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUser;
    }
    export interface Response {
      unauthorized: () => void;
      notFound: () => void;
    }
  }
}

export {};
