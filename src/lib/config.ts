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
  DATABASE_URL: required(process.env.DATABASE_URL, "DATABASE_URL"),
};
