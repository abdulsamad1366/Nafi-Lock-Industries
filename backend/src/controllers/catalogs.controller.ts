import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import prisma from "../config/db";

/**
 * GET /api/catalogs
 * Public endpoint returning catalog metadata (title, brand association)
 */
export async function listCatalogs(_req: Request, res: Response, next: NextFunction) {
  try {
    const catalogs = await prisma.catalog.findMany({
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
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/catalogs/:id/download
 * Gated file stream for PDF catalogs — requires approved distributor account
 */
export async function downloadCatalog(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const catalog = await prisma.catalog.findUnique({
      where: { id },
    });

    if (!catalog) {
      return res.status(404).json({ error: "Catalog document not found" });
    }

    const filePath = path.isAbsolute(catalog.fileUrl)
      ? catalog.fileUrl
      : path.join(process.cwd(), catalog.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Catalog file missing on server storage" });
    }

    const filename = `${catalog.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
}
