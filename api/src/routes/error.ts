import { Context, Hono } from "@hono/hono";
import HttpError from "../lib/error.ts";

export default function registerErrorHandler(app: Hono) {
  app.onError(function(e: Error, c: Context) {
    if (e instanceof HttpError) {
      return c.json({ error: e.message }, e.getStatusCode());
    }
    return c.json({ error: e.message }, 400);
  });
}
