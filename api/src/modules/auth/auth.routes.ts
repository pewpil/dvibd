// modules/auth/auth.routes.ts
// HTTP routes for authentication.

import { Router, type RequestHandler } from "express";

import { loginHandler, registerHandler } from "./auth.controller.ts";
import { validate } from "../../lib/validation.ts";
import { loginSchema, registerSchema } from "./auth.validation.ts";

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

