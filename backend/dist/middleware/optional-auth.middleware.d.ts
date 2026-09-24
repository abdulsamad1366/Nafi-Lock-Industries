import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "./user-auth.middleware";
/**
 * optionalAuth middleware:
 * Decodes user JWT if present and valid; attaches req.user.
 * Never blocks the request if absent or invalid, allowing anonymous public browsing.
 */
export declare function optionalAuth(req: AuthenticatedUserRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=optional-auth.middleware.d.ts.map