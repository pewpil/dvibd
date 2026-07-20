// routes/health.route.ts
// Liveness endpoint. Kept intentionally simple so the skeleton is runnable and
// can be probed by tooling / load balancers.

import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/", function (_req: Request, res: Response): void {
  res.json({ status: "ok" });
});

export default router;
