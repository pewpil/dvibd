// middleware/error-handler.ts
// Central Express error-handling middleware (must be registered LAST). Turns
// thrown errors — especially HttpError — into consistent JSON responses.

import type { NextFunction, Request, Response } from "express";

// TODO: map HttpError -> { error: message } with its statusCode; fall back to
// 500 for unknown errors; avoid leaking internals in production.
export function errorHandler(
  _err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  res.status(500).json({ error: "Internal Server Error" });
}
