import { registry } from "../lib/swagger";
import { z } from "../lib/zod";

export const PingResponseSchema = z.object({
  latency: z.number(),
  unit: z.literal("ms"),
});

export const registerPingDocs = () => {
  registry.register("PingResponse", PingResponseSchema);

  registry.registerPath({
    method: "get",
    path: "/ping",
    summary: "Health check with latency measurement",
    description:
      "Returns the current API latency in milliseconds. Useful for monitoring and performance diagnostics.",
    tags: ["System"],
    security: [],
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
};
