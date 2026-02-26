import { Queue } from "bullmq";
import { redis } from "./redis";
import { env } from "./config";

export const analyticsQueue = new Queue(env.BULLMQ_ANALYTICS_QUEUE, {
  connection: redis,
  prefix: env.BULLMQ_PREFIX,
});

analyticsQueue.on("error", (err) => {
  console.error("[queue] connection error:", err?.message ?? err);
});
