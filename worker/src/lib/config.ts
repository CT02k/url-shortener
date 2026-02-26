import "dotenv/config";

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing "${name}" env variable.`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  DATABASE_URL: required(process.env.DATABASE_URL, "DATABASE_URL"),
  REDIS_URL: required(process.env.REDIS_URL, "REDIS_URL"),
  BULLMQ_ANALYTICS_QUEUE: process.env.BULLMQ_ANALYTICS_QUEUE ?? "analytics",
  BULLMQ_PREFIX: process.env.BULLMQ_PREFIX ?? "bullmq",
};
