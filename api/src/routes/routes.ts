import { Hono } from "@hono/hono";
import auth from "./auth.ts";
import registerErrorHandler from "./error.ts";

const routes: Hono = new Hono();

routes.route("/auth", auth);
// registerErrorHandler(routes);

export default routes;
