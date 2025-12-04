import type { Request } from "express";
import { createHash } from "crypto";

export default function getVisitorId(req: Request) {
  const ip = req.ip || "0.0.0.0";
  const ua = req.headers["user-agent"] || "";

  return createHash("sha256").update(`${ip}:${ua}`).digest("hex");
}
