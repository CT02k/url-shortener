import { RequestHandler } from "express";

export const ping: RequestHandler = async (req, res, next) => {
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
};
