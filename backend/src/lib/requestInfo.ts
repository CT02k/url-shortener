import type { Request } from "express";

export const getClientIp = (req: Request): string | undefined => {
  const forwardedFor = req.headers["x-forwarded-for"];

  const ipFromHeader =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0]?.trim()
      : Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : undefined;

  const ip = ipFromHeader || req.ip || undefined;

  if (!ip) return undefined;

  return ip.replace(/^::ffff:/, "");
};

export const getReferrer = (req: Request): string | undefined => {
  const referrer = req.params.ref;

  return referrer || "Unknown";
};

export const getUserAgent = (req: Request): string | undefined => {
  const ua = req.get("user-agent");

  return ua || undefined;
};

export const getBrowserFromUserAgent = (
  userAgent?: string,
): string | undefined => {
  if (!userAgent) return undefined;

  const ua = userAgent.toLowerCase();

  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("chrome/") && !ua.includes("chromium")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("brave/")) return "Brave";
  if (ua.includes("vivaldi")) return "Vivaldi";

  return "Other";
};
