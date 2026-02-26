import { Worker } from "bullmq";

import { env } from "./lib/config";
import { redis } from "./lib/redis";
import DiscordWebhook from "./lib/discord";

import { analyticsProcessor } from "./processors/analytics.processor";

const webhook = new DiscordWebhook();

const worker = new Worker(env.BULLMQ_ANALYTICS_QUEUE, analyticsProcessor, {
  connection: redis,
  prefix: env.BULLMQ_PREFIX,
  concurrency: 50,
});

worker.once("ready", () => {
  console.log("[WORKER] Analytics worker is ready and listening for jobs...");
});

worker.on("completed", (job) => {
  console.log(`[WORKER] Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, err) => {
  const errorMessage = `[WORKER] Job ${job?.id ?? "unknown"} failed with error: ${err.message}`;

  webhook.sendAlert(errorMessage);
  console.error(errorMessage);
});

worker.on("error", (err) => {
  const errorMessage = `[WORKER] Connection error: ${err?.message ?? err}`;

  webhook.sendAlert(errorMessage);
  console.error(errorMessage);
});
