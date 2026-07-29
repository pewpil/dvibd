// modules/status/status.validation.ts
// Shared zod schemas for the status domain.

import { z } from "zod";

export const createStatusSchema = z.object({
  content: z.string().min(1).max(256),
  media: z.array(z.string()).optional(),
  replyToId: z.uuid().optional(),
});

export type CreateStatusInput = z.infer<typeof createStatusSchema>;
