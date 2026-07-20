// modules/users/users.controller.ts
// Controllers handle HTTP concerns only: read/validate the request, call the
// service, and shape the response. No DB access or business rules here.
//
// These are async handlers. Express 5 automatically forwards a rejected promise
// to the error-handling middleware, so a thrown HttpError (from the service or
// here) becomes a proper JSON error response without any try/catch wrapper.

import type { Request, Response } from "express";
import { z } from "zod";

import { HttpError } from "../../lib/http-error.ts";
import {
  createUser,
  findUserById,
  listUsers,
  type PublicUser,
} from "./users.service.ts";

// Minimal input contract for creating a user. (Full request-validation
// middleware is step 8; for now the create endpoint validates its own body.)
const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  passwordHash: z.string().min(1),
});

// GET /users
export async function list(_req: Request, res: Response): Promise<void> {
  const users: PublicUser[] = await listUsers();
  res.json(users);
}

// GET /users/:id
export async function getById(req: Request, res: Response): Promise<void> {
  const id: unknown = req.params.id;
  if (typeof id !== "string") {
    throw new HttpError(400, "Missing user id");
  }

  const user: PublicUser | null = await findUserById(id);
  if (user === null) {
    throw new HttpError(404, "User not found");
  }

  res.json(user);
}

// POST /users
export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid body");
  }

  const user: PublicUser = await createUser(parsed.data);
  res.status(201).json(user);
}
