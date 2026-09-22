import { Response, NextFunction } from "express";
import prisma from "../config/db";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
import {
  isUserApprovedDistributor,
  serializeProduct,
  serializeProducts,
} from "../utils/product-serializer";

export async function getAllProducts(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
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

    const isApproved = await isUserApprovedDistributor(req.user);
    res.json(serializeProducts(products, isApproved));
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { brand: true, category: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const isApproved = await isUserApprovedDistributor(req.user);
    res.json(serializeProduct(product, isApproved));
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Handle uploaded images from multer
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
      : [];

    const product = await prisma.product.create({
      data: {
        ...req.body,
        numberOfKeys: parseInt(req.body.numberOfKeys, 10) || 0,
        dealerPrice: req.body.dealerPrice ? parseFloat(req.body.dealerPrice) : null,
        minOrderQty: req.body.minOrderQty ? parseInt(req.body.minOrderQty, 10) : null,
        images,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const newImages = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
      : undefined;

    const data: Record<string, unknown> = { ...req.body };
    if (req.body.numberOfKeys) data.numberOfKeys = parseInt(req.body.numberOfKeys, 10);
    if (req.body.dealerPrice !== undefined) {
      data.dealerPrice = req.body.dealerPrice ? parseFloat(req.body.dealerPrice) : null;
    }
    if (req.body.minOrderQty !== undefined) {
      data.minOrderQty = req.body.minOrderQty ? parseInt(req.body.minOrderQty, 10) : null;
    }
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

export async function deleteProduct(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
