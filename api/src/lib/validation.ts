// lib/validation.ts
// Centralized request validation using zod schemas. A small middleware factory
// that validates req.body, req.params, and/or req.query against provided schemas
// and throws HttpError(400) with the first error message if validation fails.
// All routes should use this instead of inline safeParse calls.

import type { Request, Response, NextFunction, RequestHandler } from "express";
import { z, type ZodSchema } from "zod";

import { HttpError } from "./http-error.ts";

type ValidationTarget = "body" | "params" | "query";

function validateSchema<T>(
  schema: ZodSchema<T>,
  value: unknown,
  target: ValidationTarget,
): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    if (issue === undefined) {
      throw new HttpError(400, `${target}: Invalid input`);
    }
    const path = issue.path.length > 0 ? `${target}.${issue.path.join(".")}` : target;
    throw new HttpError(400, `${path}: ${issue.message}`);
  }
  return result.data;
}

// The middleware validates and throws on error. Controllers should use the
// schema types (e.g., RegisterInput, LoginInput) for their handler parameters.
// The return type is a standard Express RequestHandler for router compatibility.
export function validate(options: {
  body?: ZodSchema<unknown>;
  params?: ZodSchema<unknown>;
  query?: ZodSchema<unknown>;
}): RequestHandler {
  return function (req: Request, _res: Response, next: NextFunction): void {
    try {
      if (options.body !== undefined) {
        validateSchema(options.body, req.body, "body");
      }
      if (options.params !== undefined) {
        validateSchema(options.params, req.params, "params");
      }
      if (options.query !== undefined) {
        validateSchema(options.query, req.query, "query");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}