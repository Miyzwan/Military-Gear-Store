import type { Request, Response, NextFunction } from "express";

/**
 * Middleware that blocks the request with 401 if no active admin session exists.
 * Protects all admin-only routes (write operations for products, categories, settings).
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.adminId) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized. Please log in as admin." });
}
