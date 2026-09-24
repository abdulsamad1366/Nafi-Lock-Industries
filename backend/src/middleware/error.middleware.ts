import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("❌ Server error:", err.message);
  res.status(500).json({
    error: !process.env.DATABASE_URL
      ? "DATABASE_URL is not configured on the server environment"
      : process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
}
