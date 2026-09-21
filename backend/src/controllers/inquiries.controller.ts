import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export async function createInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: req.body.name,
        company: req.body.company || null,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
        brandId: req.body.brandId || null,
        productId: req.body.productId || null,
      },
    });
    res.status(201).json(inquiry);
  } catch (err) {
    next(err);
  }
}

export async function getAllInquiries(_req: Request, res: Response, next: NextFunction) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: { brand: true, product: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(inquiries);
  } catch (err) {
    next(err);
  }
}

export async function updateInquiryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(inquiry);
  } catch (err) {
    next(err);
  }
}
