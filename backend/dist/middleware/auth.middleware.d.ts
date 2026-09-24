import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    admin?: {
        id: string;
        email: string;
        role: string;
    };
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map