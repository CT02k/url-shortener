import "dotenv/config";

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing "${name}" env variable.`);
  }
  return value;
};

const numberEnv = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: numberEnv(process.env.PORT, 3000),
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  GITHUB_PUBLIC_KEYS_TOKEN: process.env.GITHUB_PUBLIC_KEYS_TOKEN,
  JWT_SECRET: required(process.env.JWT_SECRET, "JWT_SECRET"),
  HMAC_SECRET: required(process.env.HMAC_SECRET, "HMAC_SECRET"),
  DATABASE_URL: required(process.env.DATABASE_URL, "DATABASE_URL"),
  REDIS_URL: required(process.env.REDIS_URL, "REDIS_URL"),
  BULLMQ_ANALYTICS_QUEUE: process.env.BULLMQ_ANALYTICS_QUEUE ?? "analytics",
  BULLMQ_PREFIX: process.env.BULLMQ_PREFIX ?? "bullmq",
};
