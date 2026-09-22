import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  AuthenticatedUserRequest,
  USER_JWT_SECRET,
  UserAuthPayload,
} from "./user-auth.middleware";

/**
 * optionalAuth middleware:
 * Decodes user JWT if present and valid; attaches req.user.
 * Never blocks the request if absent or invalid, allowing anonymous public browsing.
 */
export function optionalAuth(
  req: AuthenticatedUserRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, USER_JWT_SECRET) as UserAuthPayload;
    req.user = decoded;
  } catch {
    // Silently proceed for invalid or expired tokens in optional auth mode
  }
  next();
}
