"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../../config/db"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const pdf_upload_middleware_1 = require("../../middleware/pdf-upload.middleware");
const router = (0, express_1.Router)();
// Gated by Admin authMiddleware
router.use(auth_middleware_1.authMiddleware);
/**
 * POST /api/admin/catalogs
 * Upload a brand catalog PDF
 */
router.post("/", pdf_upload_middleware_1.uploadCatalogMiddleware, async (req, res, next) => {
    try {
        const { title, brandId } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "A PDF file is required" });
        }
        if (!title) {
            return res.status(400).json({ error: "Catalog title is required" });
        }
        const fileUrl = `uploads/catalogs/${req.file.filename}`;
        const catalog = await db_1.default.catalog.create({
            data: {
                title,
                fileUrl,
                brandId: brandId || null,
            },
            include: {
                brand: true,
            },
        });
        res.status(201).json(catalog);
    }
    catch (err) {
        next(err);
    }
});
/**
 * DELETE /api/admin/catalogs/:id
 * Delete catalog and its physical file
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const catalog = await db_1.default.catalog.findUnique({
            where: { id },
        });
        if (!catalog) {
            return res.status(404).json({ error: "Catalog not found" });
        }
        // Attempt to remove physical file
        try {
            const filePath = path_1.default.isAbsolute(catalog.fileUrl)
                ? catalog.fileUrl
                : path_1.default.join(process.cwd(), catalog.fileUrl);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        catch (fileErr) {
            console.error("Failed to delete physical catalog file", fileErr);
        }
        await db_1.default.catalog.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=catalogs.routes.js.map