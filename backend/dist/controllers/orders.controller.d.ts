import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
/**
 * POST /api/orders
 * Create a new distributor B2B order
 */
export declare function createOrder(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET /api/orders
 * List orders for the authenticated distributor
 */
export declare function getDistributorOrders(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/orders/:id
 * Retrieve details for a specific order owned by distributor
 */
export declare function getDistributorOrderById(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=orders.controller.d.ts.map