// modules/status/status.controller.ts
// Controllers handle HTTP concerns only: read/validate request, call service, shape response.

import type { Request, Response } from "express";

import { createStatus, listStatuses, getStatusById } from "./status.service.ts";
import type { StatusWithAuthor } from "./status.service.ts";
import type { CreateStatusInput } from "./status.validation.ts";

// POST /status
export async function createStatusHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const input: CreateStatusInput = req.body as CreateStatusInput;
  const status: StatusWithAuthor = await createStatus(input, req.user!.id);
  res.status(201).json(status);
}

// GET /status
export async function listStatusesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const page: number = Math.max(1, Number(req.query.page) || 1);
  const limit: number = Math.min(
    100,
    Math.max(1, Number(req.query.limit) || 20),
  );
  const offset: number = (page - 1) * limit;

  const statuses: StatusWithAuthor[] = await listStatuses(limit, offset);
  res.json(statuses);
}

// GET /status/:id
export async function getStatusHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const id: string = Array.isArray(req.params.id)
    ? req.params.id[0]!
    : req.params.id!;
  const status: StatusWithAuthor = await getStatusById(id);
  res.json(status);
}
