import { Request, Response, NextFunction } from "express";
export declare function getAllBrands(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getBrandBySlug(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createBrand(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateBrand(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteBrand(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=brands.controller.d.ts.map