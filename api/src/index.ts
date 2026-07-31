import { Hono } from "@hono/hono";
import router from "./routes/routes.ts";

const app = new Hono();

app.route("/", router);

Deno.serve({ port: 3001 }, app.fetch);
