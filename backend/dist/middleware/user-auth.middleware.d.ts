import { Request, Response, NextFunction } from "express";
export declare const USER_JWT_SECRET: string;
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
export declare function requireAuth(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=user-auth.middleware.d.ts.map