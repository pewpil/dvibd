// middleware/auth.ts
// Authentication middleware: verifies JWT from Authorization header and attaches user to req.

import type { Request, Response, NextFunction, RequestHandler } from "express";

import { HttpError } from "../lib/http-error.ts";
import { verifyToken, type TokenPayload } from "../lib/jwt.ts";

export function authMiddleware(): RequestHandler {
  return async function (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing or invalid Authorization header");
    }

    const token = authHeader.slice(7);
    try {
      const payload: TokenPayload = await verifyToken(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      };
      next();
    } catch (err) {
      throw new HttpError(401, "Invalid or expired token");
    }
  };
}

export function optionalAuthMiddleware(): RequestHandler {
  return async function (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.slice(7);
    try {
      const payload: TokenPayload = await verifyToken(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      };
    } catch {
      // Ignore invalid token for optional auth
    }
    next();
  };
}