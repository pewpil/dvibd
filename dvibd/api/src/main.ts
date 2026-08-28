import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { config } from "./config.ts";
import routes from "./routes/routes.ts";

const app = new Hono();

app.use(logger());
app.use("/*", cors({ origin: config.corsOrigin }));
app.route("/", routes);

// GET /health
app.get("/health", (c) =>
  c.json({
    name: "dvibd api",
    version: "0.0.1",
  }));

Deno.serve(
  {
    port: config.port,
  },
  app.fetch,
);
