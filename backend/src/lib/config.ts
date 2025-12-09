import "dotenv/config";

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`❌ Missing "${name}" env variable.`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  JWT_SECRET: required(process.env.JWT_SECRET, "JWT_SECRET"),
  HMAC_SECRET: required(process.env.HMAC_SECRET, "HMAC_SECRET"),
  DATABASE_URL: required(process.env.DATABASE_URL, "DATABASE_URL"),
};
