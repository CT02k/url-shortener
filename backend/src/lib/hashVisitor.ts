import type { Request } from "express";
import { createHash } from "crypto";
import { getClientIp, getUserAgent } from "./requestInfo";

export default function getVisitorId(req: Request) {
  const ip = getClientIp(req) || "0.0.0.0";
  const ua = getUserAgent(req) || "";

  return createHash("sha256").update(`${ip}:${ua}`).digest("hex");
}
