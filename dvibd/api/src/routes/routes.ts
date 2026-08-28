import { Hono } from "@hono/hono";
import auth from "./auth.ts";

const routes: Hono = new Hono();

routes.route("/auth", auth);

export default routes;
