// server.ts
// Builds and configures the Express application: security headers (helmet),
// CORS, body parsing, the mounted API routes, then the 404 and error handlers.
// Kept separate from index.ts so the app can be imported for testing later.

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.ts";
import routes from "./routes/index.ts";
import { notFound } from "./middleware/not-found.ts";
import { errorHandler } from "./middleware/error-handler.ts";

export function createServer() {
  const app = express();

  app.use(helmet());

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  // TODO: mount under a versioned base path (e.g. "/api/v1").
  app.use("/", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
