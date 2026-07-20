// modules/users/users.routes.ts
// HTTP routes for the users domain. Wires URLs + methods to controller handlers.
// Mounted by src/routes/index.ts under "/users".

import { Router } from "express";

import { create, getById, list } from "./users.controller.ts";

const router: Router = Router();

router.get("/", list);
router.post("/", create);
router.get("/:id", getById);

export default router;
