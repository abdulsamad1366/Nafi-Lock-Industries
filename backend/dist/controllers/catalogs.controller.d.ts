import { Request, Response, NextFunction } from "express";
/**
 * GET /api/catalogs
 * Public endpoint returning catalog metadata (title, brand association)
 */
export declare function listCatalogs(_req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/catalogs/:id/download
 * Gated file stream for PDF catalogs — requires approved distributor account
 */
export declare function downloadCatalog(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=catalogs.controller.d.ts.map