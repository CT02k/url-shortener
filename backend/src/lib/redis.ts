import { Redis } from "ioredis";
import { env } from "./config";

export const redis = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

redis.on("connect", () => {
  console.log("[REDIS] connecting...");
});

redis.on("ready", () => {
  console.log("[REDIS] ready");
});

redis.on("reconnecting", () => {
  console.warn("[REDIS] reconnecting...");
});

redis.on("error", (err) => {
  console.error("[REDIS] error:", err?.message ?? err);
});
