import { Router } from "express";

export const pingRouter = Router();

/**
 * @openapi
 * /ping:
 *   get:
 *     summary: Health check with latency measurement
 *     description: |
 *       Returns the current API latency in milliseconds.
 *       Useful for monitoring and performance diagnostics.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Current API latency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 latency:
 *                   type: number
 *                   example: 2.34
 *                 unit:
 *                   type: string
 *                   example: ms
 */
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
