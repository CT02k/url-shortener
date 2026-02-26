import Bowser from "bowser";

export const getClientIp = (
  ip: string | undefined,
  xForwardedFor: string | string[] | undefined,
): string | undefined => {
  const ipFromHeader =
    typeof xForwardedFor === "string"
      ? xForwardedFor.split(",")[0]?.trim()
      : Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : undefined;

  const addr = ipFromHeader || ip;

  if (!addr) return undefined;

  return addr.replace(/^::ffff:/, "");
};

export const getBrowserFromUserAgent = (userAgent?: string): string => {
  if (!userAgent) return "Other";

  const browser = Bowser.getParser(userAgent).getBrowserName();

  return browser.length > 0 ? browser : "Other";
};
