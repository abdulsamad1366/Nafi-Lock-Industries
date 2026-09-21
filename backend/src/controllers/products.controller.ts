import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { brand, category } = req.query;

    const where: Record<string, unknown> = { isActive: true };
    if (brand) where.brand = { slug: brand as string };
    if (category) where.category = { slug: category as string };

    const products = await prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy: { name: "asc" },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { brand: true, category: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    // Handle uploaded images from multer
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
      : [];

    const product = await prisma.product.create({
      data: {
        ...req.body,
        numberOfKeys: parseInt(req.body.numberOfKeys, 10) || 0,
        images,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const newImages = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
      : undefined;

    const data: Record<string, unknown> = { ...req.body };
    if (req.body.numberOfKeys) data.numberOfKeys = parseInt(req.body.numberOfKeys, 10);
    if (newImages && newImages.length > 0) data.images = newImages;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
