// routes/index.ts
// Root router: mounts feature/module routers and cross-cutting routes like
// /health. server.ts mounts this under the API base path.

import { Router } from "express";

import healthRoute from "./health.route.ts";

const router = Router();

router.use("/health", healthRoute);

// TODO: mount module routers, e.g.
// router.use("/users", usersRoutes);

export default router;
