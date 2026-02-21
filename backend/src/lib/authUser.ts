import { JwtPayload } from "jsonwebtoken";
import { AuthUser } from "../types/auth";

export const parseAuthUser = (
  decoded: string | JwtPayload,
): AuthUser | null => {
  if (typeof decoded === "string") return null;
  if (typeof decoded.id !== "string") return null;

  return {
    id: decoded.id,
    iat: typeof decoded.iat === "number" ? decoded.iat : undefined,
  };
};
