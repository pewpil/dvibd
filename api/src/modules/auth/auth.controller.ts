// modules/auth/auth.controller.ts
// Controllers handle HTTP concerns only: read/validate request, call service, shape response.

import type { Request, Response } from "express";

import { login, register } from "./auth.service.ts";
import type { RegisterInput, LoginInput } from "./auth.validation.ts";

export async function registerHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const input: RegisterInput = req.body as RegisterInput;
  const { email, username, password }: RegisterInput = input;
  const result = await register(email, username, password);
  res.status(201).json(result);
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const input: LoginInput = req.body as LoginInput;
  const { email, password } = input;
  const result = await login(email, password);
  res.json(result);
}

