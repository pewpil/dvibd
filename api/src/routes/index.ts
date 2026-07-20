// routes/index.ts
// Root router: mounts feature/module routers and cross-cutting routes like
// /health. server.ts mounts this under the API base path.

import { Router } from "express";

import healthRoute from "./health.route.ts";
import usersRoutes from "../modules/users/users.routes.ts";

const router: Router = Router();

router.use("/health", healthRoute);
router.use("/users", usersRoutes);

export default router;
