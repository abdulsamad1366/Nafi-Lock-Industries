import { Request, Response, NextFunction } from "express";
/**
 * POST /api/auth/signup
 * Register a Customer or Distributor
 */
export declare function signup(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * POST /api/auth/login
 * User & Distributor Login
 */
export declare function login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=user-auth.controller.d.ts.map