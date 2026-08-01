import { Hono } from "@hono/hono";

const routes: Hono = new Hono();

routes.get("/dev", function(c) {
  return c.json({ message: "hello" });
});

export default routes;
