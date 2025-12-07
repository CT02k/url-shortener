import type { Request } from "express";
import { createHash } from "crypto";
import { getClientIp } from "./requestInfo";

export default function getVisitorId(req: Request) {
  const ip = getClientIp(req) || "0.0.0.0";

  return createHash("sha256").update(ip).digest("hex");
}
