// routes/auth.ts
// HTTP routes for authentication.

import { Router, type RequestHandler } from "express";

import { loginHandler, registerHandler } from "../modules/auth/auth.controller.ts";
import { validate } from "../lib/validation.ts";
import { loginSchema, registerSchema } from "../modules/auth/auth.validation.ts";

const router: Router = Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  registerHandler as unknown as RequestHandler,
);
router.post(
  "/login",
  validate({ body: loginSchema }),
  loginHandler as unknown as RequestHandler,
);

export default router;

