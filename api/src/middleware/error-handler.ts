// middleware/error-handler.ts
// Central Express error-handling middleware (must be registered LAST). Turns
// thrown errors — especially HttpError — into consistent JSON responses.

import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../lib/http-error.ts";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Known, intentional errors carry their own status + safe message.
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Anything else is unexpected: log the detail server-side, but never leak
  // internals to the client.
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
