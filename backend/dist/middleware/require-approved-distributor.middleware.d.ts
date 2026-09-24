import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "./user-auth.middleware";
/**
 * requireApprovedDistributor middleware:
 * 1. Checks user authentication via requireAuth.
 * 2. Checks role === "DISTRIBUTOR".
 * 3. Fetches live DistributorProfile from database.
 * 4. Distinguishes:
 *    - Not a distributor -> 403 NOT_A_DISTRIBUTOR
 *    - Pending approval -> 403 DISTRIBUTOR_PENDING
 *    - Rejected -> 403 DISTRIBUTOR_REJECTED
 *    - Approved -> passes through to next()
 */
export declare function requireApprovedDistributor(req: AuthenticatedUserRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=require-approved-distributor.middleware.d.ts.map