// modules/users/users.validation.ts
// Shared zod schemas for the users domain. Exported so routes, controllers,
// and tests can reuse the exact same validation rules.

import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(50),
  passwordHash: z.string().min(1),
});

export const userIdParamSchema = z.object({
  id: z.uuid(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;