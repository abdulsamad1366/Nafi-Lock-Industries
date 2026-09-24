import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
export declare function getAllProducts(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getProductBySlug(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createProduct(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateProduct(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteProduct(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=products.controller.d.ts.map