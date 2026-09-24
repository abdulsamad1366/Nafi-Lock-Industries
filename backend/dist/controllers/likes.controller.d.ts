import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
/**
 * POST /api/products/:id/like
 * Add a product to the user's liked list
 */
export declare function likeProduct(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * DELETE /api/products/:id/like
 * Remove a product from the user's liked list
 */
export declare function unlikeProduct(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/users/me/liked-products
 * Retrieve all liked products for current user (gating dealer pricing based on role/status)
 */
export declare function getLikedProducts(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=likes.controller.d.ts.map