import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const USER_JWT_SECRET =
  process.env.USER_JWT_SECRET || "nafi-user-session-secret-key-2026";

export interface UserAuthPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "DISTRIBUTOR";
}

export interface AuthenticatedUserRequest extends Request {
  user?: UserAuthPayload;
}

/**
 * requireAuth middleware:
 * Validates user JWT from Authorization: Bearer <token>.
 * Attaches req.user = { id, email, role }.
 * Returns 401 if missing or invalid.
 */
export function requireAuth(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized — sign in required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, USER_JWT_SECRET) as UserAuthPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized — invalid or expired session" });
  }
}
