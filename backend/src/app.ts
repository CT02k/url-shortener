import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./lib/swagger";
import { pingRouter } from "./routes/ping.routes";
import { shortenRouter } from "./routes/shorten.routes";
import { authRouter } from "./routes/auth.routes";
import { accountRouter } from "./routes/account.routes";
import { apiKeysRouter } from "./routes/api-keys.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { responses } from "./middlewares/responses";
import { registerJobs } from "./crons";
import { secretScanning } from "./controllers/secretScanning.controller";

export const createApp = (): Application => {
  const app = express();

  registerJobs();

  app.use(responses);

  app.post(
    "/github/secret_scanning",
    express.text({ type: "application/json" }),
    secretScanning,
  );

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app.use("/auth", authRouter);
  app.use("/me", accountRouter);
  app.use("/api-keys", apiKeysRouter);
  app.use("/ping", pingRouter);

  app.use("/shorten", shortenRouter);

  const swaggerDocument = generateOpenAPIDocument();
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(errorHandler);

  return app;
};
