import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
/**
 * GET /api/distributor/me
 * Returns profile, status, and assigned sales rep (accessible to PENDING and APPROVED distributors)
 */
export declare function getDistributorMe(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * POST /api/distributor/apply
 * Allows an existing CUSTOMER to submit an application to become a DISTRIBUTOR
 */
export declare function applyDistributor(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=distributor.controller.d.ts.map