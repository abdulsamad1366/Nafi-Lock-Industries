"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCatalogs = listCatalogs;
exports.downloadCatalog = downloadCatalog;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../config/db"));
/**
 * GET /api/catalogs
 * Public endpoint returning catalog metadata (title, brand association)
 */
async function listCatalogs(_req, res, next) {
    try {
        const catalogs = await db_1.default.catalog.findMany({
            include: {
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: { uploadedAt: "desc" },
        });
        res.json(catalogs);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/catalogs/:id/download
 * Gated file stream for PDF catalogs — requires approved distributor account
 */
async function downloadCatalog(req, res, next) {
    try {
        const { id } = req.params;
        const catalog = await db_1.default.catalog.findUnique({
            where: { id },
        });
        if (!catalog) {
            return res.status(404).json({ error: "Catalog document not found" });
        }
        const filePath = path_1.default.isAbsolute(catalog.fileUrl)
            ? catalog.fileUrl
            : path_1.default.join(process.cwd(), catalog.fileUrl);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: "Catalog file missing on server storage" });
        }
        const filename = `${catalog.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/pdf");
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.pipe(res);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=catalogs.controller.js.map