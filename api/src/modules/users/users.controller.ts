// modules/users/users.controller.ts
// Controllers handle HTTP concerns only: read/validate the request, call the
// service, and shape the response. No DB access or business rules here.
//
// These are async handlers. Express 5 automatically forwards a rejected promise
// to the error-handling middleware, so a thrown HttpError (from the service or
// the validation middleware) becomes a proper JSON error response without any
// try/catch wrapper.

import type { Request, Response } from "express";

import { HttpError } from "../../lib/http-error.ts";
import {
  createUser,
  findUserById,
  listUsers,
  type PublicUser,
} from "./users.service.ts";
import type { CreateUserInput } from "./users.validation.ts";

// GET /users
export async function list(_req: Request, res: Response): Promise<void> {
  const users: PublicUser[] = await listUsers();
  res.json(users);
}

// GET /users/:id
export async function getById(req: Request, res: Response): Promise<void> {
  const idRaw: unknown = req.params.id;
  if (typeof idRaw !== "string") {
    throw new HttpError(400, "Missing user id");
  }
  const id: string = idRaw;

  const user: PublicUser | null = await findUserById(id);
  if (user === null) {
    throw new HttpError(404, "User not found");
  }

  res.json(user);
}

// POST /users
export async function create(req: Request, res: Response): Promise<void> {
  // Validation middleware already ran and threw HttpError(400) on failure.
  // req.body is now guaranteed to match CreateUserInput.
  const input: CreateUserInput = req.body as CreateUserInput;

  const user: PublicUser = await createUser(input);
  res.status(201).json(user);
}
