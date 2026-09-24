import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
/**
 * Purge ledger files and database records that are older than 7 days.
 */
export declare function purgeExpiredLedgers(): Promise<number>;
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
 * Retrieve all fulfilled ledger records for current distributor.
 * Automatically purges any records older than 7 days and computes live countdown.
 */
export declare function getDistributorLedgers(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/ledgers/:id/download
 * Gated file stream for private ledger PDFs — verifies ownership and enforces 7-day retention
 */
export declare function downloadLedger(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ledger.controller.d.ts.map