import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
/**
 * GET /api/distributor/me
 * Returns profile, status, and assigned sales rep (accessible to PENDING and APPROVED distributors)
 */
export declare function getDistributorMe(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * POST /api/distributor/apply
 * Legacy endpoint — distributor application is handled during signup
 */
export declare function applyDistributor(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=distributor.controller.d.ts.map