import { Hono } from "@hono/hono";

const router: Hono = new Hono();

router.post("/signup", async function(c) {
  //TODO: implement POST /signup endpoint
});

router.post("/login", async function(c) {
  //TODO: implement POST /login endpoint
});

export default router;
