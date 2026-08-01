import { Hono } from "@hono/hono";
import routes from "./routes/routes.ts";

const PORT: number = Number(process.env.PORT) || 3001;

const app: Hono = new Hono();

app.route("/", routes);

Deno.serve({ port: PORT }, app.fetch);
