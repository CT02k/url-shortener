import { Router } from "express";
import { registry } from "../lib/swagger";
import { z } from "../lib/zod";

export const pingRouter = Router();

const PingResponseSchema = z.object({
  latency: z.number(),
  unit: z.literal("ms"),
});

registry.register("PingResponse", PingResponseSchema);

registry.registerPath({
  method: "get",
  path: "/ping",
  summary: "Health check with latency measurement",
  description:
    "Returns the current API latency in milliseconds. Useful for monitoring and performance diagnostics.",
  tags: ["System"],
  responses: {
    200: {
      description: "Current API latency",
      content: {
        "application/json": {
          schema: PingResponseSchema,
        },
      },
    },
  },
});

pingRouter.get("/", async (req, res, next) => {
  const start = process.hrtime.bigint();

  try {
    const end = process.hrtime.bigint();
    const latencyMs = Number(end - start) / 1_000_000;

    res.json({
      latency: Number(latencyMs.toFixed(3)),
      unit: "ms",
    });
  } catch (err) {
    next(err);
  }
});
