import { Hono } from "@hono/hono";
import authRouter from "./auth.ts";

const app: Hono = new Hono();

app.route("/auth", authRouter);

export default app;
