import { Job } from "bullmq";
import getVisitorId from "../../lib/hashVisitor";
import { lookupCountryByIp } from "../../lib/ipapi";
import { getClientIp, getBrowserFromUserAgent } from "../../lib/requestInfo";
import { AnalyticsQueuePayload } from "../../types/queue";
import { trackAnalytics } from "../services/analytics.service";

export const analyticsProcessor = async (job: Job<AnalyticsQueuePayload>) => {
  const payload = job.data;

  const ip = getClientIp(payload.ip, payload.xForwardedFor);
  const visitorId = getVisitorId(ip, payload.userAgent);
  const browser = getBrowserFromUserAgent(payload.userAgent);
  const country = (await lookupCountryByIp(ip))?.country ?? null;

  await trackAnalytics({
    slug: payload.slug,
    visitorId,
    referrer: payload.referrer,
    userAgent: payload.userAgent,
    browser,
    country,
  });
};
