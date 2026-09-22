import { Router, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import prisma from "../../config/db";
import { authMiddleware, AuthRequest } from "../../middleware/auth.middleware";
import { uploadCatalogMiddleware } from "../../middleware/pdf-upload.middleware";

const router = Router();

// Gated by Admin authMiddleware
router.use(authMiddleware);

/**
 * POST /api/admin/catalogs
 * Upload a brand catalog PDF
 */
router.post(
  "/",
  uploadCatalogMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, brandId } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "A PDF file is required" });
      }

      if (!title) {
        return res.status(400).json({ error: "Catalog title is required" });
      }

      const fileUrl = `uploads/catalogs/${req.file.filename}`;

      const catalog = await prisma.catalog.create({
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
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/admin/catalogs/:id
 * Delete catalog and its physical file
 */
router.delete("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const catalog = await prisma.catalog.findUnique({
      where: { id },
    });

    if (!catalog) {
      return res.status(404).json({ error: "Catalog not found" });
    }

    // Attempt to remove physical file
    try {
      const filePath = path.isAbsolute(catalog.fileUrl)
        ? catalog.fileUrl
        : path.join(process.cwd(), catalog.fileUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileErr) {
      console.error("Failed to delete physical catalog file", fileErr);
    }

    await prisma.catalog.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
