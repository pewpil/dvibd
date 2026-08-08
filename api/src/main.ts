import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import routes from "./routes/routes.ts";

const app = new Hono();

app.use(logger());
app.use("/api/*", cors({ origin: Deno.env.get("CORS_ORIGIN") ?? "*" }));

app.get("/", (c) => c.text("dvibd api"));

app.get("/api", (c) =>
  c.json({
    name: "dvibd api",
    version: "0.0.1",
  }));

app.get("/api/health", (c) =>
  c.json({
    status: "ok",
  }));

app.route("/api", routes);

Deno.serve(
  {
    port: Number(Deno.env.get("PORT") ?? 8000),
  },
  app.fetch,
);
