// middleware/not-found.ts
// Catch-all for unmatched routes (registered after all real routes, before the
// error handler). Responds with a 404.

import type { Request, Response } from "express";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not Found" });
}
