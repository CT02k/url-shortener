"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingRouter = void 0;
const express_1 = require("express");
const swagger_1 = require("../lib/swagger");
const zod_1 = require("../lib/zod");
exports.pingRouter = (0, express_1.Router)();
const PingResponseSchema = zod_1.z.object({
    latency: zod_1.z.number(),
    unit: zod_1.z.literal("ms"),
});
swagger_1.registry.register("PingResponse", PingResponseSchema);
swagger_1.registry.registerPath({
    method: "get",
    path: "/ping",
    summary: "Health check with latency measurement",
    description: "Returns the current API latency in milliseconds. Useful for monitoring and performance diagnostics.",
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
exports.pingRouter.get("/", async (req, res, next) => {
    const start = process.hrtime.bigint();
    try {
        const end = process.hrtime.bigint();
        const latencyMs = Number(end - start) / 1000000;
        res.json({
            latency: Number(latencyMs.toFixed(3)),
            unit: "ms",
        });
    }
    catch (err) {
        next(err);
    }
});
