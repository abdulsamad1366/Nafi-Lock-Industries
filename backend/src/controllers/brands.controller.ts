import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export async function getAllBrands(_req: Request, res: Response, next: NextFunction) {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    res.json(brands);
  } catch (err) {
    next(err);
  }
}

export async function getBrandBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          where: { isActive: true },
          include: { category: true },
        },
      },
    });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

export async function createBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await prisma.brand.create({ data: req.body });
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
}

export async function updateBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await prisma.brand.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

export async function deleteBrand(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.brand.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
