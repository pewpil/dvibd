import { Hono } from "@hono/hono";

const router: Hono = new Hono();

interface User {
  name: string;
  password: string;
}

router.get("/login", async function(c) {
  const user: User = await c.req.json();
  return c.json(user);
});

export default router;
