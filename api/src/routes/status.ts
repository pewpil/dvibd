// routes/status.ts
// HTTP routes for statuses.

import { Router, type RequestHandler } from "express";

import { createStatusHandler, listStatusesHandler, getStatusHandler } from "../modules/status/status.controller.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { validate } from "../lib/validation.ts";
import { createStatusSchema } from "../modules/status/status.validation.ts";

const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  validate({ body: createStatusSchema }),
  createStatusHandler as unknown as RequestHandler,
);
router.get("/", listStatusesHandler as unknown as RequestHandler);
router.get("/:id", getStatusHandler as unknown as RequestHandler);

export default router;
