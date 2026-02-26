import { createHash } from "crypto";

export default function getVisitorId(
  ip: string | undefined,
  userAgent: string | undefined,
): string {
  return createHash("sha256")
    .update("visitor-" + (ip || "unknown") + "-" + (userAgent || "unknown"))
    .digest("hex");
}
