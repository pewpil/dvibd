// modules/users/users.routes.ts
// HTTP routes for the users domain. Wires URLs + methods to controller handlers.
// Mounted by src/routes/index.ts under "/users".

import { Router, type RequestHandler } from "express";

import { create, getById, list } from "./users.controller.ts";
import { validate } from "../../lib/validation.ts";
import { createUserSchema, userIdParamSchema } from "./users.validation.ts";

const router: Router = Router();

router.get("/", list as RequestHandler);
router.post(
  "/",
  validate({ body: createUserSchema }),
  create as unknown as RequestHandler,
);
router.get(
  "/:id",
  validate({ params: userIdParamSchema }),
  getById as unknown as RequestHandler,
);

export default router;
