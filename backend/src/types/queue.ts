export type AnalyticsQueuePayload = {
  slug: string;
  referrer: string;
  ip: string;
  xForwardedFor: string | undefined;
  userAgent: string;
};
