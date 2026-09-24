import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
/**
 * POST /api/ledger-requests
 * Submit a request for an account balance statement / ledger
 */
export declare function createLedgerRequest(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/ledger-requests
 * Retrieve all ledger requests for current distributor
 */
export declare function getDistributorLedgerRequests(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/ledgers
 * Retrieve all fulfilled ledger records for current distributor
 */
export declare function getDistributorLedgers(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/ledgers/:id/download
 * Gated file stream for private ledger PDFs — verifies ownership
 */
export declare function downloadLedger(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ledger.controller.d.ts.map